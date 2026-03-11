import { Exam } from './types';

export const generateStandalonHTML = (exam: Exam): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${exam.title} - ExamMaster Interactive</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --primary-light: #eff6ff;
      --success: #10b981;
      --success-light: #ecfdf5;
      --error: #ef4444;
      --error-light: #fef2f2;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --bg-page: #f8fafc;
      --bg-card: #ffffff;
      --radius: 20px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    body {
      background-color: var(--bg-page);
      color: var(--text-main);
      line-height: 1.6;
      display: flex;
      justify-content: center;
      padding: 40px 20px;
      min-height: 100vh;
    }

    .container {
      width: 100%;
      max-width: 800px;
      background: var(--bg-card);
      border-radius: 32px;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05);
      border: 1px solid var(--border);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* ---- Header & Nav ---- */
    .header {
      padding: 40px 40px 30px;
      background: var(--bg-card);
      border-bottom: 2px solid var(--border);
      position: relative;
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 6px;
      background: var(--primary);
    }

    .exam-title {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 12px;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .exam-desc {
      font-size: 16px;
      color: var(--text-muted);
    }
    
    .progress-bar-container {
       width: 100%;
       height: 6px;
       background: var(--border);
       overflow: hidden;
    }
    .progress-bar {
       height: 100%;
       background: var(--primary);
       width: 0%;
       transition: width 0.3s ease;
    }

    /* ---- Content Area ---- */
    .content {
      padding: 40px;
    }

    /* Screens */
    .screen {
      display: none;
      animation: fadeIn 0.4s ease;
    }
    .screen.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Input Screen */
    .input-group {
      margin-bottom: 30px;
    }
    .input-group label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    .input-group input {
      width: 100%;
      padding: 16px 20px;
      font-size: 16px;
      border: 2px solid var(--border);
      border-radius: 16px;
      outline: none;
      transition: border-color 0.2s;
    }
    .input-group input:focus {
      border-color: var(--primary);
    }

    /* Question Screen */
    .question-nav-info {
       display: flex;
       align-items: center;
       justify-content: space-between;
       margin-bottom: 24px;
       font-weight: 600;
       color: var(--primary);
    }

    .question-bento {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 32px;
      margin-bottom: 30px;
    }

    .question-text {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 24px;
      line-height: 1.4;
    }

    .options-grid {
      display: grid;
      gap: 12px;
    }

    .option-btn {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 16px 24px;
      background: var(--bg-card);
      border: 2px solid var(--border);
      border-radius: 16px;
      font-size: 16px;
      font-weight: 500;
      color: var(--text-main);
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
    }

    .option-btn:hover {
      background: var(--bg-page);
      border-color: #cbd5e1;
    }

    .option-btn.selected {
      background: var(--primary-light);
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
    }

    .option-indicator {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid var(--border);
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .option-btn.selected .option-indicator {
       border-color: var(--primary);
       background: var(--primary);
    }
    .option-btn.selected .option-indicator::after {
       content: '';
       width: 8px;
       height: 8px;
       background: white;
       border-radius: 50%;
    }

    /* Actions */
    .actions {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }

    .btn {
      padding: 16px 32px;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }
    .btn-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2);
    }
    .btn-primary:disabled {
      background: #94a3b8;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .btn-secondary {
      background: var(--bg-page);
      color: var(--text-muted);
      border: 1px solid var(--border);
    }
    .btn-secondary:hover {
      background: #e2e8f0;
      color: var(--text-main);
    }
    
    .hidden {
       display: none !important;
    }

    /* Results Screen */
    .results-hero {
       text-align: center;
       padding: 40px 20px;
       border-radius: 24px;
       margin-bottom: 30px;
       border: 2px solid transparent;
    }
    .results-hero.pass {
       background: var(--success-light);
       border-color: #a7f3d0;
    }
    .results-hero.fail {
       background: var(--error-light);
       border-color: #fecaca;
    }
    
    .score-percentage {
       font-size: 72px;
       font-weight: 900;
       line-height: 1;
       margin-bottom: 12px;
       letter-spacing: -0.05em;
    }
    .pass .score-percentage { color: var(--success); }
    .fail .score-percentage { color: var(--error); }
    
    .score-details {
       font-size: 18px;
       font-weight: 600;
       color: var(--text-main);
    }
    
    .review-list {
       display: flex;
       flex-direction: column;
       gap: 16px;
    }
    .review-item {
       padding: 24px;
       border-radius: 16px;
       border: 1px solid var(--border);
       background: var(--bg-page);
    }
    .review-item.correct { border-left: 6px solid var(--success); }
    .review-item.incorrect { border-left: 6px solid var(--error); }
    
    .review-q {
       font-weight: 700;
       font-size: 16px;
       margin-bottom: 12px;
    }
    .review-ans {
       font-size: 14px;
       padding: 12px;
       border-radius: 8px;
       background: var(--bg-card);
       border: 1px solid var(--border);
       margin-bottom: 8px;
    }
    .review-ans.correct-ans {
       background: var(--success-light);
       border-color: #a7f3d0;
       color: #065f46;
       font-weight: 600;
    }

    @media print {
      body { padding: 0; background: white; }
      .container { box-shadow: none; border: none; max-width: 100%; border-radius: 0; }
      .btn, .actions { display: none !important; }
      .screen { display: block !important; animation: none; }
      #start-screen, #question-screen { display: none !important; }
      #results-screen { display: block !important; }
      .review-item { page-break-inside: avoid; break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="exam-title">${exam.title}</h1>
      <p class="exam-desc">${exam.description || 'Interactive Offline Exam'}</p>
    </div>
    <div class="progress-bar-container">
       <div class="progress-bar" id="progress-bar"></div>
    </div>

    <div class="content">
      
      <!-- Start Screen -->
      <div id="start-screen" class="screen active">
        <div class="input-group">
          <label for="student-name">Enter your full name to begin</label>
          <input type="text" id="student-name" placeholder="John Doe" autocomplete="off">
        </div>
        <button class="btn btn-primary" style="width: 100%;" id="start-btn">Start Exam</button>
      </div>

      <!-- Question Screen -->
      <div id="question-screen" class="screen">
        <div class="question-nav-info">
           <span id="q-counter">Question 1 of X</span>
        </div>
        
        <div class="question-bento">
           <div class="question-text" id="q-text">Loading question...</div>
           <div class="options-grid" id="q-options">
             <!-- Options injected via JS -->
           </div>
        </div>

        <div class="actions">
          <button class="btn btn-secondary" id="prev-btn">Previous</button>
          <button class="btn btn-primary" id="next-btn">Next</button>
        </div>
      </div>

      <!-- Results Screen -->
      <div id="results-screen" class="screen">
        <div class="results-hero" id="results-hero">
           <div class="score-percentage" id="score-pct">0%</div>
           <div class="score-details"><span id="score-points">0</span> out of <span id="total-points">0</span> correct</div>
           <div style="margin-top: 8px; font-weight: 600; color: var(--text-muted);" id="student-display-name"></div>
        </div>
        
        <h3 style="margin-bottom: 20px; font-size: 20px;">Review your answers:</h3>
        <div class="review-list" id="review-list">
           <!-- Review injected via JS -->
        </div>
        
        <div class="actions" style="margin-top: 40px;">
           <button class="btn btn-secondary" onclick="window.location.reload()">Take Again</button>
           <button class="btn btn-primary" onclick="window.print()">Print Results</button>
        </div>
      </div>

    </div>
  </div>

  <script>
    // --- Data Injected from React ---
    const EXAM_DATA = ${JSON.stringify(exam)};
    
    // --- State ---
    let studentName = '';
    let currentQIndex = 0;
    let answers = {}; // { questionId: selectedOptionId }

    // --- DOM Elements ---
    const screens = {
       start: document.getElementById('start-screen'),
       question: document.getElementById('question-screen'),
       results: document.getElementById('results-screen')
    };
    
    const ui = {
       nameInput: document.getElementById('student-name'),
       startBtn: document.getElementById('start-btn'),
       qCounter: document.getElementById('q-counter'),
       qText: document.getElementById('q-text'),
       qOptions: document.getElementById('q-options'),
       prevBtn: document.getElementById('prev-btn'),
       nextBtn: document.getElementById('next-btn'),
       progressBar: document.getElementById('progress-bar')
    };

    // --- Logic ---
    function switchScreen(screenName) {
       Object.values(screens).forEach(s => s.classList.remove('active'));
       screens[screenName].classList.add('active');
    }

    ui.startBtn.addEventListener('click', () => {
       const name = ui.nameInput.value.trim();
       if (!name) {
          alert('Please enter your name.');
          ui.nameInput.focus();
          return;
       }
       studentName = name;
       switchScreen('question');
       renderQuestion(0);
    });

    ui.nameInput.addEventListener('keypress', (e) => {
       if (e.key === 'Enter') ui.startBtn.click();
    });

    function renderQuestion(index) {
       currentQIndex = index;
       const q = EXAM_DATA.questions[index];
       
       // Update Header
       ui.qCounter.textContent = \`Question \${index + 1} of \${EXAM_DATA.questions.length}\`;
       const progress = ((index + 1) / EXAM_DATA.questions.length) * 100;
       ui.progressBar.style.width = \`\${progress}%\`;
       
       // Update Question Text
       ui.qText.textContent = q.text;
       
       // Render Options
       ui.qOptions.innerHTML = '';
       q.options.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'option-btn';
          if (answers[q.id] === opt.id) btn.classList.add('selected');
          
          btn.innerHTML = \`
             <div class="option-indicator"></div>
             <span>\${opt.text}</span>
          \`;
          
          btn.addEventListener('click', () => {
             // Visual selection update
             document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
             btn.classList.add('selected');
             // Save answer
             answers[q.id] = opt.id;
          });
          
          ui.qOptions.appendChild(btn);
       });
       
       // Update Nav Buttons
       ui.prevBtn.classList.toggle('hidden', index === 0);
       
       if (index === EXAM_DATA.questions.length - 1) {
          ui.nextBtn.textContent = 'Submit Exam';
          ui.nextBtn.classList.remove('btn-secondary');
          ui.nextBtn.classList.add('btn-primary');
       } else {
          ui.nextBtn.textContent = 'Next';
       }
    }

    ui.prevBtn.addEventListener('click', () => {
       if (currentQIndex > 0) renderQuestion(currentQIndex - 1);
    });

    ui.nextBtn.addEventListener('click', () => {
       if (currentQIndex < EXAM_DATA.questions.length - 1) {
          renderQuestion(currentQIndex + 1);
       } else {
          // Submit
          const totalAnswered = Object.keys(answers).length;
          if (totalAnswered < EXAM_DATA.questions.length) {
             if (!confirm(\`You have only answered \${totalAnswered} of \${EXAM_DATA.questions.length} questions. Are you sure you want to submit?\`)) {
                return;
             }
          }
          calculateAndShowResults();
       }
    });

    function calculateAndShowResults() {
       let score = 0;
       const reviewList = document.getElementById('review-list');
       reviewList.innerHTML = '';

       EXAM_DATA.questions.forEach((q, idx) => {
          const selectedId = answers[q.id];
          const isCorrect = selectedId === q.correctAnswer;
          if (isCorrect) score++;

          const selectedOpt = q.options.find(o => o.id === selectedId);
          const correctOpt = q.options.find(o => o.id === q.correctAnswer);

          const item = document.createElement('div');
          item.className = \`review-item \${isCorrect ? 'correct' : 'incorrect'}\`;
          
          let html = \`
             <div class="review-q">\${idx + 1}. \${q.text}</div>
             <div class="review-ans"><strong>Your Answer:</strong> \${selectedOpt ? selectedOpt.text : '<i>Did not answer</i>'}</div>
          \`;

          if (!isCorrect) {
             html += \`<div class="review-ans correct-ans"><strong>Correct Answer:</strong> \${correctOpt.text}</div>\`;
          }
          item.innerHTML = html;
          reviewList.appendChild(item);
       });

       const percentage = Math.round((score / EXAM_DATA.questions.length) * 100);
       const isPass = percentage >= 50;

       document.getElementById('score-pct').textContent = \`\${percentage}%\`;
       document.getElementById('score-points').textContent = score;
       document.getElementById('total-points').textContent = EXAM_DATA.questions.length;
       document.getElementById('student-display-name').textContent = \`Student: \${studentName}\`;

       const hero = document.getElementById('results-hero');
       hero.className = \`results-hero \${isPass ? 'pass' : 'fail'}\`;

       // Hide progress bar on results
       document.querySelector('.progress-bar-container').style.display = 'none';

       switchScreen('results');
    }
  </script>
</body>
</html>`;
};


export const downloadHTML = (exam: Exam) => {
  const html = generateStandalonHTML(exam);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${exam.title.replace(/\s+/g, '_')}_exam.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


/**
 * Valid PDF generation bypassing corrupt blob generation.
 * This opens the beautifully formatted HTML in a hidden print iframe,
 * triggering the browser's native, high-quality "Save as PDF" / Print dialog.
 */
export const downloadPDF = (exam: Exam) => {
  const html = generateStandalonHTML(exam);

  // Create an invisible iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  // Write the modern HTML template into the iframe
  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);

    // Inject print instruction script
    doc.write(`
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    `);
    doc.close();
  }

  // Cleanup: Remove the iframe after the print dialog resolves
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 10000); // 10s wait before garbage collecting iframe
};
