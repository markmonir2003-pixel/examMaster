import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, BookOpen, Zap, BarChart3, FileText, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/20 blur-[120px] pointer-events-none" />

      {/* Navigation - Glassmorphic */}
      <nav className="sticky top-0 z-50 flex items-center justify-between p-6 px-8 mx-auto max-w-7xl bg-white/50 backdrop-blur-xl border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">ExamMaster</h1>
        </div>
        <Link href="/dashboard">
          <Button className="rounded-full px-6 shadow-sm hover:shadow-md transition-all duration-300 bg-white text-slate-900 border border-slate-200 hover:bg-slate-50">
            Dashboard
          </Button>
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-16 space-y-12 relative z-10">

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

          {/* Main Hero Bento (Spans 8 cols) */}
          <div className="md:col-span-8 md:row-span-2 group relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-10 flex flex-col justify-center items-start transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-indigo-100/50 text-indigo-700 text-sm font-medium border border-indigo-200/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              ExamMaster 2.0 is highly optimized
            </div>

            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Create and Manage <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                Online Exams
              </span> Effortlessly.
            </h2>
            <p className="text-lg text-slate-500 mb-8 max-w-xl leading-relaxed">
              Build professional exams with a clean, high-performance interface. Instant grading, modern analytics, and multiple export formats.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/create">
                <Button size="lg" className="rounded-2xl px-8 h-14 bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5 group cursor-pointer">
                  Start Creating
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats/Graphic Bento (Spans 4 cols) */}
          <div className="md:col-span-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[32px] p-8 text-white shadow-lg shadow-indigo-500/20 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <BarChart3 className="w-10 h-10 text-white/80 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-indigo-100 leading-relaxed text-sm">
                Track student performance with comprehensive, real-time statistics and score distributions.
              </p>
            </div>
            <div className="relative z-10 mt-8 pt-6 border-t border-white/20 flex justify-between items-end">
              <div>
                <div className="text-4xl font-bold tracking-tight">100%</div>
                <div className="text-indigo-100 text-sm font-medium mt-1">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Features Bento Cells (3 cells, 4 cols each) */}
          {/* <FeatureBento
            icon={<BookOpen className="w-6 h-6 text-emerald-500" />}
            title="Clean Editor"
            desc="Distraction-free exam creation with smart keyboard shortcuts."
            bg="bg-emerald-500/10"
          /> */}
          {/* <FeatureBento
            icon={<Zap className="w-6 h-6 text-amber-500" />}
            title="Lightning Fast"
            desc="Virtualized DOM ensures 60fps performance on massive exams."
            bg="bg-amber-500/10"
          /> */}
          {/* <FeatureBento
            icon={<FileText className="w-6 h-6 text-pink-500" />}
            title="Multiple Exports"
            desc="One-click export to standalone HTML or universally accessible PDF."
            bg="bg-pink-500/10"
          /> */}

          {/* How It Works Wide Bento (Spans 12 cols) */}
          <div className="md:col-span-12 bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-10 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/3 space-y-4">
              <h3 className="text-3xl font-bold tracking-tight text-slate-900">Seamless Workflow</h3>
              <p className="text-slate-500 leading-relaxed">
                We've engineered every step to minimize friction. From drafting to publishing, experience the modern standard of educational tools.
              </p>
            </div>
            <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              <StepItem num="1" title="Draft" subtitle="In the editor" />
              <StepItem num="2" title="Publish" subtitle="To the web" />
              <StepItem num="3" title="Distribute" subtitle="To students" />
              <StepItem num="4" title="Analyze" subtitle="The results" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function FeatureBento({ icon, title, desc, bg }: { icon: React.ReactNode, title: string, desc: string, bg: string }) {
  return (
    <div className="md:col-span-4 bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[32px] p-8 hover:-translate-y-1 transition-transform duration-300">
      <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  )
}

function StepItem({ num, title, subtitle }: { num: string, title: string, subtitle: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm">
        {num}
      </div>
      <div>
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <div className="text-sm text-slate-500">{subtitle}</div>
      </div>
    </div>
  )
}
