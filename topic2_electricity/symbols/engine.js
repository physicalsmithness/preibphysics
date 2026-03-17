// ==========================================
// CIRCUIT SYMBOL MASTERY - GAME ENGINE
// ==========================================

// --- State Variables ---
let deck = [];
let questionsAnswered = 0;
let history = [];
let stats = { totalAnswered: 0, totalCorrect: 0 };

// --- Initialization: Load Saves from LocalStorage ---
try {
    const savedHistory = localStorage.getItem('circuit_history');
    const savedStats = localStorage.getItem('circuit_stats');
    if (savedHistory) history = JSON.parse(savedHistory);
    if (savedStats) stats = JSON.parse(savedStats);
} catch(e) { 
    console.error("Could not load save data", e);
    history = []; 
    stats = { totalAnswered: 0, totalCorrect: 0 }; 
}

// --- Utility: Fisher-Yates Array Shuffle ---
function shuffleArray(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        let temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temp;
    }
    return array;
}

// --- UI Update: Refresh the Score and History Dots ---
function updateStatsDisplay() {
    const tracker = document.getElementById('history-tracker');
    tracker.innerHTML = '';
    
    if (history.length === 0) {
        tracker.innerHTML = '<span style="color:#bdc3c7; font-size:0.9rem; line-height:28px;">Awaiting first answer...</span>';
    } else {
        history.forEach(result => {
            let cssClass = result === 'correct' ? 'dot-correct' : (result === 'half' ? 'dot-half' : 'dot-wrong');
            let icon = result === 'correct' ? '✓' : (result === 'half' ? '!' : '✗');
            tracker.innerHTML += `<div class="history-dot ${cssClass}"> ${icon} </div>`;
        });
    }
    
    let percentage = stats.totalAnswered === 0 ? 0 : Math.round((stats.totalCorrect / stats.totalAnswered) * 100);
    document.getElementById('score-tracker').innerText = `Score: ${stats.totalCorrect} / ${stats.totalAnswered} (${percentage}%)`;
}

// --- State Update: Save Progress ---
function saveProgress(status) {
    history.push(status);
    if (history.length > 10) history.shift(); // Keep only last 10
    
    stats.totalAnswered++;
    if (status === 'correct') stats.totalCorrect++;
    else if (status === 'half') stats.totalCorrect += 0.5;
    
    try { 
        localStorage.setItem('circuit_history', JSON.stringify(history)); 
        localStorage.setItem('circuit_stats', JSON.stringify(stats));
    } catch(e) {
        console.error("Could not save progress", e);
    }
    
    updateStatsDisplay();
}

// --- Core Loop: Load a Random Question ---
function loadRandomQuestion() {
    // If deck is empty, copy the master 'qs' array (from questions.js) and shuffle it
    if (deck.length === 0) { 
        deck = [...qs]; 
        shuffleArray(deck); 
        questionsAnswered = 0; 
    }
    
    let currentQ = deck.pop();
    
    document.getElementById('deck-counter').innerText = `Question ${questionsAnswered + 1} of ${qs.length} (No Repeats)`;
    
    let isMulti = currentQ.m; 
    let optionsToDisplay = [];

    // 1. Pick Correct Options
    let correctPool = isMulti ? currentQ.c : [currentQ.c[Math.floor(Math.random() * currentQ.c.length)]];
    correctPool.forEach(opt => optionsToDisplay.push({...opt, status: 'correct'}));
    
    // 2. Pick Distractors (Wrong Options) to fill out 4 slots
    let wrongPool = shuffleArray([...currentQ.w]);
    let neededDistractors = 4 - optionsToDisplay.length;
    wrongPool.slice(0, neededDistractors).forEach(opt => optionsToDisplay.push({...opt, status: 'wrong'}));

    // 3. Shuffle the final 4 options
    optionsToDisplay = shuffleArray(optionsToDisplay);

    // 4. Generate HTML for Options
    let optionsHtml = '';
    optionsToDisplay.forEach((opt, idx) => {
        let inputType = isMulti ? 'checkbox' : 'radio'; 
        let indicatorClass = isMulti ? 'check-style' : 'radio-style';
        
        // Inject class into SVG string if it's an image, otherwise render text
        let content = opt.svg ? opt.svg.replace('<svg ', '<svg class="opt-svg" ') : `<span class="opt-text">${opt.t}</span>`;
        
        optionsHtml += `
            <label class="option" id="opt-${idx}">
                <input type="${inputType}" name="answer" value="${opt.status}" data-feedback="${encodeURIComponent(opt.fb)}">
                <div class="indicator ${indicatorClass}"></div>
                ${content}
            </label>
        `;
    });

    // 5. Generate Prompt Image HTML (if any)
    let promptHtml = currentQ.img ? `<div class="prompt-svg-container">${currentQ.img.replace('<svg ', '<svg class="opt-svg" ')}</div>` : '';

    // 6. Inject into DOM
    document.getElementById('quiz-container').innerHTML = `
        <div class="question-card active">
            <h2 class="question-text">${currentQ.t}</h2>
            ${isMulti ? '<div class="question-subtext">(Select all that apply)</div>' : ''}
            ${promptHtml}
            <div class="options-grid">${optionsHtml}</div>
            <div id="feedback" class="feedback-area"></div>
            <button id="btn-submit" class="btn btn-submit">Check Answer</button>
            <button id="btn-next" class="btn btn-next">Next Question</button>
            <div class="hint-text">Tip: You can press 'Enter' to submit or go to the next question.</div>
        </div>
    `;

    // 7. Attach Listeners for Selection Styling
    document.querySelectorAll('.option input').forEach(input => {
        input.addEventListener('change', function() {
            if (isMulti) { 
                if(this.checked) this.closest('.option').classList.add('selected'); 
                else this.closest('.option').classList.remove('selected'); 
            } else { 
                document.querySelectorAll('.option').forEach(o => o.classList.remove('selected')); 
                this.closest('.option').classList.add('selected'); 
            }
        });
    });

    // 8. Attach Submit Logic
    document.getElementById('btn-submit').addEventListener('click', function() {
        const selectedInputs = Array.from(document.querySelectorAll('input[name="answer"]:checked'));
        const feedbackDiv = document.getElementById('feedback');
        
        if (selectedInputs.length === 0) { 
            feedbackDiv.style.display = 'block'; 
            feedbackDiv.className = 'feedback-area error'; 
            feedbackDiv.innerText = "Please select an answer first!"; 
            return; 
        }

        feedbackDiv.style.display = 'block'; 
        document.querySelectorAll('.option').forEach(o => o.classList.add('disabled')); 
        questionsAnswered++; 

        if (isMulti) {
            let hasWrong = false; 
            let correctCount = 0; 
            let combinedFeedback = [];
            
            selectedInputs.forEach(input => {
                combinedFeedback.push(decodeURIComponent(input.getAttribute('data-feedback'))); 
                if (input.value === 'correct') { 
                    correctCount++; 
                    input.closest('.option').classList.add('correct-choice'); 
                } else { 
                    hasWrong = true; 
                    input.closest('.option').classList.add('wrong-choice'); 
                } 
            });

            // Highlight correct answers that the user missed
            document.querySelectorAll('input[value="correct"]').forEach(input => { 
                if (!input.checked) input.closest('.option').classList.add('half-choice'); 
            });

            if (hasWrong) { 
                feedbackDiv.className = 'feedback-area error'; 
                feedbackDiv.innerText = combinedFeedback.join(" "); 
                saveProgress('wrong'); 
            } else if (correctCount > 0 && correctCount < correctPool.length) { 
                feedbackDiv.className = 'feedback-area warning'; 
                feedbackDiv.innerText = "You missed a correct option (highlighted in yellow)! " + combinedFeedback.join(" "); 
                saveProgress('half'); 
            } else { 
                feedbackDiv.className = 'feedback-area success'; 
                feedbackDiv.innerText = "Excellent! " + combinedFeedback.join(" "); 
                saveProgress('correct'); 
            }
        } else {
            let input = selectedInputs[0]; 
            feedbackDiv.innerText = decodeURIComponent(input.getAttribute('data-feedback'));

            if (input.value === 'correct') { 
                input.closest('.option').classList.add('correct-choice'); 
                feedbackDiv.className = 'feedback-area success'; 
                saveProgress('correct'); 
            } else { 
                input.closest('.option').classList.add('wrong-choice'); 
                feedbackDiv.className = 'feedback-area error'; 
                // Show them what the correct answer actually was
                document.querySelector('input[value="correct"]').closest('.option').classList.add('correct-choice'); 
                saveProgress('wrong'); 
            }
        }

        this.style.display = 'none'; 
        document.getElementById('btn-next').style.display = 'block';
    });

    document.getElementById('btn-next').addEventListener('click', loadRandomQuestion);
}

// --- Global Keyboard Shortcut: Enter Key ---
document.addEventListener('keydown', e => { 
    if (e.key === 'Enter') { 
        e.preventDefault(); 
        let submitBtn = document.getElementById('btn-submit'); 
        let nextBtn = document.getElementById('btn-next'); 
        
        if (submitBtn && submitBtn.style.display !== 'none') submitBtn.click(); 
        else if (nextBtn && nextBtn.style.display !== 'none') nextBtn.click(); 
    }
});

// --- Boot Up ---
updateStatsDisplay(); 
loadRandomQuestion();