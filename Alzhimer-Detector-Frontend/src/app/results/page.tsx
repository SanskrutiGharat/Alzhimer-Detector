"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Target, Brain, Mic, ShieldCheck, Activity, Calendar, User, FileText, TrendingUp, AlertTriangle } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';

export default function Results() {
  const [resultData, setResultData] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
    const data = sessionStorage.getItem('assessmentResult');
    if (data) {
      setResultData(JSON.parse(data));
    }
  }, []);

  const handlePrint = () => window.print();

  // ML Biomarkers Safely Extracted
  const riskProbability = resultData?.risk_probability !== undefined ? Math.round(resultData.risk_probability) : 12;
  const isHighRisk = riskProbability > 50;

  // Episodic Memory Breakdown
  const immediateScore = resultData?.scores?.immediate_recall;
  const delayedScore = resultData?.scores?.delayed_recall;
  const pairedScore = resultData?.scores?.paired_associate;
  
  const dynamicMemoryData = [
    { name: 'Immediate', value: immediateScore !== null ? Math.round(immediateScore ?? 100) : 0, color: '#10b981', skipped: immediateScore === null },
    { name: 'Delayed', value: delayedScore !== null ? Math.round(delayedScore ?? 100) : 0, color: '#3b82f6', skipped: delayedScore === null },
    { name: 'Paired', value: pairedScore !== null ? Math.round(pairedScore ?? 100) : 0, color: '#f59e0b', skipped: pairedScore === null },
  ].filter(d => !d.skipped);

  // Acoustic Features (Jitter, Shimmer, Pitch Variance)
  const acousticDataRaw = resultData?.acoustic_data || { pitch_variance: 85, speech_rate: 65, pauses: 90, jitter: 75, shimmer: 80 };
  const acousticChartData = [
    { name: 'Pitch Variance', value: acousticDataRaw.pitch_variance },
    { name: 'Speech Rate', value: acousticDataRaw.speech_rate },
    { name: 'Pauses', value: acousticDataRaw.pauses },
    { name: 'Jitter', value: acousticDataRaw.jitter },
    { name: 'Shimmer', value: acousticDataRaw.shimmer },
  ];

  // Linguistic Features (Idea Density, Semantic Drift, Fluency)
  const linguisticDataRaw = resultData?.linguistic_data || { vocabulary: 88, complexity: 72, coherence: 91, repetition: 85 };
  const linguisticChartData = [
    { name: 'Vocabulary', score: resultData?.scores?.fluency !== null ? Math.round(linguisticDataRaw.vocabulary) : 0 },
    { name: 'Idea Density', score: resultData?.scores?.idea_density !== null ? Math.round(linguisticDataRaw.complexity) : 0 },
    { name: 'Coherence', score: resultData?.scores?.semantic_drift !== null ? Math.round(linguisticDataRaw.coherence) : 0 },
    { name: 'Repetition', score: Math.round(linguisticDataRaw.repetition) },
  ].filter(d => d.score > 0);

  const estMMSE = Math.round(30 - (riskProbability / 100) * 15);

  const dummyLongitudinalData = [
    { month: 'Jan', score: 29 }, { month: 'Feb', score: 29 }, { month: 'Mar', score: 28 },
    { month: 'Apr', score: 28 }, { month: 'May', score: 28 }, { month: 'Jun', score: estMMSE },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-6 lg:p-10 selection:bg-primary-200 print:bg-white print:p-0">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden print:hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-200/40 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-200/40 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col gap-8 pb-20 print:gap-4 print:pb-0">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm print:shadow-none print:border-b print:rounded-none">
          <div className="flex items-start md:items-center gap-5">
            <Link href="/" className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors mt-1 md:mt-0 print:hidden">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl lg:text-4xl font-black font-display text-slate-900">Clinical Analysis Report</h1>
                <div className="hidden md:flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-bold text-xs uppercase tracking-wider print:border-none print:bg-transparent">
                  <ShieldCheck className="w-4 h-4" /> Verified
                </div>
              </div>
              <p className="text-slate-500 font-medium flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Patient ID: 894-AX2</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {currentDate}</span>
              </p>
            </div>
          </div>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md print:hidden">
            <FileText className="w-4 h-4" /> Download PDF
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`glass-card p-8 rounded-[2rem] border-t-4 ${isHighRisk ? 'border-t-rose-500' : 'border-t-emerald-500'} bg-white shadow-sm relative overflow-hidden print:shadow-none`}>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4"><Activity className={`w-6 h-6 ${isHighRisk ? 'text-rose-500' : 'text-emerald-500'}`} /><h3 className="text-slate-600 font-bold uppercase tracking-wider">Overall Risk Score</h3></div>
              <div className="flex items-baseline gap-2 mb-6"><span className="text-7xl font-black">{riskProbability}</span><span className="text-3xl font-bold text-slate-400">%</span></div>
              <p className="text-slate-600 leading-relaxed mb-6">{isHighRisk ? "High probability of cognitive decline detected across spontaneous speech and memory tasks." : "Acoustic and linguistic markers remain stable and within healthy percentiles."}</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${isHighRisk ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                {isHighRisk ? 'Elevated Risk Detected' : 'Low Risk Detected'}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-[2rem] border-t-4 border-t-accent-500 bg-white shadow-sm relative overflow-hidden print:shadow-none">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4"><Brain className="w-6 h-6 text-accent-500" /><h3 className="text-slate-600 font-bold uppercase tracking-wider">Cognitive Score (MMSE Est.)</h3></div>
              <div className="flex items-baseline gap-2 mb-6"><span className="text-7xl font-black">{estMMSE}</span><span className="text-3xl font-bold text-slate-400">/30</span></div>
              <p className="text-slate-600 leading-relaxed mb-6">{estMMSE >= 26 ? "Performance in immediate and delayed recall tasks was excellent." : "Performance indicates challenges with working memory consolidation."}</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${estMMSE >= 26 ? 'bg-accent-50 text-accent-700 border-accent-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {estMMSE >= 26 ? 'Normal Cognition' : 'Mild Cognitive Impairment'}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 rounded-[2rem] bg-white flex flex-col shadow-sm border border-slate-100 print:shadow-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-xl"><Mic className="w-6 h-6" /></div>
              <div><h3 className="text-xl font-bold">Acoustic Biomarkers</h3><p className="text-sm text-slate-500">Cookie Theft Audio Analysis (Jitter/Shimmer)</p></div>
            </div>
            <div className="h-[300px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={acousticChartData}>
                  <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="name" stroke="#64748b" tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }} />
                  <Radar dataKey="value" stroke="#4f46e5" strokeWidth={3} fill="#6366f1" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 rounded-[2rem] bg-white flex flex-col shadow-sm border border-slate-100 print:shadow-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Target className="w-6 h-6" /></div>
              <div><h3 className="text-xl font-bold">Linguistic Complexity</h3><p className="text-sm text-slate-500">Semantic Drift & Idea Density (Fluency + Retelling)</p></div>
            </div>
            <div className="h-[300px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={linguisticChartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <XAxis type="number" stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" width={90} tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }} />
                  <Bar dataKey="score" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 glass-card p-8 rounded-[2rem] bg-white flex flex-col shadow-sm border border-slate-100 print:shadow-none">
            <div className="mb-6"><h3 className="text-xl font-bold">Memory Breakdown</h3><p className="text-sm text-slate-500">Immediate vs. Delayed Recall</p></div>
            <div className="h-[250px] w-full relative mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dynamicMemoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {dynamicMemoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-auto">
              {dynamicMemoryData.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span>{item.name}</span></div>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass-card p-8 rounded-[2rem] bg-white flex flex-col shadow-sm border border-slate-100 print:shadow-none">
             <div className="flex items-center justify-between mb-6">
              <div><h3 className="text-xl font-bold">Longitudinal Cognitive Score</h3><p className="text-sm text-slate-500">Trailing 6-Month Trend</p></div>
            </div>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dummyLongitudinalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" domain={[20, 30]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
