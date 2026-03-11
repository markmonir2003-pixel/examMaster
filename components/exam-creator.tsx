'use client';

import { useState } from 'react';
import { Exam, Question, QuestionType, Option } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { X, Plus, ChevronUp, ChevronDown } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Exam Title</label>
          <Input
            placeholder="e.g., Biology Final Exam"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="text-lg"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Description (Optional)</label>
          <Textarea
            placeholder="Describe your exam..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Questions</h2>
        {questions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No questions yet. Add your first question below.</p>
          </Card>
        ) : (
          questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              totalQuestions={questions.length}
              onUpdate={(updates) => updateQuestion(question.id, updates)}
              onDelete={() => deleteQuestion(question.id)}
              onReorder={(direction) => reorderQuestion(index, direction)}
              onOptionChange={(optionId, text) => updateOption(question.id, optionId, text)}
            />
          ))
        )}
      </div>

      {/* Add Question Buttons */}
      <div className="flex gap-3 justify-center">
        <Button onClick={() => addQuestion('multiple-choice')} variant="outline" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Multiple Choice
        </Button>
        <Button onClick={() => addQuestion('true-false')} variant="outline" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add True/False
        </Button>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 justify-center pt-6">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} size="lg" className="px-8">
          {initialExam ? 'Update' : 'Create'} Exam
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
  onReorder: (direction: 'up' | 'down') => void;
  onOptionChange: (optionId: string, text: string) => void;
}

function QuestionCard({
  question,
  index,
  totalQuestions,
  onUpdate,
  onDelete,
  onReorder,
  onOptionChange,
}: QuestionCardProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-muted-foreground">Q{index + 1}</span>
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
              {question.type === 'true-false' ? 'True/False' : 'Multiple Choice'}
            </span>
          </div>
          <Textarea
            placeholder="Enter question text..."
            value={question.text}
            onChange={e => onUpdate({ text: e.target.value })}
            rows={2}
          />
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReorder('up')}
            disabled={index === 0}
            title="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReorder('down')}
            disabled={index === totalQuestions - 1}
            title="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 pl-4 border-l-2 border-secondary">
        {question.options.map(option => (
          <div key={option.id} className="flex items-center gap-3">
            <input
              type="radio"
              id={`${question.id}_${option.id}`}
              name={question.id}
              checked={question.correctAnswer === option.id}
              onChange={() => onUpdate({ correctAnswer: option.id })}
              className="w-4 h-4 cursor-pointer"
            />
            {question.type === 'true-false' ? (
              <label htmlFor={`${question.id}_${option.id}`} className="text-sm cursor-pointer flex-1">
                {option.text}
              </label>
            ) : (
              <Input
                placeholder={`Option ${question.options.indexOf(option) + 1}`}
                value={option.text}
                onChange={e => onOptionChange(option.id, e.target.value)}
                className="flex-1"
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
