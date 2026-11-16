import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  UploadCloud,
  FileText,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  GraduationCap,
  ArrowRight,
  Send,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Lightbulb,
  ExternalLink,
  Shuffle,
  ThumbsUp,
  Bookmark,
} from 'lucide-react';
import api from '../services/api';

export default function AiStudyAssistant() {
  const [searchParams] = useSearchParams();
  const resourceIdParam = searchParams.get('resourceId');

  const [activeTab, setActiveTab] = useState('chat'); // 'summary' | 'topics' | 'revision' | 'chat' | 'flashcards' | 'quiz'
  const [loading, setLoading] = useState(false);
  const [analyzedData, setAnalyzedData] = useState(null);
  const [error, setError] = useState('');

  // Document state
  const [selectedPreset, setSelectedPreset] = useState('os-deadlock');
  const [customFile, setCustomFile] = useState(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [askingQuestion, setAskingQuestion] = useState(false);
  const chatEndRef = useRef(null);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState(new Set());

  // Quiz state
  const [selectedOptions, setSelectedOptions] = useState({}); // { [mcqId]: optionIndex }
  const [revealedAnswers, setRevealedAnswers] = useState({}); // { [descId]: true }

  useEffect(() => {
    // If resourceId query param is present, load that resource; otherwise load default OS Unit 3
    if (resourceIdParam) {
      loadAnalysis({ resourceId: resourceIdParam });
    } else {
      loadAnalysis({ sampleType: 'os-deadlock' });
    }
  }, [resourceIdParam]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadAnalysis = async (payload) => {
    try {
      setLoading(true);
      setError('');
      let res;

      if (payload.file) {
        const formData = new FormData();
        formData.append('file', payload.file);
        res = await api.post('/ai/analyze-pdf', formData);
      } else {
        res = await api.post('/ai/analyze-pdf', payload);
      }

      setAnalyzedData(res.data);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setMasteredCards(new Set());
      setSelectedOptions({});

      // Initialize chat with welcome greeting
      setChatMessages([
        {
          sender: 'ai',
          text: `Hello! I have thoroughly analyzed your notes on **"${res.data.docTitle}"** (${res.data.numPages} pages).\n\nYou can ask me any question about the concepts, definitions, formulas, or examples in your notes, and I will cite the exact page numbers!`,
          citedPages: [1],
        },
      ]);
    } catch (err) {
      console.error('Error analyzing document:', err);
      setError(err.response?.data?.message || 'Failed to analyze PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomFile(file);
      setSelectedPreset('');
      loadAnalysis({ file });
    }
  };

  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId);
    setCustomFile(null);
    loadAnalysis({ sampleType: presetId });
  };

  const handleSendQuestion = async (questionText) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || askingQuestion) return;

    // Add student message immediately
    const newChat = [...chatMessages, { sender: 'student', text: q }];
    setChatMessages(newChat);
    setInputQuestion('');
    setAskingQuestion(true);

    try {
      const res = await api.post('/ai/ask-pdf', {
        docId: analyzedData?.docId,
        question: q,
        resourceId: resourceIdParam,
        chatHistory: newChat.slice(-6),
      });

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.data.answer,
          citedPages: res.data.citedPages,
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry, I encountered an issue retrieving the answer from your notes. Please try asking again.',
          citedPages: [],
        },
      ]);
    } finally {
      setAskingQuestion(false);
    }
  };

  // Flashcards helpers
  const flashcards = analyzedData?.flashcards || [];
  const currentCard = flashcards[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const toggleMastered = (cardId) => {
    setMasteredCards((prev) => {
      const updated = new Set(prev);
      if (updated.has(cardId)) {
        updated.delete(cardId);
      } else {
        updated.add(cardId);
      }
      return updated;
    });
  };

  // Preset example prompt chips
  const quickQuestions = [
    'What is deadlock? Explain with an example from my notes.',
    'What are the 4 necessary conditions for deadlock?',
    "Explain Dijkstra's Banker's algorithm and safety state.",
    'What is the formula to calculate the Need matrix?',
    'How is circular wait prevented in an operating system?',
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 mb-3 border border-white/10">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI PDF Intelligence & Study Suite</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                AI Study Assistant & PDF Q&A
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Upload your lecture notes or select university study materials to generate revision summaries, interactive flashcards, practice quizzes, and ask questions with exact page references.
              </p>
            </div>

            {/* Document Selector Pills */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <label className="cursor-pointer px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105">
                <UploadCloud className="w-4 h-4" />
                <span>Upload Custom PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => handlePresetChange('os-deadlock')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                  selectedPreset === 'os-deadlock'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>OS Unit 3 Notes (Demo)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Current Active Document Banner */}
        {analyzedData && (
          <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200/90 dark:border-dark-border shadow-xs p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-white text-sm truncate">
                    {analyzedData.docTitle}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    {analyzedData.numPages} Pages Extracted
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  AI parsing complete • Ready for Q&A, Flashcards, and Quiz practice
                </p>
              </div>
            </div>

            {analyzedData.fileUrl && (
              <a
                href={analyzedData.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
              >
                <span>View Raw PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Feature Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-200 dark:border-dark-border">
          {[
            { id: 'chat', label: '💬 Ask Questions (Chat with PDF)', badge: 'Page Citations' },
            { id: 'summary', label: '📝 Executive Summary' },
            { id: 'topics', label: '📌 Important Topics' },
            { id: 'revision', label: '📖 Quick Revision Notes' },
            { id: 'flashcards', label: '🗂️ Interactive Flashcards' },
            { id: 'quiz', label: '🎯 Practice Questions & MCQs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-card bg-white dark:bg-dark-surface border border-slate-200/80 dark:border-dark-border'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-16 text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Extracting & Analyzing PDF Material...
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Extracting page text, synthesizing revision notes, generating flashcards, and indexing page-by-page vectors.
            </p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-600 text-sm">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="font-bold">{error}</p>
          </div>
        ) : !analyzedData ? null : (
          <div>
            {/* TAB 1: ASK QUESTIONS (CHAT WITH PDF) */}
            {activeTab === 'chat' && (
              <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-sm overflow-hidden flex flex-col h-[750px]">
                {/* Chat Header */}
                <div className="px-6 py-4 bg-slate-50/80 dark:bg-dark-card border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                        Chat with {analyzedData.docTitle}
                      </h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Ask any doubt. The assistant answers using your notes and cites the exact page.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    ● Connected & Grounded
                  </span>
                </div>

                {/* Quick Prompts Bar */}
                <div className="px-6 py-2.5 bg-indigo-50/40 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-dark-border flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
                  <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Try asking:
                  </span>
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuestion(q)}
                      className="px-3 py-1 bg-white dark:bg-dark-card hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 border border-indigo-200 dark:border-indigo-800/80 rounded-lg text-xs font-medium whitespace-nowrap shadow-2xs transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-dark-bg/40">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                          msg.sender === 'student'
                            ? 'bg-indigo-600 text-white shadow-sm rounded-br-none'
                            : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-800 dark:text-dark-text shadow-xs rounded-bl-none'
                        }`}
                      >
                        {msg.sender === 'ai' ? (
                          <div>
                            {/* Page citations badges */}
                            {msg.citedPages && msg.citedPages.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 mb-2 pb-2 border-b border-slate-100 dark:border-dark-border text-[11px]">
                                <span className="font-bold text-slate-400 dark:text-slate-500">Referenced in Notes:</span>
                                {msg.citedPages.map((pg) => (
                                  <span
                                    key={pg}
                                    className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-800"
                                  >
                                    Page {pg}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="whitespace-pre-line prose prose-sm max-w-none text-slate-800 dark:text-dark-text">
                              {msg.text}
                            </div>
                          </div>
                        ) : (
                          <p className="font-medium">{msg.text}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {askingQuestion && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-4 shadow-xs flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span>Searching lecture pages and formulating grounded answer...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendQuestion();
                  }}
                  className="p-4 bg-white dark:bg-dark-surface border-t border-slate-200 dark:border-dark-border flex gap-2"
                >
                  <input
                    type="text"
                    value={inputQuestion}
                    onChange={(e) => setInputQuestion(e.target.value)}
                    placeholder="e.g. What is deadlock? Explain with an example from my notes."
                    className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-dark-text"
                  />
                  <button
                    type="submit"
                    disabled={askingQuestion || !inputQuestion.trim()}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Ask AI</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: EXECUTIVE SUMMARY */}
            {activeTab === 'summary' && analyzedData.summary && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Document Overview</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-6">
                    {analyzedData.summary.overview}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-dark-border">
                    <div className="p-4 bg-slate-50 dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border">
                      <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Difficulty Level</span>
                      <span className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        {analyzedData.summary.difficultyLevel}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border">
                      <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Est. Revision Time</span>
                      <span className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        {analyzedData.summary.estimatedRevisionTime}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border">
                      <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Target Audience</span>
                      <span className="font-bold text-slate-800 dark:text-white text-sm truncate block">
                        {analyzedData.summary.targetAudience}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Takeaways */}
                <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Core Conceptual Takeaways
                  </h3>
                  <div className="space-y-3">
                    {analyzedData.summary.keyTakeaways?.map((point, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50/70 dark:bg-dark-card border border-slate-100 dark:border-dark-border rounded-2xl flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: IMPORTANT TOPICS */}
            {activeTab === 'topics' && (
              <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Extracted High-Yield Topics</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Core syllabus topics ranked by university examination probability
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analyzedData.importantTopics?.map((topic, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-slate-50/60 dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              topic.importance === 'High'
                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            {topic.importance} Importance
                          </span>
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                            {topic.pageRef}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2">{topic.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{topic.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('chat');
                          handleSendQuestion(`Explain ${topic.title} with details and examples from my notes.`);
                        }}
                        className="mt-4 pt-3 border-t border-slate-200/60 dark:border-dark-border text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center justify-between"
                      >
                        <span>Ask AI about this topic</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: REVISION NOTES */}
            {activeTab === 'revision' && analyzedData.revisionNotes && (
              <div className="space-y-6">
                {/* Core Formulas & Definitions */}
                <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Core Definitions & Essential Formulas
                  </h3>
                  <div className="space-y-3">
                    {analyzedData.revisionNotes.coreFormulasAndDefinitions?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Differences */}
                <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Important Distinctions & Trade-Offs
                  </h3>
                  <div className="space-y-3">
                    {analyzedData.revisionNotes.keyDifferences?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 rounded-2xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exam Tips */}
                <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    University Exam Scoring Strategies
                  </h3>
                  <div className="space-y-3">
                    {analyzedData.revisionNotes.examTips?.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 rounded-2xl text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-2.5"
                      >
                        <span className="text-base leading-none">💡</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: INTERACTIVE FLASHCARDS */}
            {activeTab === 'flashcards' && flashcards.length > 0 && (
              <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-10 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">Study Flashcards</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Card {currentCardIndex + 1} of {flashcards.length} • {masteredCards.size} Mastered
                    </p>
                  </div>
                  <div className="w-32 bg-slate-100 dark:bg-dark-card h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full transition-all"
                      style={{
                        width: `${((currentCardIndex + 1) / flashcards.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* 3D Flip Card */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="min-h-[280px] bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-indigo-950/30 dark:via-dark-card dark:to-purple-950/20 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800/80 p-8 cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl transition-all select-none relative group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-full font-bold bg-white dark:bg-dark-surface text-indigo-700 dark:text-indigo-300 shadow-2xs border border-indigo-100 dark:border-indigo-900">
                      {currentCard?.topic || 'Concept'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                      {isFlipped ? 'Answer View' : 'Question View (Click to Flip)'}
                    </span>
                  </div>

                  <div className="py-6 text-center">
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2">
                      {isFlipped ? 'EXPLANATION' : 'QUESTION'}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug whitespace-pre-line">
                      {isFlipped ? currentCard?.answer : currentCard?.question}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-indigo-100/60 dark:border-indigo-900/60">
                    <span>Difficulty: {currentCard?.difficulty}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline">
                      {isFlipped ? 'Click to view question' : 'Click to reveal answer ↺'}
                    </span>
                  </div>
                </div>

                {/* Card Controls */}
                <div className="flex items-center justify-between gap-3 mt-6">
                  <button
                    onClick={handlePrevCard}
                    className="p-3 bg-slate-100 dark:bg-dark-card hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => toggleMastered(currentCard?.id)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      masteredCards.has(currentCard?.id)
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {masteredCards.has(currentCard?.id) ? 'Mastered!' : 'Mark as Mastered'}
                    </span>
                  </button>

                  <button
                    onClick={handleNextCard}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-white transition-colors shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 6: PRACTICE QUESTIONS & MCQS */}
            {activeTab === 'quiz' && analyzedData.practiceQuestions && (
              <div className="space-y-8">
                {/* Multiple Choice Section */}
                <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Multiple Choice Questions (MCQs)</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Test your conceptual retention with instant verification</p>
                  </div>

                  <div className="space-y-6">
                    {analyzedData.practiceQuestions.mcqs?.map((mcq, idx) => {
                      const selected = selectedOptions[mcq.id];
                      const isAnswered = selected !== undefined;
                      const isCorrect = selected === mcq.correctAnswer;

                      return (
                        <div
                          key={mcq.id}
                          className="p-6 bg-slate-50/70 dark:bg-dark-card rounded-2xl border border-slate-200/80 dark:border-dark-border"
                        >
                          <div className="flex items-center justify-between mb-3 text-xs">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded">
                              Question {idx + 1}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 font-semibold">{mcq.pageRef}</span>
                          </div>

                          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">
                            {mcq.question}
                          </h4>

                          {/* Options */}
                          <div className="space-y-2 mb-4">
                            {mcq.options.map((opt, oIdx) => {
                              let optionClass =
                                'bg-white dark:bg-dark-surface border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:border-indigo-400';

                              if (isAnswered) {
                                if (oIdx === mcq.correctAnswer) {
                                  optionClass = 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold';
                                } else if (selected === oIdx) {
                                  optionClass = 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-300';
                                } else {
                                  optionClass = 'bg-white dark:bg-dark-surface opacity-50 border-slate-200 dark:border-dark-border text-slate-500';
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() =>
                                    setSelectedOptions({ ...selectedOptions, [mcq.id]: oIdx })
                                  }
                                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionClass}`}
                                >
                                  <span>{opt}</span>
                                  {isAnswered && oIdx === mcq.correctAnswer && (
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation */}
                          {isAnswered && (
                            <div
                              className={`p-4 rounded-xl text-xs leading-relaxed ${
                                isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                              }`}
                            >
                              <span className="font-bold block mb-1">
                                {isCorrect ? '✅ Correct Answer!' : '❌ Incorrect.'}
                              </span>
                              {mcq.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Descriptive Exam Questions */}
                <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">University Exam Questions</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Long-form university questions with model answers and scoring breakdown</p>
                  </div>

                  <div className="space-y-4">
                    {analyzedData.practiceQuestions.descriptive?.map((desc, idx) => {
                      const isRevealed = revealedAnswers[desc.id];
                      return (
                        <div
                          key={desc.id}
                          className="p-6 bg-slate-50/70 dark:bg-dark-card rounded-2xl border border-slate-200/80 dark:border-dark-border"
                        >
                          <div className="flex items-center justify-between mb-2 text-xs">
                            <span className="font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded">
                              {desc.marks} Marks • {desc.pageRef}
                            </span>
                            <button
                              onClick={() =>
                                setRevealedAnswers({
                                  ...revealedAnswers,
                                  [desc.id]: !isRevealed,
                                })
                              }
                              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                            >
                              {isRevealed ? 'Hide Model Answer' : 'Show Model Answer & Scheme'}
                            </button>
                          </div>

                          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
                            {desc.question}
                          </h4>

                          {isRevealed && (
                            <div className="mt-4 p-4 bg-white dark:bg-dark-surface rounded-xl border border-slate-200 dark:border-dark-border text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line animate-in fade-in duration-200">
                              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-2">
                                Model Answer & Structure:
                              </span>
                              {desc.sampleAnswer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
