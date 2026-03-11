import { ExamCreator } from '@/components/exam-creator';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Create Exam - ExamMaster',
  description: 'Create a new exam with custom questions',
};

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-40">
      {/* Background decoration */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/20 blur-[120px] pointer-events-none" />

      {/* Navigation - Glassmorphic */}
      <nav className="sticky top-0 z-50 flex items-center p-4 px-6 mx-auto bg-white/50 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap hidden sm:block">ExamMaster Studio</h1>
          <div className="w-[120px] hidden sm:block" /> {/* Spacer */}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto mt-10 px-4 md:px-6 space-y-8 relative z-10 w-full">
        <div className="space-y-3 text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Create New Exam</h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">Craft your perfect assessment with our distraction-free editor.</p>
        </div>
        <ExamCreator />
      </div>
    </div>
  );
}
