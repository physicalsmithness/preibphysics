// audit_atoms.js
//
// Cross-checks atom registries against question `atoms: [...]` declarations.
// Reports orphan atoms (declared in registry, never referenced by any
// question) and unknown atoms (referenced by a question but not declared in
// any registry — typo catcher).
//
// Run from the live folder:
//   cd G:\My Drive\github local files\preibphysics\new
//   node audit_atoms.js               # default: audit Topic 7 + Topic 8
//   node audit_atoms.js topic7        # just Topic 7
//   node audit_atoms.js topic8        # just Topic 8
//
// Exits 0 if clean, 1 if either kind of issue is found.

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

// ────────────────────────────────────────────────────────────────────────
// Per-topic configuration. The script reads the live engine.js and the
// per-topic question file, runs them in a sandbox, and inspects the
// resulting globals. No HTTP, no browser, no transpile.
// ────────────────────────────────────────────────────────────────────────

const TOPICS = {
  topic7: {
    label: "Topic 7 (Radioactivity)",
    // Topic 7 uses engine.js's default ATOMS (no per-topic config).
    questionsFile: "topic7_radioactivity.js",
    questionsVar: "PREIB_RAD_QUESTIONS",
    configFile: null  // Topic 7 has no config file; engine defaults apply.
  },
  topic8: {
    label: "Topic 8 (Astrophysics)",
    questionsFile: "topic8/topic8_questions.js",
    questionsVar: "PREIB_TOPIC8_QUESTIONS",
    configFile: "topic8/topic8_config.js"
  }
};

// ────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────

function readFile(p) {
  try { return fs.readFileSync(p, "utf-8"); }
  catch (e) {
    console.error("Could not read " + p + ": " + e.message);
    process.exit(2);
  }
}

// Extract the ATOMS object from engine.js by eval-ing the const declaration.
// The default block is ~80 lines starting with `const ATOMS = TOPIC_CONFIG.atoms ||`.
// We strip everything outside that declaration, evaluate it as an object literal,
// and return the result.
function extractEngineDefaultAtoms() {
  const src = readFile(path.join(__dirname, "engine.js"));
  const m = src.match(/const ATOMS = TOPIC_CONFIG\.atoms \|\| (\{[\s\S]*?\n  \});/m);
  if (!m) {
    console.error("Could not find the ATOMS default block in engine.js. Has it moved?");
    process.exit(2);
  }
  // Evaluate the captured object literal.
  return vm.runInNewContext("(" + m[1] + ")", {});
}

// Extract a per-topic config's atoms by running the file in a sandbox and
// reading window.TOPIC_CONFIG.atoms. The config file declares
// `window.TOPIC_CONFIG = {...}`, so we provide a minimal `window` shim.
function extractTopicConfigAtoms(configFilePath) {
  const src = readFile(configFilePath);
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  const cfg = sandbox.window.TOPIC_CONFIG;
  if (!cfg) return {};
  return cfg.atoms || {};
}

// Extract a question array by running its file and reading the named global.
function extractQuestions(questionsFilePath, varName) {
  const src = readFile(questionsFilePath);
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  const arr = sandbox.window[varName];
  if (!Array.isArray(arr)) {
    console.error("Could not find array global " + varName + " in " + questionsFilePath);
    process.exit(2);
  }
  return arr;
}

// Collect all atom ids referenced by the question bank, including instance-level
// atom arrays (instances can override fields on the base question, including
// atoms — see schema v0.4 §4).
function collectReferencedAtoms(questions) {
  const refs = new Map(); // atomId → [question ids that reference it]
  function note(atomId, qid) {
    if (!refs.has(atomId)) refs.set(atomId, []);
    refs.get(atomId).push(qid);
  }
  questions.forEach(function (q) {
    if (Array.isArray(q.atoms)) {
      q.atoms.forEach(function (a) { note(a, q.id); });
    }
    if (Array.isArray(q.instances)) {
      q.instances.forEach(function (inst, idx) {
        if (Array.isArray(inst.atoms)) {
          inst.atoms.forEach(function (a) { note(a, q.id + "[" + idx + "]"); });
        }
      });
    }
  });
  return refs;
}

// Collect all atom ids declared by registries.
function collectDeclaredAtoms(atomsObj) {
  const declared = new Map(); // atomId → { subtag, atom }
  Object.keys(atomsObj).forEach(function (subtag) {
    const arr = atomsObj[subtag];
    if (!Array.isArray(arr)) return;
    arr.forEach(function (atom) {
      if (declared.has(atom.id)) {
        console.warn("WARNING: atom id collision: " + atom.id + " declared in multiple registries");
      }
      declared.set(atom.id, { subtag: subtag, atom: atom });
    });
  });
  return declared;
}

// ────────────────────────────────────────────────────────────────────────
// Audit one topic
// ────────────────────────────────────────────────────────────────────────

function auditTopic(topicKey) {
  const topic = TOPICS[topicKey];
  console.log("\n──────────────────────────────────────────────────────────");
  console.log("Auditing: " + topic.label);
  console.log("──────────────────────────────────────────────────────────");

  // Atoms come either from per-topic config (if present) or from engine.js defaults.
  let atomsObj;
  if (topic.configFile) {
    atomsObj = extractTopicConfigAtoms(path.join(__dirname, topic.configFile));
    console.log("Atoms source: " + topic.configFile);
  } else {
    atomsObj = extractEngineDefaultAtoms();
    console.log("Atoms source: engine.js default ATOMS");
  }

  const questions = extractQuestions(path.join(__dirname, topic.questionsFile), topic.questionsVar);
  console.log("Questions: " + questions.length + " loaded from " + topic.questionsFile);

  const declared = collectDeclaredAtoms(atomsObj);
  const referenced = collectReferencedAtoms(questions);

  console.log("Declared atoms: " + declared.size + " across " + Object.keys(atomsObj).length + " registries");
  console.log("Referenced atoms: " + referenced.size + " (used by " +
    Array.from(referenced.values()).reduce(function (s, arr) { return s + arr.length; }, 0) +
    " question references)");

  // Orphans: declared but never referenced.
  const orphans = [];
  declared.forEach(function (info, atomId) {
    if (!referenced.has(atomId)) orphans.push({ id: atomId, subtag: info.subtag });
  });

  // Unknowns: referenced but not declared (typo catcher).
  const unknowns = [];
  referenced.forEach(function (qids, atomId) {
    if (!declared.has(atomId)) unknowns.push({ id: atomId, qids: qids });
  });

  let issues = 0;

  if (orphans.length === 0) {
    console.log("\n✓ No orphan atoms (every declared atom is used by at least one question).");
  } else {
    console.log("\n✗ " + orphans.length + " orphan atom(s) — declared in registry but no question references them:");
    // Group by subtag for readability.
    const bySubtag = {};
    orphans.forEach(function (o) {
      if (!bySubtag[o.subtag]) bySubtag[o.subtag] = [];
      bySubtag[o.subtag].push(o.id);
    });
    Object.keys(bySubtag).sort().forEach(function (subtag) {
      console.log("  [" + subtag + "]");
      bySubtag[subtag].sort().forEach(function (id) {
        console.log("    " + id);
      });
    });
    issues += orphans.length;
  }

  if (unknowns.length === 0) {
    console.log("\n✓ No unknown atoms (every question's atom reference matches a registry id).");
  } else {
    console.log("\n✗ " + unknowns.length + " unknown atom reference(s) — used by questions but not declared in any registry:");
    unknowns.forEach(function (u) {
      console.log("  " + u.id + "  ← " + u.qids.join(", "));
    });
    issues += unknowns.length;
  }

  // Coverage summary: for each registry, how many of its atoms are referenced.
  console.log("\nCoverage summary by registry:");
  Object.keys(atomsObj).sort().forEach(function (subtag) {
    const total = atomsObj[subtag].length;
    const used = atomsObj[subtag].filter(function (a) { return referenced.has(a.id); }).length;
    const pct = total === 0 ? 0 : Math.round(100 * used / total);
    console.log("  [" + subtag + "]  " + used + "/" + total + " atoms used by ≥1 question (" + pct + "%)");
  });

  return issues;
}

// ────────────────────────────────────────────────────────────────────────
// CLI entry
// ────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const topicsToRun = args.length === 0 ? Object.keys(TOPICS) : args;

let totalIssues = 0;
topicsToRun.forEach(function (key) {
  if (!TOPICS[key]) {
    console.error("Unknown topic: " + key + ". Known: " + Object.keys(TOPICS).join(", "));
    process.exit(2);
  }
  totalIssues += auditTopic(key);
});

console.log("\n──────────────────────────────────────────────────────────");
if (totalIssues === 0) {
  console.log("All audited topics clean. ✓");
  process.exit(0);
} else {
  console.log("Found " + totalIssues + " issue(s) across audited topics.");
  process.exit(1);
}
