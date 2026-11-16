import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  GraduationCap,
  ArrowRight,
  UploadCloud,
  Layers,
  FileText,
  Award,
  Sparkles,
  ChevronRight,
  Code2,
  Cpu,
  Brain,
  Database,
  Calculator,
  Compass,
  Wrench,
  Globe,
} from 'lucide-react';

const DEPARTMENTS = [
  'All Departments',
  'Computer Science',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Basic Sciences & Humanities',
];

const SEMESTERS = ['All Semesters', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

const SUBJECTS_DATA = [
  {
    code: 'CS501',
    name: 'Operating Systems',
    dept: 'Computer Science',
    semester: 5,
    icon: Cpu,
    resourcesCount: 42,
    description: 'Process management, concurrency, deadlocks, virtual memory, and file system architectures.',
    tags: ['Deadlocks', 'Process Scheduling', 'Virtual Memory', 'Banker Algorithm'],
    popular: true,
  },
  {
    code: 'CS502',
    name: 'Database Management Systems',
    dept: 'Computer Science',
    semester: 5,
    icon: Database,
    resourcesCount: 38,
    description: 'Relational algebra, SQL queries, normalization, transaction processing, and ACID properties.',
    tags: ['SQL', 'Normalization (BCNF)', 'Indexing', 'ACID Transactions'],
    popular: true,
  },
  {
    code: 'AI501',
    name: 'Machine Learning & Neural Networks',
    dept: 'Artificial Intelligence & Data Science',
    semester: 5,
    icon: Brain,
    resourcesCount: 35,
    description: 'Supervised/unsupervised algorithms, gradient descent, deep neural networks, and PyTorch.',
    tags: ['Deep Learning', 'Regression', 'CNN/RNN', 'Model Evaluation'],
    popular: true,
  },
  {
    code: 'CS503',
    name: 'Design & Analysis of Algorithms',
    dept: 'Computer Science',
    semester: 4,
    icon: Code2,
    resourcesCount: 48,
    description: 'Asymptotic notation, dynamic programming, greedy algorithms, graph traversals, and NP-completeness.',
    tags: ['Dynamic Programming', 'Graph Theory', 'Divide & Conquer', 'Dijkstra'],
    popular: true,
  },
  {
    code: 'CS504',
    name: 'Computer Networks',
    dept: 'Computer Science',
    semester: 6,
    icon: Globe,
    resourcesCount: 29,
    description: 'OSI 7 layers, TCP/IP protocol suite, subnetting, congestion control, and network security.',
    tags: ['TCP/IP', 'Subnetting', 'Routing Algorithms', 'DNS & HTTP'],
    popular: false,
  },
  {
    code: 'EC401',
    name: 'Digital Signal Processing',
    dept: 'Electronics & Communication',
    semester: 5,
    icon: Cpu,
    resourcesCount: 22,
    description: 'Discrete Fourier Transform (DFT), FFT algorithms, IIR/FIR filter designs, and Z-transforms.',
    tags: ['FFT', 'FIR Filters', 'Z-Transform', 'Sampling Theorem'],
    popular: false,
  },
  {
    code: 'BS101',
    name: 'Engineering Mathematics I & II',
    dept: 'Basic Sciences & Humanities',
    semester: 1,
    icon: Calculator,
    resourcesCount: 56,
    description: 'Differential calculus, linear algebra, eigenvalues, multiple integrals, and Fourier series.',
    tags: ['Eigenvalues', 'Vector Calculus', 'Matrices', 'Partial Derivatives'],
    popular: true,
  },
  {
    code: 'BS102',
    name: 'Engineering Physics & Quantum Mechanics',
    dept: 'Basic Sciences & Humanities',
    semester: 1,
    icon: Compass,
    resourcesCount: 31,
    description: 'Wave mechanics, lasers, fiber optics, semiconductors, and quantum tunneling phenomena.',
    tags: ['Schrodinger Equation', 'Semiconductors', 'Fiber Optics', 'Lasers'],
    popular: false,
  },
  {
    code: 'ME301',
    name: 'Thermodynamics & Fluid Mechanics',
    dept: 'Mechanical Engineering',
    semester: 3,
    icon: Wrench,
    resourcesCount: 19,
    description: 'Laws of thermodynamics, Carnot cycle, Bernoulli principle, entropy, and heat exchangers.',
    tags: ['Carnot Cycle', 'Entropy', 'Fluid Dynamics', 'Heat Transfer'],
    popular: false,
  },
  {
    code: 'IT601',
    name: 'Cloud Computing & Distributed Systems',
    dept: 'Information Technology',
    semester: 6,
    icon: Layers,
    resourcesCount: 33,
    description: 'AWS/GCP architectures, Docker containers, Kubernetes orchestration, and serverless compute.',
    tags: ['Docker', 'Microservices', 'Kubernetes', 'Cloud Security'],
    popular: true,
  },
  {
    code: 'CS402',
    name: 'Object Oriented Programming with Java',
    dept: 'Computer Science',
    semester: 3,
    icon: Code2,
    resourcesCount: 45,
    description: 'Inheritance, polymorphism, multithreading, collections framework, and JVM internals.',
    tags: ['Multithreading', 'Collections', 'Design Patterns', 'Generics'],
    popular: false,
  },
  {
    code: 'CS701',
    name: 'Compiler Design',
    dept: 'Computer Science',
    semester: 7,
    icon: Layers,
    resourcesCount: 26,
    description: 'Lexical analysis, LR/LL parsers, intermediate code generation, and runtime memory layout.',
    tags: ['Lex & Yacc', 'LL/LR Parsing', 'Syntax Directed Translation', 'Optimization'],
    popular: false,
  },
];

export default function Subjects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedSem, setSelectedSem] = useState('All Semesters');

  const filteredSubjects = SUBJECTS_DATA.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept =
      selectedDept === 'All Departments' ||
      sub.dept.toLowerCase().includes(selectedDept.toLowerCase().replace(' engineering', ''));

    const matchesSem =
      selectedSem === 'All Semesters' || sub.semester === parseInt(selectedSem.replace('Sem ', ''));

    return matchesSearch && matchesDept && matchesSem;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-700 to-violet-800 p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-100">
              <GraduationCap className="w-4 h-4 text-cyan-300" />
              <span>Curriculum & Subject Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Explore Academic Subjects & Modules
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Find syllabus-aligned notes, lab records, handwritten summaries, and previous exam question papers organized by semester and department.
            </p>
          </div>

          {/* Decorative glowing circles */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search subject by name (e.g., Operating Systems), code (CS501), or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-card text-slate-800 dark:text-dark-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              />
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-card text-slate-700 dark:text-dark-text text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-card text-slate-700 dark:text-dark-text text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick tags pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Popular Topics:
            </span>
            {['Deadlocks', 'Dynamic Programming', 'SQL & Normalization', 'TCP/IP', 'Neural Networks', 'Fourier Series'].map((topic) => (
              <button
                key={topic}
                onClick={() => setSearchQuery(topic)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-dark-card hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
              >
                {topic}
              </button>
            ))}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-rose-500 hover:underline font-semibold ml-auto shrink-0"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <div
                key={subject.code}
                className="group relative bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Code & Semester */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                      {subject.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Semester {subject.semester}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                        {subject.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                        {subject.dept}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-2">
                    {subject.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {subject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark-card text-[11px] font-medium text-slate-600 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-dark-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span>{subject.resourcesCount} resources</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/upload?subject=${encodeURIComponent(subject.name)}`}
                      title="Upload notes for this subject"
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                    >
                      <UploadCloud className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/resources?subject=${encodeURIComponent(subject.name)}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm hover:gap-1.5"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No subjects found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              We couldn't find any subjects matching "{searchQuery}". Try searching for another topic or clear filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('All Departments');
                setSelectedSem('All Semesters');
              }}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
