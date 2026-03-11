# ExamMaster - Online Exam Creation & Management System

A modern, Google Forms-like application for creating, managing, and grading online exams. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

### 1. **Quiz/Exam Creator**
- Create unlimited exams with custom titles and descriptions
- Support for two question types:
  - **True/False** questions
  - **Multiple Choice** (4 options) questions
- Intuitive question editor with drag-and-drop reordering
- Real-time question preview
- Validation to ensure all questions have correct answers

### 2. **Google Forms-like Interface**
- Clean, modern, and responsive design
- Questions displayed as cards with clear visual hierarchy
- Quick actions: Add, Edit, Delete, and Reorder questions
- Seamless navigation between exams

### 3. **Publish Exams**
- Export exams as **standalone HTML files** - no server needed
- Export exams as **PDF documents** for printing
- Share directly with students
- HTML version includes interactive exam interface

### 4. **Exam Interface**
- Student-friendly question navigation
- Progress bar showing exam completion status
- Previous/Next navigation buttons
- Automatic grading upon submission
- Displays:
  - Final score and percentage
  - Number of correct answers
  - Pass/Fail status (50% is passing)
  - Detailed review of all answers with correct answers shown

### 5. **PDF Export**
- Professional PDF format with exam title and description
- All questions with answer options
- Clean, printable layout
- Ready for offline use

### 6. **Admin Dashboard**
- View all created exams in one place
- Search exams by title
- Quick edit and delete options
- View detailed exam statistics and results

### 7. **Student Results & Statistics**
- Track all student submissions
- View detailed results table with:
  - Student name
  - Score (x out of y)
  - Percentage score
  - Pass/Fail status
  - Submission date
- Advanced statistics including:
  - Total submissions
  - Average score
  - Highest and lowest scores
  - Pass rate percentage
  - Score distribution chart
  - Score progression over time

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Storage:** Browser LocalStorage (data persists)

## Project Structure

```
/app
  /create          # Create exam page
  /edit/[id]       # Edit exam page
  /take/[id]       # Take exam page
  /dashboard       # Dashboard page
  page.tsx         # Home/landing page
  layout.tsx       # Root layout

/components
  exam-creator.tsx     # Exam creation component
  exam-interface.tsx   # Exam taking interface
  dashboard.tsx        # Dashboard component

/lib
  types.ts         # TypeScript type definitions
  storage.ts       # LocalStorage utilities
  export.ts        # HTML and PDF export functions
  utils.ts         # Utility functions
```

## Installation & Setup

### Option 1: Using shadcn CLI (Recommended)

```bash
npx shadcn-cli@latest init <your-project-name>
cd <your-project-name>
npx shadcn-cli@latest add all
git clone <this-repo> .
npm install
npm run dev
```

### Option 2: Manual Setup

```bash
git clone <this-repo>
cd <project-folder>
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage Guide

### Creating an Exam

1. Click **"Create Exam"** from the home page
2. Enter exam title and optional description
3. Click **"Add Multiple Choice"** or **"Add True/False"** to add questions
4. For each question:
   - Enter the question text
   - Enter answer options (for multiple choice)
   - Select the correct answer
   - Reorder using up/down arrows if needed
5. Click **"Create Exam"** to save

### Publishing an Exam

1. Go to **Dashboard**
2. Select an exam from the list
3. Under "Export Options":
   - Click **"Download as HTML"** for interactive exam file
   - Click **"Download as PDF"** for printable version
   - Click **"Take Exam Preview"** to preview as student

### Taking an Exam

1. Open a downloaded HTML file in any browser OR click "Take Exam Preview"
2. Enter your name and click "Start Exam"
3. Answer each question by selecting an option
4. Use Previous/Next buttons to navigate
5. Click "Submit Exam" when done
6. View your score and review answers

### Viewing Results

1. Go to **Dashboard**
2. Select an exam
3. Click **"Results"** tab to see all submissions
4. Click **"Statistics"** tab to see charts and analysis

## Features in Detail

### Smart Exam Creation
- **Reorder Questions:** Use arrow buttons to move questions up or down
- **Question Types:** Support for True/False and Multiple Choice (4 options)
- **Validation:** System ensures all questions have correct answers before saving
- **Edit Exams:** Edit any exam from the dashboard

### Automatic Grading
- Calculates score based on correct answers
- Displays percentage and pass/fail status
- Shows which answers were correct/incorrect
- Stores all results for later review

### Data Persistence
- All exams saved to browser LocalStorage
- All student results stored locally
- Data persists across sessions
- Export to HTML for offline use

### Responsive Design
- Mobile-friendly interface
- Works on tablets and desktops
- Touch-friendly buttons and inputs
- Optimized layouts for all screen sizes

## Keyboard Shortcuts

- **Enter** on name input: Start exam
- **Arrow Keys**: Navigate between questions
- **Tab**: Move between form fields

## Data Storage

- **Exams:** Stored in browser LocalStorage under key `exams`
- **Results:** Stored in browser LocalStorage under key `exam_results`
- **Data Privacy:** All data stored locally on device - no server uploads

## Exporting & Sharing

### HTML Export
- Creates a fully standalone HTML file
- No dependencies or external resources needed
- Students can take exam offline
- Can be emailed or shared via link
- Works in any modern browser

### PDF Export
- Professional printable format
- Suitable for paper exams
- All questions and options included
- Correct answers marked (for instructor use)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Limitations & Future Improvements

### Current Limitations
- Data stored locally in browser (no cloud sync)
- Maximum of 4 options per multiple choice
- Only two question types supported
- No user authentication

### Potential Future Features
- Cloud storage and sync
- User authentication
- More question types (short answer, matching, etc.)
- Question banks and question reuse
- Randomized question order per student
- Time limits per exam or per question
- Detailed analytics and reporting
- Import/Export exam data
- Student progress tracking
- Certificate generation
- Integration with learning management systems

## Troubleshooting

### My data disappeared
- Check if you're using the same browser and device
- LocalStorage is browser and device specific
- Try exporting your exam as HTML/PDF for backup

### Export not working
- Make sure your browser allows downloads
- Check your downloads folder
- Try a different browser if issues persist

### Exam won't load
- Refresh the page
- Clear browser cache if needed
- Ensure you're using a modern browser

## Development

### Running the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact support.

---

**Built with ❤️ using Next.js and Modern Web Technologies**
