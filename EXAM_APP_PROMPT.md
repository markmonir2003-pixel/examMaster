# Complete Online Exam Management System - Build Specification

## Executive Summary

Build a production-ready web application for creating, publishing, and managing online exams similar to Google Forms. The system must support both exam creators (instructors) and exam takers (students), with automatic grading, result tracking, and PDF export capabilities.

---

## Architecture Overview

### Technology Stack
- **Frontend Framework**: Next.js 16+ (App Router) with React 19+
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Client-side with React Context + localStorage for data persistence
- **PDF Generation**: `jspdf` + `html2canvas` for PDF export
- **Data Storage**: localStorage for MVP (can upgrade to Supabase/Database later)
- **Build Tool**: Turbopack (Next.js default)

### Project Structure
```
exam-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (landing/dashboard redirect)
│   ├── creator/
│   │   ├── layout.tsx
│   │   ├── page.tsx (exam dashboard)
│   │   ├── [examId]/
│   │   │   └── page.tsx (exam editor)
│   │   └── new/
│   │       └── page.tsx (create new exam)
│   ├── exams/
│   │   └── [examId]/
│   │       └── page.tsx (take exam interface)
│   └── results/
│       ├── page.tsx (student results list)
│       └── [resultId]/
│           └── page.tsx (detailed result review)
├── components/
│   ├── exam-creator/
│   │   ├── exam-form.tsx
│   │   ├── question-card.tsx
│   │   ├── question-editor.tsx
│   │   └── add-question-dialog.tsx
│   ├── exam-taker/
│   │   ├── exam-interface.tsx
│   │   ├── question-renderer.tsx
│   │   ├── answer-selector.tsx
│   │   └── exam-timer.tsx
│   ├── results/
│   │   ├── results-summary.tsx
│   │   ├── results-details.tsx
│   │   └── score-breakdown.tsx
│   ├── dashboard/
│   │   ├── exam-list.tsx
│   │   ├── exam-card.tsx
│   │   ├── statistics-panel.tsx
│   │   └── results-viewer.tsx
│   └── shared/
│       ├── nav-bar.tsx
│       └── footer.tsx
├── lib/
│   ├── types.ts (all TypeScript interfaces)
│   ├── storage.ts (localStorage utilities)
│   ├── grading.ts (grading logic)
│   ├── pdf-export.ts (PDF generation)
│   └── utils.ts (helper functions)
├── hooks/
│   ├── use-exams.ts (exam data management)
│   ├── use-exam-form.ts (form state)
│   └── use-results.ts (results management)
├── styles/
│   └── globals.css (Tailwind + custom CSS)
└── public/
    └── (static assets)
```

---

## Data Models & TypeScript Interfaces

### Core Data Types

```typescript
// Question types
type QuestionType = 'true-false' | 'multiple-choice';

// Question structure
interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[]; // For MC: 4 options, for T/F: ['True', 'False']
  correctAnswer: string; // Index or text
  points: number;
  createdAt: Date;
}

// Exam structure
interface Exam {
  id: string;
  title: string;
  description: string;
  instructions: string;
  questions: Question[];
  totalPoints: number;
  timeLimit?: number; // in minutes, optional
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswersAfter: boolean; // Show answers after submission
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  publishedAt?: Date;
}

// Student answer
interface StudentAnswer {
  questionId: string;
  answer: string; // Selected option
  points: number; // Points awarded
  isCorrect: boolean;
}

// Exam submission/result
interface ExamResult {
  id: string;
  examId: string;
  studentName: string;
  studentEmail: string;
  answers: StudentAnswer[];
  totalScore: number;
  totalPoints: number;
  percentage: number;
  startedAt: Date;
  submittedAt: Date;
  timeTaken: number; // in seconds
}

// Dashboard statistics
interface ExamStatistics {
  examId: string;
  totalSubmissions: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number; // percentage of students who passed (> 50%)
}
```

---

## Feature Specifications

### 1. Exam Creator / Dashboard

**Page**: `/creator`

**Components**:
- Navigation bar with "Create New Exam" button
- Exam list table showing:
  - Exam title
  - Date created
  - Number of questions
  - Publish status
  - Number of submissions
  - Edit/Delete/View Results buttons
  - Exam statistics (submission count, average score)

**Functionality**:
- Display all created exams (sorted by recent first)
- "Create New Exam" button opens dialog/navigates to `/creator/new`
- Each exam card shows:
  - Title and description
  - Question count
  - Status badge (Draft/Published)
  - Action buttons (Edit, Delete, Share Link, View Results)
- Filter options: By status (Draft/Published), by date range
- Search functionality to find exams by title

**Permissions**: Only creator can see their exams

---

### 2. Exam Creator / Editor

**Page**: `/creator/[examId]`

**Layout**: 
- Left panel: Exam details form (title, description, instructions, settings)
- Right panel: Questions list with preview
- Top bar: Save, Preview, Publish buttons

**Exam Settings Form**:
- Exam title (required, max 200 chars)
- Description (optional, max 500 chars)
- Instructions (optional, rich text)
- Time limit toggle + input (optional, in minutes)
- Shuffle questions toggle
- Shuffle answer options toggle
- Show correct answers after submission toggle
- Passing score (default 50%)

**Question Management**:
- Display all questions as cards in scrollable list
- Each card shows: Question text, type, preview of options
- Buttons on each card: Edit, Delete, Duplicate, Move Up/Down
- "Add Question" button (floating or at bottom)

**Question Editor Modal/Dialog**:
- Question type selector (True/False or Multiple Choice)
- Question text input (rich text editor)
- For True/False:
  - Two pre-filled options: "True" and "False"
  - Radio buttons to select correct answer
- For Multiple Choice:
  - Four option inputs
  - Radio buttons to select correct answer (1-4)
  - Add/remove option buttons (min 2, max 6 options)
- Points input (default 1)
- Save and Cancel buttons

**Preview Functionality**:
- Show how the exam will appear to students
- Display all questions in order
- Show shuffling effect if enabled

**Save & Publish**:
- Save button: Save exam as draft
- Preview button: Full-screen preview of exam
- Publish button: 
  - Mark exam as published
  - Generate shareable link/code
  - Enable download as HTML and PDF

---

### 3. Exam Creator / New Exam

**Page**: `/creator/new`

**Functionality**:
- Form with exam title and description
- "Create Exam" button creates new exam and redirects to editor
- Basic template selection option (optional enhancement)

---

### 4. Exam Taking Interface

**Page**: `/exams/[examId]`

**Pre-Exam Screen**:
- Exam title, description, and instructions
- Time limit display (if set)
- Student name input (required)
- Student email input (optional)
- "Start Exam" button
- Display number of questions and total points

**During Exam**:
- Header bar showing:
  - Exam title
  - Timer (if time limit enabled) - displays remaining time with warning at 5 minutes
  - Question counter (e.g., "Question 3 of 20")
- Main content area:
  - Question text (large, clear typography)
  - Question type badge (True/False or Multiple Choice)
  - Answer options displayed as:
    - True/False: Large radio buttons or toggle
    - Multiple Choice: Radio buttons with option text
  - Points value for current question (small, top-right)
- Navigation buttons:
  - Previous/Next buttons
  - Question navigator: Grid of all questions showing visited/unvisited status
  - Submit button (only on last question or always visible)
- Styling:
  - Clear separation between questions
  - Hover effects on options
  - Selected option highlighted
  - Large touch-friendly buttons (mobile-first design)

**After Submission**:
- Redirect to results page with results ID
- Display score immediately
- Option to review answers

**Technical Features**:
- Auto-save answers to localStorage (prevent data loss)
- Shuffle questions if enabled in exam settings
- Shuffle options if enabled
- Time tracking (record when exam started)
- Timer countdown with visual warning

---

### 5. Results & Grading

**Page**: `/results/[resultId]`

**Results Summary**:
- Student name and email
- Date and time submitted
- Time taken to complete exam
- Final score (e.g., "78 out of 100")
- Percentage grade (e.g., "78%")
- Letter grade if applicable
- Pass/Fail status

**Results Details**:
- Question-by-question breakdown showing:
  - Question text
  - Student's answer
  - Correct answer (if show_correct_answers enabled)
  - Points awarded vs. total points
  - Visual indicator: ✓ for correct, ✗ for incorrect
  - Color coding: Green for correct, Red for incorrect
- Option to review entire exam

**Statistics View** (Admin Dashboard):
- Chart showing score distribution (histogram)
- Table of all student submissions:
  - Student name
  - Email
  - Score
  - Date submitted
  - Time taken
  - Link to detailed results
- Summary statistics:
  - Total submissions
  - Average score
  - Highest and lowest scores
  - Pass rate percentage
- Export results as CSV

---

### 6. Admin Dashboard / Results Viewer

**Page**: `/creator`

**Exams Tab**:
- List of all exams with quick stats
- Each exam shows total submissions and average score

**Results Tab**:
- Select exam from dropdown
- Display all results for that exam
- Filters: Date range, score range, by student
- Search by student name or email
- Click row to view detailed results
- Bulk actions: Export all results as CSV

**Statistics Dashboard**:
- Cards showing:
  - Total exams created
  - Total student submissions
  - Average student score (across all exams)
  - Most popular exam (most submissions)
- Charts:
  - Submissions over time (line chart)
  - Score distribution (histogram)

---

### 7. Publish & Export

**Publish Exam**:
- Generate unique exam link (e.g., `exam.app/exams/[uniqueCode]`)
- Create shareable button/link
- Copy-to-clipboard functionality
- QR code generation (optional enhancement)

**Export as HTML**:
- Generate standalone HTML file
- Include all questions, options, and styling
- Include embedded PDF export button in HTML
- File should be self-contained (no external dependencies)
- Naming: `exam_title_YYYYMMDD.html`

**Export as PDF**:
- Creator-side: Export exam template as printable PDF
- Student-side: Export results as PDF after submission
- Include:
  - Exam title, date, student info
  - All questions with options
  - Final score and breakdown
  - Professional layout suitable for printing

---

## UI/UX Requirements

### Design System
- **Color Palette**: 
  - Primary: Modern blue (#0066CC or similar)
  - Secondary: Light gray (#F5F5F5)
  - Success: Green (#00AA44)
  - Warning: Orange (#FF9800)
  - Danger: Red (#DD3333)
  - Text: Dark gray (#333333)

- **Typography**:
  - Headings: San-serif, bold
  - Body: San-serif, regular
  - Max 2 font families total

- **Spacing**: Use Tailwind spacing scale (p-4, gap-6, etc.)

- **Component Library**: Use shadcn/ui components where applicable:
  - Button, Card, Dialog, Input, Textarea, Radio, Checkbox
  - Select, Tabs, Table, Alert, Badge, Progress, Tooltip

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly buttons (min 44px)
- Single-column on mobile, multi-column on desktop

### Animations & Transitions
- Smooth page transitions (fade in)
- Button hover effects (subtle background change)
- Question card animations (slide in)
- Timer warnings (subtle color change, not jarring)
- Modal dialogs with fade-in animation

### Accessibility (A11y)
- Semantic HTML (use `<button>`, `<input>`, `<label>`, etc.)
- ARIA labels where needed
- Keyboard navigation support (Tab, Enter, Escape)
- Color contrast ratios ≥ 4.5:1
- Screen reader friendly

### Google Forms Inspiration
- Clean, minimal interface
- Large, readable question text
- Clear visual hierarchy
- Ample whitespace
- Rounded corners on cards (border-radius: 8-12px)
- Subtle shadows for depth
- Single question per view during exam (option for multi-question)

---

## State Management & Data Flow

### Global State (Context API)
```typescript
// ExamContext - for exam creation/editing
interface ExamContextType {
  currentExam: Exam | null;
  setCurrentExam: (exam: Exam) => void;
  updateQuestion: (question: Question) => void;
  addQuestion: (question: Question) => void;
  deleteQuestion: (questionId: string) => void;
  saveExam: () => Promise<void>;
  publishExam: () => Promise<void>;
}

// ResultsContext - for results viewing/management
interface ResultsContextType {
  results: ExamResult[];
  fetchResults: (examId: string) => Promise<void>;
  getResult: (resultId: string) => ExamResult | null;
}
```

### localStorage Schema
```typescript
// Keys in localStorage:
'exams' // Array<Exam>
'exam_[examId]' // Single exam full data
'result_[resultId]' // Single result
'results' // Array<ExamResult>
'user_exams' // Array of exam IDs created by user
'student_results' // Array of result IDs for anonymous students
```

### Custom Hooks
- `useExams()`: Load, save, update exams
- `useExamForm()`: Form state management for exam editor
- `useResults()`: Load and filter results
- `useTimer()`: Manage exam timer
- `useLocalStorage()`: Generic localStorage hook

---

## Grading Logic

### Automatic Grading Algorithm
```
For each question in exam:
  If student_answer === correct_answer:
    points_earned = question.points
  Else:
    points_earned = 0

total_score = sum(all points_earned)
total_possible = sum(all question.points)
percentage = (total_score / total_possible) * 100
pass = percentage >= passing_score_threshold (default 50%)
```

### Grading Rules
- Partial credit: Not supported in MVP (full or no points)
- Case-insensitive comparison for text answers
- Exact match required for correct answer selection
- All questions weighted equally by default (each worth same points) or custom points

---

## Key Implementation Details

### localStorage Persistence
- Save exam after each field change (auto-save)
- Save student answers every 30 seconds during exam
- Clear localStorage after exam submission (option to keep history)
- Implement version checking for schema migrations

### File Downloads
- Use `jspdf` library for PDF generation
- Use `html2canvas` to convert exam HTML to PDF
- Trigger file download using `<a href="blob:..." download>`
- Format filenames: `exam_[title]_[date].pdf`, `exam_[title]_[date].html`

### Time Limit Handling
- Display timer in header (HH:MM:SS format)
- Update every second
- Warning: Change color at 5 minutes remaining
- Auto-submit exam when time reaches 0
- Store time taken in result (submission_time - start_time)

### Question Shuffling
- Use Fisher-Yates algorithm to shuffle questions
- Store original order for admin view
- Shuffle happens client-side only (after exam loads)
- Option to shuffle answer choices independently

---

## API Structure (if extending to backend)

### Endpoints (Future)
```
POST /api/exams - Create exam
GET /api/exams - Get all exams
GET /api/exams/[id] - Get single exam
PUT /api/exams/[id] - Update exam
DELETE /api/exams/[id] - Delete exam
POST /api/exams/[id]/publish - Publish exam
POST /api/exams/[id]/submit - Submit exam answers
GET /api/results - Get all results
GET /api/results/[id] - Get single result
POST /api/results/export - Export results as CSV
```

---

## Testing Requirements

### Unit Tests (Vitest or Jest)
- Grading logic: Test 100% correct, 50% correct, 0% correct scenarios
- Shuffling algorithm: Verify randomization works
- localStorage helpers: Test save/load/delete operations
- Type validation: Ensure TypeScript catches type errors

### Integration Tests
- Create exam → Save → Publish → Take exam → Submit → View results flow
- Export functionality (PDF, HTML, CSV)
- Multi-exam scenarios

### Manual Testing Checklist
- [ ] Create exam with T/F and MC questions
- [ ] Edit and delete questions
- [ ] Publish exam and generate link
- [ ] Take exam on desktop and mobile
- [ ] Submit exam and view results
- [ ] Export results as PDF and CSV
- [ ] Timer functionality (verify countdown and auto-submit)
- [ ] Question shuffling (verify different order on refresh)
- [ ] Browser back button doesn't lose data (auto-save)

---

## Performance & Optimization

- Code splitting: Lazy load exam taker interface
- Image optimization: Use Next.js Image component
- Minify and tree-shake unused code
- Debounce save operations (auto-save after 1 second of inactivity)
- Memoize expensive computations (grading, shuffling)

---

## Security Considerations

### Data Protection
- localStorage is NOT secure (use authentication headers if backend added)
- Sanitize question text to prevent XSS
- Validate all inputs (question text, email, etc.)
- Prevent student exam manipulation (store correct answers server-side if backend added)

### Access Control
- Students can only access exams via public link
- Creators can only modify their own exams
- Results are tied to student email (prevent unauthorized viewing)

---

## Deployment

### Build & Deploy
- Vercel deployment (recommended for Next.js)
- Environment variables (if needed):
  - `NEXT_PUBLIC_APP_URL` for sharing links
  - `PDF_EXPORT_ENABLED` (true/false)

### Pre-Launch Checklist
- [ ] Test all CRUD operations
- [ ] Verify mobile responsiveness
- [ ] Test PDF/CSV export
- [ ] Browser compatibility check (Chrome, Safari, Firefox, Edge)
- [ ] Lighthouse performance audit (target: >90)
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## Success Metrics

1. **Functionality**: All 7 core features working without errors
2. **Performance**: Page load < 2 seconds, smooth interactions
3. **UX**: Intuitive navigation, no confusing workflows
4. **Design**: Professional, clean, Google Forms-like appearance
5. **Code Quality**: TypeScript strict mode, well-commented, reusable components
6. **Responsiveness**: Works flawlessly on mobile, tablet, desktop

---

## Deliverables

1. **Complete source code** with all features implemented
2. **README.md** with setup and usage instructions
3. **Component storybook** (optional, but recommended)
4. **TypeScript interfaces** exported from `lib/types.ts`
5. **No external API dependencies** (fully client-side MVP)
6. **Fully functional, production-ready application**

---

## Notes for Implementation

1. **Start with data models**: Define TypeScript interfaces first
2. **Build components hierarchically**: Start with small, reusable components
3. **Implement exam creator first**: Get core exam creation working before exam taker
4. **Add exam taker interface**: Build student-facing exam taking experience
5. **Implement grading**: Add automatic grading and results display
6. **Polish UI**: Add animations, improve styling, ensure responsive design
7. **Test thoroughly**: Test all workflows on desktop and mobile
8. **Add PDF/CSV export**: Implement file download functionality last
9. **Deploy**: Push to Vercel and test in production

---

## Questions to Clarify (Before Starting)

1. Should the app support user authentication or remain anonymous?
2. Should exams be unlimited or have a submission limit?
3. What should be the default exam passing score (50%, 60%, 70%)?
4. Should students see correct answers immediately after submission?
5. Should the app track student progress in real-time (for future features)?

---

**This specification provides all requirements needed to build a complete, professional exam management system. Follow this guide to create a production-ready application.**
