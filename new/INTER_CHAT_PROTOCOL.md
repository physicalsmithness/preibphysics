# Pre-IB (single science / 4SS0): INTER_CHAT_PROTOCOL

How the Pre-IB chats coordinate. Pre-IB runs an Architecture chat and one or more Authoring chats (topic 7 radioactivity, topic 8 atoms, and onward). These working principles for inter-chat discussion are the discipline that keeps several chats building one coherent project without an out-of-band channel. They are ported from the GCSE Physics Overview standing principles and apply unchanged here.

## Principle A: Read the shared state. It is the communication.

Inter-chat communication is asynchronous and file-mediated. There is no out-of-band channel. If you do not read the shared state, you are not in the conversation. The most common failure across these projects is chats that do not read the threads or state docs addressed to them; everything else depends on the reading discipline.

On every session start, before substantive work:

- Read your own memory if you have one (the MEMORY.md index and any relevant entries).
- Read the project's state docs. This project already has them; it just keeps them under topic-specific names, not the generic ones. See `STATE.md` for the index (decisions live in `HANDOVER_NOTES.md` and `topic8_decisions.md`; design and schema in `SCHEMA_v0_5_NEW_TYPES.md`, `engine.js`, and the registries; author briefs in the `AUTHOR_BRIEF_*` files; open questions in `HANDOVER_NOTES.md` and the `*_GOTCHAS.md` files). You do not need to create generic-named copies of any of these.
- Open `inter_chat/` and read any thread addressed to your role with status OPEN, especially any bumped since your last visit.

Then surface what you found in your first substantive turn, as evidence the state is absorbed, not as a status report: "the latest brief says X; open question Y will gate this; Z changed since I was last here." A chat that wakes and asks "what shall we do?" without first reading shared state is failing the role.

## Principle B: Cite decision numbers with their substance, never opaquely

When citing a decision by number (d001, d015) in any doc, thread, or report, name what it is about in the same line: write "d004 (atoms tagged at authoring time)", never just "d004". Decision numbers without their substance turn the protocol into bureaucracy that Smith and other chats cannot follow without a lookup. The whole point is that a human can scan the protocol's outputs and see what is being decided.

## How threads work

All cross-chat communication goes through an `inter_chat/` folder. A thread is a markdown file named `<FromRole>_<ToRole>_<topic>.md`, with a status line (OPEN / RESOLVED) near the top and dated entries, newest at the bottom.

- **Respond with substance, agree by silence.** On a thread that lists defaults explicitly, silence means assent; respond only where you have something to add or contest.
- **No silent absorption.** Do not fold a new misconception, qtype, or tag into an existing bucket without flagging it. New patterns found during authoring are surfaced explicitly (a NEW_FLAG or NEW_QTYPE note) for Architecture to ratify.
- **Both think; neither prescribes.** Authoring is closest to the material and proposes formats, slugs, and stimulus shapes; Architecture holds the cross-topic view and ratifies, refines, or recommends. Architecture should encourage authoring to think for itself, especially on first encounter with a topic; authoring is free to push back. The flow runs both ways.

## Cross-project threads (Trilogy)

Pre-IB and Trilogy are peers that cross-fertilise, not parent and child. Cross-project threads live in `inter_chat/` too, named `PreIB_Trilogy_<topic>.md`. The GCSE Physics Overview seat brokers these and pulls them on its check-ins. See the boundary note the Overview seat provided for the relationship.

## Housekeeping

- No em-dash character (U+2014). Use commas, parentheses, semicolons, or shorter sentences.
- Where the canonical fuller principles are wanted (atomic error tracking, tone, board and tier handling), mount the GCSE Physics Overview folder read-only and read `dispatch_packets/standing_principles.md`. This file carries only the two coordination principles needed to make inter-chat discussion work.
