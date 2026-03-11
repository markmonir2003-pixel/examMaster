import { Exam } from './types';

export const generateStandalonHTML = (exam: Exam): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${exam.title} - Exam</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header {
      padding: 40px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      text-align: center;
    }

    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }

    .header p {
      opacity: 0.9;
      font-size: 14px;
    }

    .content {
      padding: 40px;
    }

    .student-info {
      margin-bottom: 30px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 6px;
    }

    .student-info label {
      display: block;
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 6px;
      font-weight: 500;
    }

    .student-info input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
    }

    .questions {
      margin-top: 40px;
    }

    .question-card {
      margin-bottom: 30px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }

    .question-header {
      padding: 16px 20px;
      background: #f3f4f6;
      border-bottom: 1px solid #e5e7eb;
    }

    .question-number {
      display: inline-block;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .question-text {
      font-size: 16px;
      font-weight: 500;
      color: #111827;
      margin: 0;
    }

    .question-type {
      display: inline-block;
      font-size: 11px;
      background: #dbeafe;
      color: #1e40af;
      padding: 4px 8px;
      border-radius: 3px;
      margin-left: 8px;
    }

    .options {
      padding: 20px;
    }

    .option {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid transparent;
      transition: all 0.2s;
    }

    .option:hover {
      background: #f9fafb;
      border-color: #e5e7eb;
    }

    .option input[type="radio"] {
      margin-right: 12px;
      cursor: pointer;
      width: 18px;
      height: 18px;
    }

    .option label {
      cursor: pointer;
      flex: 1;
      font-size: 14px;
      color: #374151;
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 40px;
      justify-content: center;
    }

    button {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-primary:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #f9fafb;
    }

    .progress-container {
      padding: 20px 40px;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .progress-text {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #3b82f6;
      transition: width 0.3s;
    }

    .results {
      display: none;
    }

    .results.active {
      display: block;
    }

    .score-display {
      text-align: center;
      padding: 40px;
      border-radius: 8px;
      margin: 30px 0;
      background: #f0fdf4;
      border: 2px solid #86efac;
    }

    .score-display.failed {
      background: #fef2f2;
      border-color: #fca5a5;
    }

    .score-number {
      font-size: 56px;
      font-weight: bold;
      color: #22c55e;
      margin-bottom: 10px;
    }

    .score-display.failed .score-number {
      color: #ef4444;
    }

    .review-section {
      margin-top: 40px;
    }

    .review-question {
      padding: 20px;
      background: #f9fafb;
      border-radius: 6px;
      margin-bottom: 16px;
      border-left: 4px solid #22c55e;
    }

    .review-question.incorrect {
      background: #fef2f2;
      border-left-color: #ef4444;
    }

    .review-question-text {
      font-weight: 500;
      margin-bottom: 10px;
      color: #111827;
    }

    .review-answer {
      font-size: 14px;
      margin: 6px 0;
      color: #374151;
    }

    .review-answer strong {
      color: #111827;
    }
  </style>
</head>
<body>
  <div class="container">
    <div id="exam-view">
      <div class="header">
        <h1>${exam.title}</h1>
        ${exam.description ? `<p>${exam.description}</p>` : ''}
      </div>

      <div class="progress-container">
        <div class="progress-text">
          Question <span id="current-q">1</span> of ${exam.questions.length}
        </div>
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
        </div>
      </div>

      <div class="content">
        <div id="student-section" class="student-info">
          <label for="student-name">Your Name</label>
          <input type="text" id="student-name" placeholder="Enter your name">
        </div>

        <div id="questions-section" style="display: none;">
          ${exam.questions
            .map(
              (q, idx) => `
            <div class="question-card" data-question-id="${q.id}">
              <div class="question-header">
                <div class="question-number">Q${idx + 1}</div>
                <span class="question-type">${q.type === 'true-false' ? 'True/False' : 'Multiple Choice'}</span>
                <p class="question-text">${q.text}</p>
              </div>
              <div class="options">
                ${q.options
                  .map(
                    opt => `
                  <div class="option">
                    <input type="radio" id="${q.id}_${opt.id}" name="${q.id}" value="${opt.id}">
                    <label for="${q.id}_${opt.id}">${opt.text}</label>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          `
            )
            .join('')}

          <div class="button-group">
            <button class="btn-secondary" id="btn-prev" onclick="previousQuestion()">Previous</button>
            <button class="btn-primary" id="btn-next" onclick="nextQuestion()">Next</button>
          </div>
        </div>

        <div id="results-section" class="results">
          <div id="score-display" class="score-display"></div>
          <div id="review-section" class="review-section"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let currentQuestion = 0;
    const studentNameInput = document.getElementById('student-name');
    const questionsSection = document.getElementById('questions-section');
    const resultsSection = document.getElementById('results-section');
    const studentSection = document.getElementById('student-section');
    const questions = ${JSON.stringify(exam.questions)};
    let answers = {};

    function startExam() {
      if (!studentNameInput.value.trim()) {
        alert('Please enter your name');
        return;
      }
      studentSection.style.display = 'none';
      questionsSection.style.display = 'block';
      showQuestion(0);
    }

    function showQuestion(index) {
      currentQuestion = index;
      const q = questions[index];
      
      // Hide all questions
      document.querySelectorAll('.question-card').forEach(card => {
        card.style.display = 'none';
      });
      
      // Show current question
      document.querySelector(\`[data-question-id="\${q.id}"]\`).style.display = 'block';
      
      // Update progress
      document.getElementById('current-q').textContent = index + 1;
      const progress = ((index + 1) / questions.length) * 100;
      document.getElementById('progress-fill').style.width = progress + '%';
      
      // Update buttons
      document.getElementById('btn-prev').disabled = index === 0;
      if (index === questions.length - 1) {
        document.getElementById('btn-next').textContent = 'Submit Exam';
        document.getElementById('btn-next').onclick = submitExam;
      } else {
        document.getElementById('btn-next').textContent = 'Next';
        document.getElementById('btn-next').onclick = nextQuestion;
      }

      // Check for saved answer
      if (answers[q.id]) {
        document.getElementById(answers[q.id]).checked = true;
      }
    }

    function previousQuestion() {
      if (currentQuestion > 0) {
        saveCurrentAnswer();
        showQuestion(currentQuestion - 1);
      }
    }

    function nextQuestion() {
      if (currentQuestion < questions.length - 1) {
        saveCurrentAnswer();
        showQuestion(currentQuestion + 1);
      }
    }

    function saveCurrentAnswer() {
      const q = questions[currentQuestion];
      const checked = document.querySelector(\`input[name="\${q.id}"]:checked\`);
      if (checked) {
        answers[q.id] = checked.id;
      }
    }

    function submitExam() {
      saveCurrentAnswer();
      
      let score = 0;
      questions.forEach(q => {
        if (answers[q.id] === q.id + '_' + q.correctAnswer) {
          score++;
        }
      });
      
      const percentage = Math.round((score / questions.length) * 100);
      const passed = percentage >= 50;
      
      questionsSection.style.display = 'none';
      resultsSection.classList.add('active');
      
      const scoreDisplay = document.getElementById('score-display');
      scoreDisplay.className = \`score-display \${passed ? '' : 'failed'}\`;
      scoreDisplay.innerHTML = \`
        <div class="score-number">\${percentage}%</div>
        <div>\${score} out of \${questions.length} correct</div>
        <div>\${passed ? '✓ Passed' : '✗ Not Passed (50% is the passing score)'}</div>
      \`;
      
      const reviewSection = document.getElementById('review-section');
      reviewSection.innerHTML = '<h2 style="font-size: 18px; margin-bottom: 20px;">Review Your Answers</h2>';
      
      questions.forEach((q, idx) => {
        const selectedId = answers[q.id];
        const correct = selectedId === q.id + '_' + q.correctAnswer;
        const selectedOption = q.options.find(o => selectedId === q.id + '_' + o.id);
        const correctOption = q.options.find(o => o.id === q.correctAnswer);
        
        const reviewDiv = document.createElement('div');
        reviewDiv.className = \`review-question \${correct ? '' : 'incorrect'}\`;
        reviewDiv.innerHTML = \`
          <div class="review-question-text">
            <span style="color: \${correct ? '#22c55e' : '#ef4444'}">
              \${correct ? '✓' : '✗'}
            </span>
            Q\${idx + 1}: \${q.text}
          </div>
          <div class="review-answer">
            <strong>Your answer:</strong> \${selectedOption ? selectedOption.text : 'Not answered'}
          </div>
          \${!correct ? \`<div class="review-answer"><strong style="color: #22c55e;">Correct answer:</strong> \${correctOption.text}</div>\` : ''}
        \`;
        reviewSection.appendChild(reviewDiv);
      });
      
      const startBtn = document.createElement('button');
      startBtn.className = 'btn-primary';
      startBtn.style.marginTop = '40px';
      startBtn.style.width = '100%';
      startBtn.textContent = 'Refresh Page';
      startBtn.onclick = () => location.reload();
      reviewSection.appendChild(startBtn);
    }

    studentNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') startExam();
    });

    const startBtn = document.createElement('button');
    startBtn.className = 'btn-primary';
    startBtn.style.marginTop = '20px';
    startBtn.style.width = '100%';
    startBtn.textContent = 'Start Exam';
    startBtn.onclick = startExam;
    studentSection.appendChild(startBtn);
  </script>
</body>
</html>`;
};

export const generatePDF = (exam: Exam): Blob => {
  const html = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
        .question { margin: 20px 0; padding: 15px; border-left: 4px solid #3b82f6; background: #f9fafb; }
        .question-text { font-weight: bold; margin-bottom: 10px; }
        .option { margin: 8px 0 8px 20px; }
        .correct { color: green; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>${exam.title}</h1>
      ${exam.description ? `<p>${exam.description}</p>` : ''}
      <hr>
      ${exam.questions
        .map(
          (q, idx) => `
        <div class="question">
          <div class="question-text">Q${idx + 1}: ${q.text} (${q.type === 'true-false' ? 'True/False' : 'Multiple Choice'})</div>
          ${q.options.map(opt => `
            <div class="option">
              ☐ ${opt.text}
              ${opt.id === q.correctAnswer ? '<span class="correct"> [CORRECT ANSWER]</span>' : ''}
            </div>
          `).join('')}
        </div>
      `
        )
        .join('')}
    </body>
    </html>
  `;

  return new Blob([html], { type: 'text/html' });
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

export const downloadPDF = (exam: Exam) => {
  const pdf = generatePDF(exam);
  const url = URL.createObjectURL(pdf);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${exam.title.replace(/\s+/g, '_')}_exam.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
