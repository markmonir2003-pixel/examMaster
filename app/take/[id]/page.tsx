'use client';

import { useState, useEffect } from 'react';
import { Exam } from '@/lib/types';
import { storage } from '@/lib/storage';
import { ExamInterface } from '@/components/exam-interface';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TakeExamPage() {
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
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[32px] p-8 sm:p-10 space-y-6 text-center relative z-10">
          <div className="w-20 h-20 bg-rose-100 rounded-full mx-auto flex items-center justify-center shadow-inner mb-2">
            <AlertCircle className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Exam Not Found</h2>
          <p className="text-slate-500 leading-relaxed">This exam does not exist, has been deleted, or the link is invalid.</p>
          <div className="pt-4">
            <Link href="/">
              <Button size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 w-full h-14">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ExamInterface exam={exam} />;
}
