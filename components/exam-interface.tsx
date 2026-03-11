'use client';

import { useState } from 'react';
import { Exam, StudentAnswer, ExamResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { storage } from '@/lib/storage';

interface ExamInterfaceProps {
  exam: Exam;
  onComplete?: (result: ExamResult) => void;
}

export function ExamInterface({ exam, onComplete }: ExamInterfaceProps) {
  const [studentName, setStudentName] = useState('');
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{exam.title}</h1>
            {exam.description && <p className="text-muted-foreground">{exam.description}</p>}
          </div>

          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Questions:</strong> {exam.questions.length}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Your Name</label>
            <Input
              placeholder="Enter your name"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
            />
          </div>

          <Button
            onClick={() => setStarted(true)}
            disabled={!studentName.trim()}
            size="lg"
            className="w-full"
          >
            Start Exam
          </Button>
        </Card>
      </div>
    );
  }

  if (submitted && result) {
    return <ExamResults exam={exam} result={result} />;
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  const handleSelectAnswer = (optionId: string) => {
    const existingIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
    const newAnswers = [...answers];
    if (existingIndex > -1) {
      newAnswers[existingIndex] = { questionId: currentQuestion.id, selectedOption: optionId };
    } else {
      newAnswers.push({ questionId: currentQuestion.id, selectedOption: optionId });
    }
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    answers.forEach(answer => {
      const question = exam.questions.find(q => q.id === answer.questionId);
      if (question && question.correctAnswer === answer.selectedOption) {
        correctCount++;
      }
    });

    const score = correctCount;
    const percentage = Math.round((correctCount / exam.questions.length) * 100);

    const examResult: ExamResult = {
      id: `result_${Date.now()}`,
      examId: exam.id,
      studentName: studentName.trim(),
      answers,
      score: correctCount,
      totalQuestions: exam.questions.length,
      percentage,
      submittedAt: Date.now(),
    };

    storage.saveResult(examResult);
    setResult(examResult);
    setSubmitted(true);
    onComplete?.(examResult);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {exam.questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 space-y-6">
          <div>
            <p className="text-lg font-semibold text-foreground">{currentQuestion.text}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  currentAnswer?.selectedOption === option.id
                    ? 'border-primary bg-primary/10'
                    : 'border-secondary hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      currentAnswer?.selectedOption === option.id
                        ? 'border-primary bg-primary'
                        : 'border-secondary'
                    }`}
                  >
                    {currentAnswer?.selectedOption === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t border-secondary">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {currentQuestionIndex < exam.questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="ml-auto"
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="ml-auto">
                Submit Exam
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

interface ExamResultsProps {
  exam: Exam;
  result: ExamResult;
}

function ExamResults({ exam, result }: ExamResultsProps) {
  const isPassed = result.percentage >= 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 space-y-6 text-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Exam Submitted!</h1>
            <p className="text-muted-foreground">Here are your results</p>
          </div>

          <div className={`p-6 rounded-lg ${isPassed ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
            <div className="text-6xl font-bold mb-2">{result.percentage}%</div>
            <div className="text-xl font-semibold mb-1">
              {result.score} out of {result.totalQuestions} correct
            </div>
            <div className={`text-sm ${isPassed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {isPassed ? '✓ Passed' : '✗ Not Passed (50% is the passing score)'}
            </div>
          </div>

          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="text-sm">Student: <strong>{result.studentName}</strong></p>
          </div>
        </Card>

        {/* Review Answers */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Review Your Answers</h2>
          {exam.questions.map((question, index) => {
            const studentAnswer = result.answers.find(a => a.questionId === question.id);
            const isCorrect = studentAnswer?.selectedOption === question.correctAnswer;
            const selectedOption = question.options.find(o => o.id === studentAnswer?.selectedOption);
            const correctOption = question.options.find(o => o.id === question.correctAnswer);

            return (
              <Card key={question.id} className={`p-4 border-2 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-2">Q{index + 1}: {question.text}</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Your answer:</span> {selectedOption?.text || 'Not answered'}
                      </div>
                      {!isCorrect && (
                        <div>
                          <span className="font-medium text-green-600 dark:text-green-400">Correct answer:</span> {correctOption?.text}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button onClick={() => window.location.reload()} size="lg" className="w-full">
          Start New Exam
        </Button>
      </div>
    </div>
  );
}
