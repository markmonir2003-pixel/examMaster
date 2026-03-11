'use client';

import { useState, useEffect } from 'react';
import { Exam } from '@/lib/types';
import { storage } from '@/lib/storage';
import { ExamCreator } from '@/components/exam-creator';
import { Card } from '@/components/ui/card';
import { useParams } from 'next/navigation';

export default function EditExamPage() {
  const params = useParams();
  const id = params?.id as string;
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadExam = () => {
      const foundExam = storage.getExamById(id);
      setExam(foundExam);
      setLoading(false);
    };
    loadExam();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
        <Card className="p-8 text-center space-y-4 shadow-sm border-slate-200 rounded-[24px]">
          <h2 className="text-2xl font-bold text-slate-900">Exam Not Found</h2>
          <p className="text-slate-500">This exam does not exist or has been deleted.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <div className="max-w-4xl mx-auto space-y-6 pt-10 px-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Exam</h1>
          <p className="text-slate-500">Make changes to your exam and save.</p>
        </div>
        <ExamCreator initialExam={exam} />
      </div>
    </div>
  );
}
