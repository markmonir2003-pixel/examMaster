'use client';

import { useState, useEffect } from 'react';
import { Exam } from '@/lib/types';
import { storage } from '@/lib/storage';
import { ExamCreator } from '@/components/exam-creator';
import { Card } from '@/components/ui/card';

export default function EditExamPage({ params }: { params: { id: string } }) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExam = () => {
      const foundExam = storage.getExamById(params.id);
      setExam(foundExam);
      setLoading(false);
    };
    loadExam();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
        <Card className="p-8">
          <p className="text-center">Loading exam...</p>
        </Card>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
        <Card className="p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Exam Not Found</h2>
          <p className="text-muted-foreground">This exam does not exist or has been deleted.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Edit Exam</h1>
          <p className="text-muted-foreground">Make changes to your exam and save.</p>
        </div>
        <ExamCreator initialExam={exam} />
      </div>
    </div>
  );
}
