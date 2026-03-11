'use client';

import { useState } from 'react';
import { Exam, Question, QuestionType, Option } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, ChevronUp, ChevronDown, CheckCircle2, Circle, Copy } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useRouter } from 'next/navigation';

interface ExamCreatorProps {
  initialExam?: Exam;
  onSave?: (exam: Exam) => void;
}

export function ExamCreator({ initialExam, onSave }: ExamCreatorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialExam?.title || '');
  const [description, setDescription] = useState(initialExam?.description || '');
  const [questions, setQuestions] = useState<Question[]>(initialExam?.questions || []);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      text: '',
      options: type === 'true-false'
        ? [
          { id: 'true', text: 'True' },
          { id: 'false', text: 'False' },
        ]
        : [
          { id: `opt_1`, text: '' },
          { id: `opt_2`, text: '' },
          { id: `opt_3`, text: '' },
          { id: `opt_4`, text: '' },
        ],
      correctAnswer: '',
      order: questions.length,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === questionId ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const duplicateQuestion = (question: Question, index: number) => {
    const newQuestion: Question = {
      ...question,
      id: `q_${Date.now()}`,
      order: questions.length,
      options: question.options.map(opt => ({ ...opt, id: `opt_${Date.now()}_${Math.random()}` }))
    };
    // Ensure correct answer is mapped across new option IDs
    if (question.type === 'multiple-choice' && question.correctAnswer) {
      const mappedCorrectAnswer = newQuestion.options[question.options.findIndex(o => o.id === question.correctAnswer)]?.id;
      newQuestion.correctAnswer = mappedCorrectAnswer || '';
    } else if (question.type === 'true-false') {
      newQuestion.options = [
        { id: 'true', text: 'True' },
        { id: 'false', text: 'False' },
      ];
    }

    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, newQuestion);
    setQuestions(newQuestions.map((q, i) => ({ ...q, order: i })));
  };

  const reorderQuestion = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newQuestions.length) return;
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    setQuestions(newQuestions);
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? {
          ...q,
          options: q.options.map(opt => opt.id === optionId ? { ...opt, text } : opt),
        }
        : q
    ));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter an exam title');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    const unansweredQuestions = questions.filter(q => !q.correctAnswer);
    if (unansweredQuestions.length > 0) {
      alert('Please select a correct answer for all questions');
      return;
    }

    const exam: Exam = {
      id: initialExam?.id || `exam_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      questions: questions.map((q, idx) => ({ ...q, order: idx })),
      createdAt: initialExam?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    storage.saveExam(exam);
    onSave?.(exam);
    router.push('/dashboard');
  };

  return (
    <div className="w-full space-y-8 pb-32">
      {/* Header Fields Bento */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-8 space-y-6 transition-all">
        <div>
          <label className="text-sm font-semibold text-slate-700 ml-1 mb-2 block">Exam Title</label>
          <Input
            placeholder="e.g., Biology Final Exam"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="h-14 text-xl font-semibold bg-white/60 border-slate-200/60 rounded-2xl focus-visible:bg-white focus-visible:ring-indigo-500/20 shadow-sm"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 ml-1 mb-2 block">Description (Optional)</label>
          <Textarea
            placeholder="Describe your exam instructions or contents..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="bg-white/60 border-slate-200/60 rounded-2xl focus-visible:bg-white focus-visible:ring-indigo-500/20 shadow-sm resize-none text-base"
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-md border border-dashed border-slate-300 rounded-[32px] p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-700">No questions yet</p>
            <p className="text-sm mt-1 mb-6">Start building your exam by adding a question below.</p>
            <div className="flex gap-3">
              <Button onClick={() => addQuestion('multiple-choice')} className="rounded-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">
                <Plus className="w-4 h-4 mr-2 text-indigo-500" /> Multiple Choice
              </Button>
              <Button onClick={() => addQuestion('true-false')} className="rounded-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">
                <Plus className="w-4 h-4 mr-2 text-violet-500" /> True/False
              </Button>
            </div>
          </div>
        ) : (
          questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              totalQuestions={questions.length}
              onUpdate={(updates) => updateQuestion(question.id, updates)}
              onDelete={() => deleteQuestion(question.id)}
              onDuplicate={() => duplicateQuestion(question, index)}
              onReorder={(direction) => reorderQuestion(index, direction)}
              onOptionChange={(optionId, text) => updateOption(question.id, optionId, text)}
            />
          ))
        )}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 bg-white/80 backdrop-blur-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full w-max max-w-[95vw] overflow-x-auto">
        <Button onClick={() => addQuestion('multiple-choice')} variant="ghost" className="rounded-full hover:bg-slate-100/50 text-slate-600 font-medium whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2 text-indigo-500" /> <span className="hidden sm:inline">Multiple Choice</span><span className="sm:hidden">Choice</span>
        </Button>
        <Button onClick={() => addQuestion('true-false')} variant="ghost" className="rounded-full hover:bg-slate-100/50 text-slate-600 font-medium whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2 text-violet-500" /> True/False
        </Button>
        <div className="w-px h-8 bg-slate-200 mx-1 shrink-0" />
        <Button variant="ghost" onClick={() => router.back()} className="rounded-full text-slate-500 hover:text-slate-900 font-medium">
          Cancel
        </Button>
        <Button onClick={handleSave} className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 text-white shadow-md font-medium whitespace-nowrap">
          {initialExam ? 'Update' : 'Publish'} Exam
        </Button>
      </div>
    </div>
  );
}

interface QuestionCardProps {
  question: Question;
  index: number;
  totalQuestions: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onReorder: (direction: 'up' | 'down') => void;
  onOptionChange: (optionId: string, text: string) => void;
}

function QuestionCard({
  question,
  index,
  totalQuestions,
  onUpdate,
  onDelete,
  onDuplicate,
  onReorder,
  onOptionChange,
}: QuestionCardProps) {
  return (
    <div className="group relative bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[32px] p-6 md:p-8 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-3 shrink-0">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-bold text-slate-700">
              {index + 1}
            </span>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100/50 tracking-wide uppercase">
              {question.type === 'true-false' ? 'True / False' : 'Multiple Choice'}
            </span>
          </div>
          <Textarea
            placeholder="Type your question here..."
            value={question.text}
            onChange={e => onUpdate({ text: e.target.value })}
            rows={2}
            className="text-lg bg-slate-50 border-transparent hover:border-slate-200 focus-visible:bg-white focus-visible:border-indigo-200 focus-visible:ring-indigo-500/20 rounded-2xl resize-none shadow-sm transition-all"
          />
        </div>

        {/* Toolbar - Sticky on mobile, top right on desktop */}
        <div className="flex md:flex-col gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-slate-50 md:bg-transparent p-1 md:p-0 rounded-2xl w-full md:w-auto justify-end">
          <div className="flex gap-1 md:flex-col items-center">
            <Button variant="ghost" size="icon" onClick={() => onReorder('up')} disabled={index === 0} title="Move up" className="rounded-xl hover:bg-slate-200/50 text-slate-400 hover:text-slate-700 h-8 w-8">
              <ChevronUp className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onReorder('down')} disabled={index === totalQuestions - 1} title="Move down" className="rounded-xl hover:bg-slate-200/50 text-slate-400 hover:text-slate-700 h-8 w-8">
              <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
          <div className="w-px h-6 md:w-6 md:h-px bg-slate-200 mx-2 md:my-2" />
          <div className="flex gap-1 md:flex-col items-center">
            <Button variant="ghost" size="icon" onClick={onDuplicate} title="Duplicate question" className="rounded-xl hover:bg-slate-200/50 text-slate-400 hover:text-slate-700 h-8 w-8">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} title="Delete question" className="rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 h-8 w-8">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Options Container */}
      <div className="pl-2 md:pl-11 space-y-3">
        {question.options.map((option, optIdx) => {
          const isSelected = question.correctAnswer === option.id;
          return (
            <div key={option.id} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onUpdate({ correctAnswer: option.id })}
                className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${isSelected
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                    : 'bg-white border-2 border-slate-300 text-transparent hover:border-indigo-400'
                  }`}
                title="Mark as correct answer"
              >
                {isSelected && <CheckCircle2 className="w-4 h-4" />}
                {!isSelected && <Circle className="w-4 h-4 opacity-0" />}
              </button>

              {question.type === 'true-false' ? (
                <div
                  onClick={() => onUpdate({ correctAnswer: option.id })}
                  className={`flex-1 py-3 px-4 rounded-2xl border cursor-pointer transition-all ${isSelected
                      ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 font-medium'
                      : 'bg-slate-50 border-transparent hover:border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {option.text}
                </div>
              ) : (
                <div className="relative flex-1 group/input">
                  <Input
                    placeholder={`Option ${optIdx + 1}`}
                    value={option.text}
                    onChange={e => onOptionChange(option.id, e.target.value)}
                    className={`h-12 pl-4 pr-10 rounded-2xl transition-all shadow-sm ${isSelected
                        ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 font-medium focus-visible:ring-indigo-500/20'
                        : 'bg-slate-50 border-transparent hover:border-slate-200 focus-visible:bg-white focus-visible:border-slate-300 text-slate-900'
                      }`}
                  />
                  {isSelected && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-1 rounded-md shadow-sm border border-indigo-100">
                      Correct
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
