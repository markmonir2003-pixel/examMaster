import { Exam, ExamResult } from './types';

const EXAMS_KEY = 'exams';
const RESULTS_KEY = 'exam_results';

export const storage = {
  // Exams
  getExams: (): Exam[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(EXAMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveExam: (exam: Exam): void => {
    if (typeof window === 'undefined') return;
    try {
      const exams = storage.getExams();
      const existingIndex = exams.findIndex(e => e.id === exam.id);
      if (existingIndex > -1) {
        exams[existingIndex] = exam;
      } else {
        exams.push(exam);
      }
      localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  },

  deleteExam: (examId: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const exams = storage.getExams();
      const filtered = exams.filter(e => e.id !== examId);
      localStorage.setItem(EXAMS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  },

  getExamById: (examId: string): Exam | null => {
    const exams = storage.getExams();
    return exams.find(e => e.id === examId) || null;
  },

  // Results
  getResults: (): ExamResult[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(RESULTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveResult: (result: ExamResult): void => {
    if (typeof window === 'undefined') return;
    try {
      const results = storage.getResults();
      results.push(result);
      localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    } catch (error) {
      console.error('Error saving result:', error);
    }
  },

  getResultsByExamId: (examId: string): ExamResult[] => {
    const results = storage.getResults();
    return results.filter(r => r.examId === examId);
  },

  getStats: (examId: string) => {
    const results = storage.getResultsByExamId(examId);
    if (results.length === 0) {
      return {
        totalSubmissions: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0,
      };
    }

    const scores = results.map(r => r.percentage);
    return {
      totalSubmissions: results.length,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / results.length),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      passRate: Math.round((results.filter(r => r.percentage >= 50).length / results.length) * 100),
    };
  },
};
