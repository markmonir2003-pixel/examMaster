'use client';

import { useState, useEffect } from 'react';
import { Exam, ExamResult } from '@/lib/types';
import { storage } from '@/lib/storage';
import { downloadHTML, downloadPDF } from '@/lib/export';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Edit, Trash2, Plus, Download, Eye, BarChart3, ArrowLeft, Search, Users, CheckCircle, Trophy, Target } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Dashboard() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      setResults(storage.getResultsByExamId(selectedExam.id));
    }
  }, [selectedExam]);

  const loadExams = () => {
    setExams(storage.getExams());
  };

  const handleDeleteExam = (examId: string) => {
    storage.deleteExam(examId);
    setExams(exams.filter(e => e.id !== examId));
    if (selectedExam?.id === examId) {
      setSelectedExam(null);
    }
  };

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-40">
      {/* Background decoration */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/20 blur-[120px] pointer-events-none" />

      {/* Navigation - Glassmorphic */}
      <nav className="sticky top-0 z-50 flex items-center p-4 px-6 mx-auto bg-white/50 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap hidden sm:block">Exam Dashboard</h1>
          <Link href="/create">
            <Button size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Create Exam
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-8 relative z-10">

        {/* Main Content */}
        {exams.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-md border border-dashed border-slate-300 rounded-[32px] p-16 text-center text-slate-500 flex flex-col items-center justify-center max-w-2xl mx-auto mt-12">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Trophy className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No exams yet</h2>
            <p className="text-slate-500 mb-8 max-w-sm">You haven't created any exams. Build your first assessment to get started grading!</p>
            <Link href="/create">
              <Button size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Exam
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Exams List (Left Sidebar) */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search exams..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 h-12 bg-white/60 border-slate-200/60 rounded-2xl focus-visible:bg-white focus-visible:ring-indigo-500/20 shadow-sm"
                />
              </div>

              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 pb-4 scrollbar-hide">
                {filteredExams.map(exam => (
                  <div
                    key={exam.id}
                    className={`group relative p-5 cursor-pointer transition-all duration-300 border backdrop-blur-xl rounded-[24px] ${selectedExam?.id === exam.id
                        ? 'bg-indigo-50 border-indigo-200 shadow-md shadow-indigo-500/10'
                        : 'bg-white/60 border-white/40 shadow-sm hover:shadow-md hover:bg-white border-slate-200/50'
                      }`}
                    onClick={() => setSelectedExam(exam)}
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className={`font-semibold truncate ${selectedExam?.id === exam.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                        {exam.title}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="flex items-center"><Target className="w-3 h-3 mr-1" /> {exam.questions.length} Qs</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{storage.getResultsByExamId(exam.id).length} results</span>
                      </p>
                    </div>

                    {/* Quick Actions overlay */}
                    <div className={`absolute top-4 right-4 flex gap-1 transition-opacity ${selectedExam?.id === exam.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-white shadow-sm border border-slate-100 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                        onClick={e => {
                          e.stopPropagation();
                          router.push(`/edit/${exam.id}`);
                        }}
                        title="Edit exam"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full bg-white shadow-sm border border-slate-100 text-slate-600 hover:text-red-600 hover:bg-red-50"
                            title="Delete exam"
                            onClick={e => e.stopPropagation()}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl">
                          <AlertDialogTitle>Delete Exam</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{exam.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                          <div className="flex gap-3 justify-end mt-4">
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteExam(exam.id)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                            >
                              Delete Exam
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Panel (Right Full View) */}
            <div className="lg:col-span-8 xl:col-span-9">
              {selectedExam ? (
                <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-6 sm:p-8 flex flex-col h-full min-h-[600px]">

                  {/* Exam Header Header */}
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-8 pb-8 border-b border-slate-100">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2 border border-slate-200">
                        Selected Exam
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{selectedExam.title}</h2>
                      {selectedExam.description ? (
                        <p className="text-slate-500 max-w-xl leading-relaxed">{selectedExam.description}</p>
                      ) : (
                        <p className="text-slate-400 italic text-sm">No description provided.</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end shrink-0">
                      <Button onClick={() => downloadHTML(selectedExam)} variant="outline" size="sm" className="rounded-full bg-white border-slate-200">
                        <Download className="w-4 h-4 mr-2 text-indigo-500" /> HTML
                      </Button>
                      <Button onClick={() => downloadPDF(selectedExam)} variant="outline" size="sm" className="rounded-full bg-white border-slate-200">
                        <Download className="w-4 h-4 mr-2 text-rose-500" /> PDF
                      </Button>
                      <Link href={`/take/${selectedExam.id}`}>
                        <Button size="sm" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white">
                          <Eye className="w-4 h-4 mr-2" /> Preview
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <Tabs defaultValue="stats" className="w-full flex-1 flex flex-col">
                    <TabsList className="bg-slate-100/50 p-1 rounded-2xl w-full max-w-md mx-auto mb-8 grid grid-cols-3">
                      <TabsTrigger value="stats" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium tracking-wide">Statistics</TabsTrigger>
                      <TabsTrigger value="results" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium tracking-wide">Results</TabsTrigger>
                      <TabsTrigger value="details" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium tracking-wide">Questions</TabsTrigger>
                    </TabsList>

                    {/* Statistics Tab */}
                    <TabsContent value="stats" className="flex-1 outline-none">
                      {results.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20">
                          <BarChart3 className="w-12 h-12 opacity-50" />
                          <p>No submissions yet. Share your exam to start collecting data.</p>
                        </div>
                      ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          {/* Top Stat Cards */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatBento
                              icon={<Users className="w-5 h-5 text-blue-500" />}
                              label="Total Submissions"
                              value={results.length}
                              color="blue"
                            />
                            <StatBento
                              icon={<Target className="w-5 h-5 text-indigo-500" />}
                              label="Average Score"
                              value={`${Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)}%`}
                              color="indigo"
                            />
                            <StatBento
                              icon={<Trophy className="w-5 h-5 text-amber-500" />}
                              label="Highest Score"
                              value={`${Math.max(...results.map(r => r.percentage))}%`}
                              color="amber"
                            />
                            <StatBento
                              icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
                              label="Pass Rate"
                              value={`${Math.round((results.filter(r => r.percentage >= 50).length / results.length) * 100)}%`}
                              color="emerald"
                            />
                          </div>

                          <div className="grid lg:grid-cols-2 gap-6">
                            {/* Distribution Chart */}
                            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
                              <h4 className="font-semibold text-slate-800 mb-6">Score Distribution</h4>
                              <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={results.map((r, i) => ({ name: r.studentName, score: r.percentage }))}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                    <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            {/* Timeline Chart */}
                            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
                              <h4 className="font-semibold text-slate-800 mb-6">Results Over Time</h4>
                              <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={results.map((r, i) => ({ name: i + 1, percentage: r.percentage }))}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Line type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    {/* Results Tab (Restored correctly as HTML table) */}
                    <TabsContent value="results" className="flex-1 outline-none">
                      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                        {results.length === 0 ? (
                          <div className="p-12 text-center text-slate-500">No submissions yet.</div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                  <th className="px-6 py-4">Student Name</th>
                                  <th className="px-6 py-4 text-center">Score</th>
                                  <th className="px-6 py-4 text-center">Percentage</th>
                                  <th className="px-6 py-4 text-center">Status</th>
                                  <th className="px-6 py-4 text-right">Date</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {results.map(result => (
                                  <tr key={result.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{result.studentName}</td>
                                    <td className="px-6 py-4 text-center text-slate-600">
                                      <span className="font-semibold">{result.score}</span> / {result.totalQuestions}
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-900">
                                      {result.percentage}%
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${result.percentage >= 50
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : 'bg-rose-100 text-rose-700'
                                        }`}
                                      >
                                        {result.percentage >= 50 ? 'Passed' : 'Failed'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-500">
                                      {new Date(result.submittedAt).toLocaleDateString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Details/Questions Tab */}
                    <TabsContent value="details" className="flex-1 outline-none">
                      <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm overflow-hidden flex flex-col h-full">
                        <h4 className="font-semibold text-slate-800 mb-6 flex items-center justify-between">
                          Question Breakdown
                          <span className="text-sm font-normal text-slate-500">{selectedExam.questions.length} Total Questions</span>
                        </h4>
                        <div className="space-y-3 overflow-y-auto pr-2 scrollbar-hide max-h-[500px]">
                          {selectedExam.questions.map((q, idx) => (
                            <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-sm transition-all group">
                              <div className="flex gap-4">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                                  {idx + 1}
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-slate-900 leading-snug">{q.text}</p>
                                  <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                                    {q.type === 'true-false' ? 'True / False' : 'Multiple Choice'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="hidden lg:flex flex-col items-center justify-center h-full min-h-[600px] bg-white/40 backdrop-blur-md rounded-[32px] border border-dashed border-slate-300 text-slate-500 space-y-4">
                  <Target className="w-16 h-16 text-slate-300" />
                  <p className="text-lg">Select an exam from the list to view its dashboard.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBento({ label, value, icon, color }: { label: string; value: string | number, icon: React.ReactNode, color: 'blue' | 'indigo' | 'emerald' | 'amber' }) {
  const bgColors = {
    blue: 'bg-blue-50',
    indigo: 'bg-indigo-50',
    emerald: 'bg-emerald-50',
    amber: 'bg-amber-50',
  }
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm hover:-translate-y-1 transition-transform">
      <div className={`w-10 h-10 rounded-xl ${bgColors[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-sm font-medium text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}
