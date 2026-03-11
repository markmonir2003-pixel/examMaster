import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, BookOpen, Zap, BarChart3, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-8">
        <h1 className="text-2xl font-bold">ExamMaster</h1>
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-20 space-y-20">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-balance">
              Create and Manage Exams Effortlessly
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Build professional online exams with our Google Forms-like interface. Create, publish, and grade exams all in one place.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/create">
              <Button size="lg" className="gap-2">
                Create Exam <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Easy Exam Creation"
            description="Create exams with True/False and Multiple Choice questions. Add, edit, and delete questions with a single click."
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8" />}
            title="Multiple Export Formats"
            description="Export your exams as standalone HTML files or PDFs. Share with students directly without any setup needed."
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Instant Grading"
            description="Automatic grading system that evaluates student answers instantly and provides detailed feedback."
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Detailed Analytics"
            description="Track student performance with comprehensive statistics, score distributions, and pass rates."
          />
        </div>

        {/* How It Works */}
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-center">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <StepCard step={1} title="Create" description="Design your exam with custom questions" />
            <StepCard step={2} title="Publish" description="Export as HTML or PDF to share" />
            <StepCard step={3} title="Share" description="Students take the exam online or offline" />
            <StepCard step={4} title="Analyze" description="View results and statistics instantly" />
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-12 text-center space-y-4 bg-gradient-to-r from-primary/10 to-secondary">
          <h3 className="text-2xl font-bold">Ready to Create Your First Exam?</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get started in seconds. No credit card required.
          </p>
          <Link href="/create">
            <Button size="lg">Start Creating Now</Button>
          </Link>
        </Card>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 space-y-3 hover:border-primary/50 transition-colors">
      <div className="text-primary">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </Card>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3 text-center">
      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold mx-auto">
        {step}
      </div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
