'use client';

import { useState } from 'react';
import { Exam, StudentAnswer, ExamResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { storage } from '@/lib/storage';
import { ArrowLeft, CheckCircle2, Circle, AlertCircle, Award, Target, Trophy, ChevronRight, ChevronLeft, Flag } from 'lucide-react';
import Link from 'next/link';

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
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/20 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[32px] p-8 sm:p-10 space-y-8 relative z-10">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{exam.title}</h1>
            {exam.description ? (
              <p className="text-slate-500 leading-relaxed">{exam.description}</p>
            ) : (
              <p className="text-slate-400 italic">No description provided</p>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 py-4 border-y border-slate-200/60">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{exam.questions.length}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Questions</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">100</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Points</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 ml-1 block">Student Name</label>
            <Input
              placeholder="e.g. Jane Doe"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              className="h-14 text-lg bg-white/60 border-slate-200/60 rounded-2xl focus-visible:bg-white focus-visible:ring-indigo-500/20 shadow-sm text-center font-medium"
            />
          </div>

          <Button
            onClick={() => setStarted(true)}
            disabled={!studentName.trim()}
            size="lg"
            className="w-full rounded-2xl h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 font-semibold text-lg transition-all disabled:opacity-50 disabled:shadow-none"
          >
            Start Exam
          </Button>

          <div className="text-center pt-2">
            <Link href="/" className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
              Cancel and go back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && result) {
    return <ExamResults exam={exam} result={result} />;
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const answeredCount = answers.length;
  const progressPercent = (answeredCount / exam.questions.length) * 100;

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
    if (answers.length < exam.questions.length) {
      if (!confirm(`You have only answered ${answers.length} out of ${exam.questions.length} questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    let correctCount = 0;
    answers.forEach(answer => {
      const question = exam.questions.find(q => q.id === answer.questionId);
      if (question && question.correctAnswer === answer.selectedOption) {
        correctCount++;
      }
    });

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

  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden">
      {/* Background Accents */}
      <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-slate-200/30 blur-[120px] pointer-events-none" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{exam.title}</h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{studentName}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700">{answeredCount} of {exam.questions.length} answered</span>
            </div>
            <Button onClick={handleSubmit} variant="outline" size="sm" className="rounded-full bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50">
              <Flag className="w-4 h-4 mr-2" /> Finish
            </Button>
          </div>
        </div>
        {/* Progress Bar inside header */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 flex flex-col justify-center relative z-10 my-auto min-h-[500px]">
        {/* Question Card */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-lg font-bold text-indigo-700 shadow-sm border border-indigo-200/50">
              {currentQuestionIndex + 1}
            </span>
            <span className="text-sm font-semibold text-slate-400 tracking-widest uppercase">
              {currentQuestion.type === 'true-false' ? 'True / False' : 'Multiple Choice'} Question
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-8">
            {currentQuestion.text}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3 mb-10">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = currentAnswer?.selectedOption === option.id;
              const letters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(option.id)}
                  className={`w-full group flex items-center p-4 rounded-[20px] transition-all duration-200 text-left border-2 ${isSelected
                      ? 'bg-indigo-50/80 border-indigo-500 shadow-md shadow-indigo-500/10 scale-[1.01]'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm hover:bg-slate-50'
                    }`}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 transition-colors ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                    }`}>
                    {currentQuestion.type === 'true-false' ? (idx === 0 ? 'T' : 'F') : letters[idx]}
                  </div>
                  <span className={`text-lg transition-colors ${isSelected ? 'text-indigo-950 font-semibold' : 'text-slate-700 font-medium'}`}>
                    {option.text}
                  </span>
                  {isSelected && <CheckCircle2 className="w-6 h-6 ml-auto text-indigo-500 animate-in zoom-in duration-200" />}
                </button>
              )
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-100 px-6 h-14"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Previous
            </Button>

            {!isLastQuestion ? (
              <Button
                size="lg"
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 px-8 h-14"
              >
                Next Question <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSubmit}
                className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 px-8 h-14 animate-pulse relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">Submit Exam <CheckCircle2 className="w-5 h-5 ml-2" /></span>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ----------------------------------------------------
// RESULTS VIEW
// ----------------------------------------------------

interface ExamResultsProps {
  exam: Exam;
  result: ExamResult;
}

function ExamResults({ exam, result }: ExamResultsProps) {
  const isPassed = result.percentage >= 50;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden py-10">
      {/* Background Accents */}
      <div className={`fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none ${isPassed ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`} />

      <div className="max-w-3xl mx-auto w-full px-4 space-y-8 relative z-10">
        {/* Top Summary Bento */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[32px] p-8 md:p-12 text-center overflow-hidden relative">
          {isPassed && (
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full blur-2xl opacity-40 mix-blend-multiply" />
          )}

          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${isPassed ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30' : 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-500/30'}`}>
              {isPassed ? <Trophy className="w-10 h-10 text-white" /> : <AlertCircle className="w-10 h-10 text-white" />}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">{isPassed ? 'Congratulations!' : 'Exam Completed'}</h1>
          <p className="text-slate-500 font-medium mb-8">
            {isPassed ? `Great job, ${result.studentName}. You passed!` : `Don't worry, ${result.studentName}. You can try again.`}
          </p>

          <div className={`inline-flex flex-col items-center justify-center p-8 rounded-3xl border-2 mb-8 w-full max-w-sm mx-auto ${isPassed ? 'border-emerald-100 bg-emerald-50/50' : 'border-rose-100 bg-rose-50/50'}`}>
            <div className={`text-7xl font-black tracking-tighter ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
              {result.percentage}%
            </div>
            <div className="text-slate-600 font-medium mt-2">
              {result.score} out of {result.totalQuestions} correct
            </div>
          </div>

          <Link href="/">
            <Button size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl px-8 h-14">
              Return Home
            </Button>
          </Link>
        </div>

        {/* Detailed Review Section */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          <div className="flex items-center gap-3 ml-2">
            <Award className="w-6 h-6 text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Answer Review</h2>
          </div>

          <div className="space-y-4">
            {exam.questions.map((question, index) => {
              const studentAnswer = result.answers.find(a => a.questionId === question.id);
              const isCorrect = studentAnswer?.selectedOption === question.correctAnswer;
              const selectedOption = question.options.find(o => o.id === studentAnswer?.selectedOption);
              const correctOption = question.options.find(o => o.id === question.correctAnswer);

              return (
                <div key={question.id} className={`bg-white rounded-[24px] p-6 sm:p-8 border-2 shadow-sm transition-all hover:shadow-md ${isCorrect ? 'border-emerald-100 hover:border-emerald-200' : 'border-rose-100 hover:border-rose-200'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm font-bold ${isCorrect ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}>
                      {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XSquareIcon />}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-semibold text-lg text-slate-900 leading-snug mb-4">
                        <span className="text-slate-400 mr-2">{index + 1}.</span>
                        {question.text}
                      </p>

                      <div className="space-y-3">
                        <div className={`p-4 rounded-2xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                          <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60">Your Answer</p>
                          <p className={`font-medium ${isCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>
                            {selectedOption?.text || <span className="italic">Did not answer</span>}
                          </p>
                        </div>

                        {!isCorrect && (
                          <div className="p-4 rounded-2xl border bg-slate-50 border-slate-100">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Correct Answer</p>
                            <p className="font-medium text-slate-900">{correctOption?.text}</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function XSquareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
  )
}
