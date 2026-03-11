export type QuestionType = 'multiple-choice' | 'true-false';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: Option[];
  correctAnswer: string; // id of the correct option
  order: number;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: number;
  updatedAt: number;
}

export interface StudentAnswer {
  questionId: string;
  selectedOption: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentName: string;
  answers: StudentAnswer[];
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: number;
}

export interface ExamStats {
  totalSubmissions: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
}
