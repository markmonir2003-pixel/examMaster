import { ExamCreator } from '@/components/exam-creator';

export const metadata = {
  title: 'Create Exam - ExamMaster',
  description: 'Create a new exam with custom questions',
};

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Create New Exam</h1>
          <p className="text-muted-foreground">Build your exam step by step. Add unlimited questions with instant preview.</p>
        </div>
        <ExamCreator />
      </div>
    </div>
  );
}
