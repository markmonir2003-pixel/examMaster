'use client';

import { useState, useEffect } from 'react';
import { Exam, ExamResult } from '@/lib/types';
import { storage } from '@/lib/storage';
import { downloadHTML, downloadPDF } from '@/lib/export';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Edit, Trash2, Plus, Download, Eye, BarChart3 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Exam Dashboard</h1>
              <p className="text-muted-foreground">Create, manage, and track your exams</p>
            </div>
            <Link href="/create">
              <Button size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Exam
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        {exams.length === 0 ? (
          <Card className="p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">No exams yet</h2>
            <p className="text-muted-foreground mb-6">Create your first exam to get started</p>
            <Link href="/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Exam
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Exams List */}
            <div className="lg:col-span-1 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-3">Your Exams</h2>
                <Input
                  placeholder="Search exams..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="mb-4"
                />
              </div>

              <div className="space-y-2">
                {filteredExams.map(exam => (
                  <Card
                    key={exam.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedExam?.id === exam.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedExam(exam)}
                  >
                    <h3 className="font-semibold text-sm truncate">{exam.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {exam.questions.length} questions
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
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
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive"
                            title="Delete exam"
                            onClick={e => e.stopPropagation()}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Delete Exam</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{exam.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                          <div className="flex gap-3 justify-end">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteExam(exam.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Details Panel */}
            {selectedExam && (
              <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                  </TabsList>

                  {/* Details Tab */}
                  <TabsContent value="details" className="space-y-4">
                    <Card className="p-6 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{selectedExam.title}</h3>
                        {selectedExam.description && (
                          <p className="text-muted-foreground">{selectedExam.description}</p>
                        )}
                      </div>

                      <div className="bg-secondary/50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Questions</p>
                            <p className="text-2xl font-bold">{selectedExam.questions.length}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Submissions</p>
                            <p className="text-2xl font-bold">{results.length}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Export Options</h4>
                        <div className="flex gap-2 flex-col">
                          <Button
                            onClick={() => downloadHTML(selectedExam)}
                            variant="outline"
                            className="w-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download as HTML
                          </Button>
                          <Button
                            onClick={() => downloadPDF(selectedExam)}
                            variant="outline"
                            className="w-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download as PDF
                          </Button>
                          <Link href={`/take/${selectedExam.id}`} className="w-full">
                            <Button className="w-full">
                              <Eye className="w-4 h-4 mr-2" />
                              Take Exam Preview
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Questions</h4>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {selectedExam.questions.map((q, idx) => (
                            <div key={q.id} className="p-3 bg-secondary/50 rounded-lg text-sm">
                              <p className="font-medium">Q{idx + 1}: {q.text}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {q.type === 'true-false' ? 'True/False' : 'Multiple Choice'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Results Tab */}
                  <TabsContent value="results" className="space-y-4">
                    <Card className="p-6">
                      {results.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No results yet. Students haven't submitted this exam.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="border-b">
                              <tr>
                                <th className="text-left p-2">Student Name</th>
                                <th className="text-center p-2">Score</th>
                                <th className="text-center p-2">Percentage</th>
                                <th className="text-center p-2">Status</th>
                                <th className="text-right p-2">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results.map(result => (
                                <tr key={result.id} className="border-b hover:bg-secondary/50">
                                  <td className="p-2">{result.studentName}</td>
                                  <td className="text-center p-2">
                                    {result.score}/{result.totalQuestions}
                                  </td>
                                  <td className="text-center p-2 font-semibold">
                                    {result.percentage}%
                                  </td>
                                  <td className="text-center p-2">
                                    <span
                                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                        result.percentage >= 50
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      }`}
                                    >
                                      {result.percentage >= 50 ? 'Passed' : 'Failed'}
                                    </span>
                                  </td>
                                  <td className="text-right p-2 text-xs text-muted-foreground">
                                    {new Date(result.submittedAt).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card>
                  </TabsContent>

                  {/* Statistics Tab */}
                  <TabsContent value="stats" className="space-y-4">
                    {results.length === 0 ? (
                      <Card className="p-6 text-center text-muted-foreground">
                        No data available for statistics
                      </Card>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <StatCard
                            label="Total Submissions"
                            value={results.length}
                          />
                          <StatCard
                            label="Average Score"
                            value={`${Math.round(
                              results.reduce((sum, r) => sum + r.percentage, 0) / results.length
                            )}%`}
                          />
                          <StatCard
                            label="Highest Score"
                            value={`${Math.max(...results.map(r => r.percentage))}%`}
                          />
                          <StatCard
                            label="Pass Rate"
                            value={`${Math.round(
                              (results.filter(r => r.percentage >= 50).length / results.length) * 100
                            )}%`}
                          />
                        </div>

                        <Card className="p-6">
                          <h4 className="font-semibold mb-4">Score Distribution</h4>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={results.map((r, i) => ({
                              name: `${r.studentName}`,
                              score: r.percentage,
                            }))}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                fontSize={12}
                              />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="score" fill="#3b82f6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Card>

                        <Card className="p-6">
                          <h4 className="font-semibold mb-4">Results Over Time</h4>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={results.map((r, i) => ({
                              name: i + 1,
                              percentage: r.percentage,
                            }))}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="percentage"
                                stroke="#3b82f6"
                                name="Score %"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </Card>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-4 text-center">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  );
}
