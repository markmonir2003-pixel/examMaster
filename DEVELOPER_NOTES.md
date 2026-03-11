# ExamMaster - Developer Notes

This document is for developers who want to understand, extend, or modify the codebase.

---

## 🏗️ Architecture Overview

### Application Structure

```
MVC-style Architecture
├── Views (Components)
│   ├── exam-creator.tsx       - Form for exam creation
│   ├── exam-interface.tsx     - Exam UI and grading
│   └── dashboard.tsx          - Admin dashboard
│
├── Models (Types & Storage)
│   ├── types.ts              - Data models
│   └── storage.ts            - Data persistence
│
├── Controllers (Logic)
│   ├── export.ts             - HTML/PDF generation
│   └── helpers.ts            - Business logic
│
└── Routes (Pages)
    ├── page.tsx              - Landing page
    ├── create/page.tsx       - Create route
    ├── dashboard/page.tsx    - Dashboard route
    ├── take/[id]/page.tsx    - Exam route
    └── edit/[id]/page.tsx    - Edit route
```

### Data Flow

```
User Action
    ↓
Component Handler
    ↓
Business Logic (helpers.ts)
    ↓
Storage Layer (storage.ts)
    ↓
LocalStorage
    ↓
Component Re-render
```

---

## 🔧 Key Technologies

### Frontend Framework
- **Next.js 16** - App Router (file-based routing)
- **React 19** - Component framework
- **TypeScript** - Type safety

### Styling
- **Tailwind CSS v4** - Utility-first CSS
- **Design Tokens** - CSS custom properties
- **Responsive** - Mobile-first approach

### UI Components
- **shadcn/ui** - Pre-built components
- **Recharts** - Data visualization
- **Lucide React** - Icons

### State Management
- **None used** - Props and component state only
- Could add: Context API, Zustand, or Jotai

### Data Persistence
- **LocalStorage** - Browser-based storage
- **No backend** - Fully client-side

---

## 📁 Module Breakdown

### `lib/types.ts` - Data Models

```typescript
// Core types
type QuestionType = 'multiple-choice' | 'true-false'
interface Exam { ... }
interface Question { ... }
interface ExamResult { ... }

// Extend with your custom types
export interface CustomType { ... }
```

**To Add New Question Type:**
```typescript
1. Add to QuestionType union
2. Update exam-creator.tsx UI
3. Update exam-interface.tsx display
4. Update grading logic
```

### `lib/storage.ts` - Data Access Layer

```typescript
export const storage = {
  // Exam CRUD
  getExams()
  saveExam(exam)
  deleteExam(id)
  getExamById(id)
  
  // Results CRUD
  getResults()
  saveResult(result)
  getResultsByExamId(id)
  
  // Analytics
  getStats(examId)
}
```

**To Add Cloud Storage:**
```typescript
// Add methods like:
async saveExamToServer(exam) { ... }
async getExamsFromServer() { ... }
// Keep localStorage as fallback
```

### `lib/export.ts` - Export Logic

**HTML Export** (556 lines of HTML generation)
- Generates complete standalone HTML
- Includes embedded CSS and JavaScript
- No external dependencies
- Self-contained exam interface

**PDF Export** (simple HTML format)
- Generated as HTML
- Browser converts to PDF

**To Add New Export Format:**
```typescript
export const generateDOCX = (exam: Exam): Blob => {
  // Generate DOCX format
  return blob
}

export const downloadDOCX = (exam: Exam) => {
  // Download as DOCX
}
```

### `lib/helpers.ts` - Business Logic

```typescript
// Utilities
generateId(prefix)      // Create unique IDs
formatDate(timestamp)   // Format dates
calculateExamStats()    // Get statistics
validateExam(exam)      // Validation logic
```

**To Add Validation Rules:**
```typescript
export const validateExam = (exam: Exam) => {
  const errors = []
  
  // Add your custom rules
  if (exam.questions.length > 100) {
    errors.push('Too many questions')
  }
  
  return { isValid: errors.length === 0, errors }
}
```

---

## 🎯 Component Details

### `components/exam-creator.tsx`

**Purpose:** Create and edit exams

**Key Functions:**
```typescript
addQuestion(type)              // Add new question
updateQuestion(id, updates)    // Update question
deleteQuestion(id)             // Delete question
reorderQuestion(idx, dir)      // Reorder
handleSave()                   // Save exam
```

**To Extend:**
```typescript
// Add color picker for questions
// Add question categories
// Add question preview
// Add question templates
// Add bulk import
```

**Props:**
```typescript
interface ExamCreatorProps {
  initialExam?: Exam
  onSave?: (exam: Exam) => void
}
```

### `components/exam-interface.tsx`

**Purpose:** Student exam interface and grading

**Key Functions:**
```typescript
handleSelectAnswer(optionId)   // Select answer
handleSubmit()                 // Grade exam
showQuestion(index)            // Navigate question
```

**Grading Logic:**
```typescript
const score = answers.filter(a => 
  a.selectedOption === question.correctAnswer
).length

const percentage = (score / totalQuestions) * 100
const passed = percentage >= 50 // CONFIGURABLE
```

**To Extend:**
```typescript
// Add time limit
// Add timer display
// Add keyboard shortcuts
// Add full-screen mode
// Add answer flagging
// Add review mode before submit
```

### `components/dashboard.tsx`

**Purpose:** Admin panel with exam management and analytics

**Key Features:**
```typescript
// Left panel: Exam list with search
// Right panel: Details/Results/Statistics tabs

// Statistics
- Total submissions
- Average score
- High/low scores
- Pass rate
- Score charts (bar & line)
```

**To Extend:**
```typescript
// Add exam templates
// Add bulk export
// Add result filtering
// Add date range filtering
// Add class/group management
// Add more chart types
// Add data export (CSV)
```

---

## 🔄 Data Persistence Pattern

### Current Implementation
```typescript
// Save
const exam = { ... }
storage.saveExam(exam)
localStorage.setItem('exams', JSON.stringify(exams))

// Load
const exams = storage.getExams()
const data = JSON.parse(localStorage.getItem('exams'))
```

### To Add Cloud Sync
```typescript
// Hybrid approach
const storage = {
  // Try local first, fallback to server
  async getExams() {
    const local = localStorageGet('exams')
    if (local) return local
    return await fetchFromServer()
  },
  
  // Save to both
  async saveExam(exam) {
    localStorageSave('exams', exam)
    await saveToServer(exam)
  }
}
```

---

## 🧪 Testing Approach

### Manual Testing (Currently Used)
```
Create exam
  → Add questions
  → Edit questions
  → Delete questions
  → Reorder
  → Save
  ✓ Exam created

Take exam
  → Answer questions
  → Navigate
  → Submit
  → See results
  ✓ Grading works

Dashboard
  → View exams
  → Search
  → View results
  → View stats
  ✓ All working
```

### To Add Unit Tests
```typescript
// Using Jest/Vitest
describe('storage', () => {
  it('saves and retrieves exam', () => {
    const exam = { ... }
    storage.saveExam(exam)
    expect(storage.getExamById(exam.id)).toEqual(exam)
  })
})

describe('validation', () => {
  it('rejects exam without title', () => {
    const exam = { ... }
    const result = validateExam(exam)
    expect(result.isValid).toBe(false)
  })
})
```

### To Add E2E Tests
```typescript
// Using Cypress/Playwright
describe('Create Exam Flow', () => {
  it('should create exam with questions', () => {
    cy.visit('/create')
    cy.get('[data-testid="exam-title"]').type('Math Quiz')
    cy.get('[data-testid="add-question"]').click()
    cy.get('[data-testid="save"]').click()
    cy.url().should('include', '/dashboard')
  })
})
```

---

## 🚀 Performance Optimization

### Current Optimizations
- ✅ Component code-splitting via Next.js
- ✅ Lazy loading components
- ✅ Efficient re-renders (React 19)
- ✅ Tailwind CSS purging
- ✅ Image optimization (if added)

### Potential Improvements
```typescript
// Memoization
const ExamCard = memo(({ exam }) => {
  return <div>{exam.title}</div>
}, (prev, next) => prev.exam.id === next.exam.id)

// Lazy Components
const Dashboard = dynamic(() => import('@/components/dashboard'))

// Virtual Lists (for 1000+ results)
import { FixedSizeList } from 'react-window'

// State Management (avoid prop drilling)
import { create } from 'zustand'
const useExamStore = create(...)
```

---

## 🔐 Security Considerations

### Current Security
- ✅ No backend = no server vulnerabilities
- ✅ Client-side validation only
- ✅ No authentication needed
- ✅ No sensitive data transmission
- ✅ No API keys stored

### To Add Authentication
```typescript
// Use Auth.js or similar
import { useSession } from 'next-auth/react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <Spinner />
  if (!session) return <Redirect to="/login" />
  
  return <DashboardContent user={session.user} />
}
```

### To Add Encryption
```typescript
// Encrypt sensitive data in localStorage
import crypto from 'crypto'

export const storage = {
  saveExam(exam: Exam) {
    const encrypted = encrypt(JSON.stringify(exam))
    localStorage.setItem(`exam_${exam.id}`, encrypted)
  },
  
  getExam(id: string) {
    const encrypted = localStorage.getItem(`exam_${id}`)
    return JSON.parse(decrypt(encrypted))
  }
}
```

---

## 🎨 UI/UX Patterns

### Component Pattern Used
```typescript
// Controlled component pattern
function Input({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />
}

// Composite component pattern
function Card({ children }) { ... }
function CardHeader({ children }) { ... }
function CardContent({ children }) { ... }
```

### Form Pattern
```typescript
// Uncontrolled with refs (lightweight)
const ref = useRef()
const handleSubmit = () => {
  const value = ref.current.value
}

// Controlled state (current approach)
const [value, setValue] = useState('')
const handleSubmit = () => {
  // value is always up-to-date
}
```

### To Add Form Validation
```typescript
// Using React Hook Form
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1, 'Required'),
  questions: z.array(questionSchema).min(1)
})

function ExamCreator() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
```

---

## 🔄 Common Modifications

### Change Passing Score
```typescript
// File: components/exam-interface.tsx (line 127)
const isPassed = result.percentage >= 70  // From 50
```

### Change Color Scheme
```css
/* File: app/globals.css */
@theme inline {
  --color-primary: #8b5cf6;      /* Purple */
  --color-secondary: #f5f3ff;    /* Light purple */
  --color-success: #10b981;      /* Different green */
}
```

### Add New Question Type
```typescript
// 1. Update type
type QuestionType = '...' | 'new-type'

// 2. Add UI in exam-creator
if (type === 'new-type') {
  return <NewTypeEditor />
}

// 3. Add display in exam-interface
if (type === 'new-type') {
  return <NewTypeDisplay />
}

// 4. Update grading logic
if (type === 'new-type') {
  isCorrect = gradeNewType(answer, question)
}
```

### Add Filters to Dashboard
```typescript
const [filters, setFilters] = useState({
  dateRange: null,
  minScore: 0,
  status: 'all'
})

const filtered = results.filter(r => {
  if (filters.dateRange && r.submittedAt < filters.dateRange[0]) return false
  if (filters.minScore && r.percentage < filters.minScore) return false
  if (filters.status !== 'all' && getPassed(r) !== filters.status) return false
  return true
})
```

---

## 📊 Key Data Structures

### Exam Structure
```typescript
{
  id: "exam_1709567890123_abc123",
  title: "Biology Quiz",
  description: "Chapter 1-3",
  questions: [Question, ...],
  createdAt: 1709567890123,
  updatedAt: 1709567890123
}
```

### Question Structure
```typescript
{
  id: "q_1709567890123",
  type: "multiple-choice" | "true-false",
  text: "What is photosynthesis?",
  options: [Option, ...],
  correctAnswer: "opt_2",
  order: 0
}
```

### Result Structure
```typescript
{
  id: "result_1709567890123",
  examId: "exam_1709567890123",
  studentName: "John Doe",
  answers: [StudentAnswer, ...],
  score: 8,
  totalQuestions: 10,
  percentage: 80,
  submittedAt: 1709567890123
}
```

---

## 🐛 Debugging Tips

### Enable Debug Logging
```typescript
// Add to components
console.log('[v0] Exam saved:', exam)
console.log('[v0] Results loaded:', results)
console.log('[v0] Grading:', { score, percentage, isPassed })
```

### Check LocalStorage
```javascript
// In browser console
localStorage.getItem('exams')
localStorage.getItem('exam_results')
```

### Component DevTools
```
F12 → React Components → Inspect components
Check props and state
```

### Network Tab
```
F12 → Network → Monitor API calls
Should be none (all local)
```

---

## 🚀 Deployment Considerations

### Environment Variables
Currently: None needed (all local)

If adding backend:
```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ENABLE_CLOUD_SYNC=true
SECRET_KEY=...
DATABASE_URL=...
```

### Build Optimization
```bash
npm run build
# Analyzes: .next folder size
# Check: Build output size
```

### Performance Budgets
- Bundle size: < 200KB (gzipped)
- Largest component: < 50KB
- Core app: < 100KB

---

## 📚 Adding Features Checklist

### To Add a New Feature
- [ ] Add types in `lib/types.ts`
- [ ] Add storage methods in `lib/storage.ts`
- [ ] Add helper functions in `lib/helpers.ts`
- [ ] Create component(s) as needed
- [ ] Add route/page if needed
- [ ] Test manually in browser
- [ ] Test on mobile
- [ ] Update documentation
- [ ] Check TypeScript errors
- [ ] Verify localStorage still works

### To Update Existing Feature
- [ ] Check all related files
- [ ] Understand current implementation
- [ ] Make changes consistently
- [ ] Test thoroughly
- [ ] Update types if needed
- [ ] Test data migration if needed

---

## 🔗 Dependencies & Imports

### Common Imports
```typescript
// React
import { useState, useEffect, useRef } from 'react'

// Next.js
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// Local
import { storage } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Exam, Question } from '@/lib/types'

// Icons
import { Plus, X, Check } from 'lucide-react'

// Charts
import { BarChart, Bar, XAxis, YAxis } from 'recharts'
```

---

## 🎓 Code Style Guide

### Naming Conventions
```typescript
// Components: PascalCase
export function ExamCreator() { }

// Functions: camelCase
export const handleSaveExam = () => { }

// Constants: UPPER_SNAKE_CASE
const MAX_QUESTIONS = 100

// Types/Interfaces: PascalCase
interface Exam { }
type QuestionType = 'multiple-choice' | 'true-false'
```

### File Organization
```typescript
// 1. Imports
import React from 'react'
import { useState } from 'react'

// 2. Types
interface Props { }

// 3. Component
export function MyComponent(props: Props) { }

// 4. Styles (Tailwind in className)
// 5. Export at end or top
```

### Comments
```typescript
// Use comments sparingly
// Comment why, not what

// Good: Needed for photo gallery lazy-loading
const [isVisible, setIsVisible] = useState(false)

// Bad: Set visibility state
const [isVisible, setIsVisible] = useState(false)
```

---

## 🧠 Mental Model

### How Exam Creation Works
```
1. User enters title
2. User clicks "Add Question"
3. Question object created with unique ID
4. User fills question details
5. User selects correct answer
6. User clicks Save
7. Validation runs
8. Data saved to LocalStorage
9. Redirect to dashboard
```

### How Exam Taking Works
```
1. User enters name
2. User clicks "Start Exam"
3. First question displayed
4. User selects answer
5. Answer stored in component state
6. User clicks "Next" or "Previous"
7. Question changes, answer persists
8. User clicks "Submit"
9. Grading logic runs
10. Results displayed with review
11. Results saved to LocalStorage
```

### How Dashboard Works
```
1. Load all exams from storage
2. Load all results from storage
3. Render exam list
4. User selects exam
5. Load results for that exam
6. Calculate statistics
7. Render charts
8. User can edit/delete/export
```

---

## 🔮 Future Enhancement Ideas

### Short Term
- [ ] Add exam templates
- [ ] Add question bank
- [ ] Add bulk import/export
- [ ] Add answer shuffling
- [ ] Add time limits

### Medium Term
- [ ] Add cloud sync
- [ ] Add user accounts
- [ ] Add class management
- [ ] Add more chart types
- [ ] Add mobile app

### Long Term
- [ ] Add integrations (Canvas, Blackboard)
- [ ] Add AI question generation
- [ ] Add advanced analytics
- [ ] Add proctoring
- [ ] Add badge/certificate system

---

## 📖 Additional Resources

### Documentation Files
- README.md - Full documentation
- SETUP_GUIDE.md - Setup help
- IMPLEMENTATION_CHECKLIST.md - Features

### External Resources
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com

---

## ✅ Pre-Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] All console warnings addressed
- [ ] Tested in Chrome, Firefox, Safari
- [ ] Tested on mobile
- [ ] Tested localStorage persistence
- [ ] Tested all export formats
- [ ] Tested grading accuracy
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Ready for production

---

**Happy coding!** 🚀

For questions, refer to the documentation or review the source code comments.
