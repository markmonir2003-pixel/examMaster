import { Exam, Question } from './types';

/**
 * Generate a unique ID
 */
export const generateId = (prefix: string = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format date for display
 */
export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date for results display
 */
export const formatDateShort = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculate exam statistics
 */
export const calculateExamStats = (exam: Exam) => {
  return {
    totalQuestions: exam.questions.length,
    multipleChoice: exam.questions.filter(q => q.type === 'multiple-choice').length,
    trueFalse: exam.questions.filter(q => q.type === 'true-false').length,
  };
};

/**
 * Validate exam before saving
 */
export const validateExam = (exam: Exam) => {
  const errors: string[] = [];

  if (!exam.title || exam.title.trim().length === 0) {
    errors.push('Exam title is required');
  }

  if (exam.questions.length === 0) {
    errors.push('At least one question is required');
  }

  exam.questions.forEach((q, idx) => {
    if (!q.text || q.text.trim().length === 0) {
      errors.push(`Question ${idx + 1} text is required`);
    }

    if (!q.correctAnswer) {
      errors.push(`Question ${idx + 1} must have a correct answer selected`);
    }

    if (q.type === 'multiple-choice') {
      const filledOptions = q.options.filter(o => o.text.trim().length > 0);
      if (filledOptions.length < 2) {
        errors.push(`Question ${idx + 1} must have at least 2 answer options`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Clone an exam
 */
export const cloneExam = (exam: Exam): Exam => {
  return {
    ...exam,
    id: generateId('exam'),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    questions: exam.questions.map(q => ({
      ...q,
      id: generateId('q'),
    })),
  };
};

/**
 * Get pass/fail status
 */
export const getPassStatus = (percentage: number, passingScore: number = 50) => {
  return percentage >= passingScore;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number) => {
  return Math.round(value * 100) / 100;
};

/**
 * Group results by status
 */
export const groupResultsByStatus = (results: Array<{ percentage: number }>) => {
  return {
    passed: results.filter(r => r.percentage >= 50).length,
    failed: results.filter(r => r.percentage < 50).length,
    total: results.length,
  };
};
