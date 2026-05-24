import { useState } from 'react'
import { Dna, Zap, Download, Check, ArrowRight, BarChart3, Github, Linkedin, Mail, Search, FlaskConical, Atom, BookOpen, ChevronDown } from 'lucide-react'
import {
  generatePeptideSequence,
  fullAnalysis,
  generateResearchIdea,
  validateSequence,
  SAMPLE_PEPTIDE_DB,
} from './peptideService'
import {
  generateTextReport,
  generateCSVReport,
  generateJSONReport,
  generateFASTA,
  downloadFile,
  downloadAllReports,
} from './fileService'

/* ─── Helpers ────────────────────────────────────────────────── */
const ScoreBar = ({ label, value, color = '#00d9ff' }) => (
  <div className="mb-3">
    <div className="flex justify-between mb-1">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs font-bold" style={{ color }}>{value}%</span>
    </div>
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
      />
    </div>
  </div>
)

const Pill = ({ label }) => (
  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
    {label}
  </span>
)

const GlassCard = ({ children, className = '', style = {} }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:border-cyan-500/30 ${className}`}
    style={style}
  >
    {children}
  </div>
)

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

/* ─── Navbar ─────────────────────────────────────────────────── */
function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4"
      style={{ background: 'rgba(5,9,20,0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2">
        <Dna className="text-cyan-400" size={24} />
        <span className="font-bold text-lg tracking-tight">PeptideAI <span className="text-cyan-400">Lab</span></span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {['Features','Generator','Docking','Database','Pricing'].map(n => (
          <a key={n} href={`#${n.toLowerCase()}`} className="nav-link">{n}</a>
        ))}
      </div>
      <a href="#generator" className="btn-primary text-sm px-5 py-2 rounded-lg font-semibold hidden md:block">
        Start Free
      </a>
    </nav>
  )
}

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="features" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-10 animate-pulse-slow pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00d9ff, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 animate-pulse-slow pointer-events-none"
        style={{ background: 'radial-gradient(circle, #9d4edd, transparent 70%)', animationDelay: '2s' }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-grid-pattern" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-semibold"
          style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.25)', color: '#00d9ff' }}>
          <Atom size={14} /> AI-Powered Peptide Research Platform
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Discover Novel Peptides{' '}
          <span className="text-gradient-cyan">Using Artificial</span>{' '}
          <span className="text-gradient-cyan">Intelligence</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Generate antimicrobial, antifungal, anticancer, and therapeutic peptide research ideas
          with AI-powered sequence prediction and molecular docking analysis.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <a href="#generator" className="btn-primary flex items-center gap-2">
            <Zap size={18} /> Start Prediction
          </a>
          <a href="#generator"
            className="flex items-center gap-2 px-7 py-3 rounded-lg font-semibold border transition-all"
            style={{ borderColor: 'rgba(157,78,221,0.5)', color: '#c77dff' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(157,78,221,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Dna size={18} /> Generate Novel Sequence
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { label: 'Sequences Generated', value: '50K+' },
            { label: 'Active Researchers',  value: '2.3K' },
            { label: 'Prediction Accuracy', value: '94%'  },
            { label: 'Biotech Partners',    value: '150+' },
          ].map((s, i) => (
            <GlassCard key={i} className="py-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-2 text-gray-500 text-xs">
        <span>Scroll to explore</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  )
}

/* ─── AI Peptide Generator ───────────────────────────────────── */
function PeptideGenerator() {
  const [targetType, setTargetType] = useState('antimicrobial')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [downloadFormat, setDownloadFormat] = useState('txt')

  const handleGenerate = () => {
    setLoading(true)
    setTimeout(() => {
      const seq = generatePeptideSequence(targetType)
      setResult(fullAnalysis(seq))
      setLoading(false)
    }, 900)
  }

  const handleDownload = () => {
    if (!result) return
    const ts = Date.now()
    if (downloadFormat === 'txt')   downloadFile(generateTextReport(result), `PeptideAI_${ts}.txt`, 'text/plain')
    if (downloadFormat === 'csv')   downloadFile(generateCSVReport(result),  `PeptideAI_${ts}.csv`, 'text/csv')
    if (downloadFormat === 'json')  downloadFile(generateJSONReport(result),  `PeptideAI_${ts}.json`, 'application/json')
    if (downloadFormat === 'fasta') downloadFile(generateFASTA(result),       `PeptideAI_${ts}.fasta`, 'text/plain')
    if (downloadFormat === 'all')   downloadAllReports(result)
  }

  const types = ['antimicrobial','antifungal','anticancer','antiviral']

  return (
    <section id="generator" className="py-24 px-4 sm:px-6 lg:px-8"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">AI Peptide <span className="text-gradient-cyan">Sequence Generator</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Generate novel peptide sequences with AI-driven mutation suggestions, property predictions, and downloadable research reports.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left – Controls */}
          <GlassCard>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Dna className="text-cyan-400" size={22} /> Sequence Generator
            </h3>

            <label className="block text-xs font-semibold mb-3 text-cyan-300 uppercase tracking-wider">Target Type</label>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {types.map(t => (
                <button key={t} onClick={() => setTargetType(t)}
                  className="py-2 px-4 rounded-lg capitalize text-sm font-semibold transition-all"
                  style={{
                    background: targetType === t ? 'linear-gradient(135deg,#00d9ff,#0099ff)' : 'rgba(255,255,255,0.05)',
                    color:      targetType === t ? '#000' : '#aaa',
                    border:     targetType === t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow:  targetType === t ? '0 0 20px rgba(0,217,255,0.3)' : 'none',
                  }}>
                  {t}
                </button>
              ))}
            </div>

            <button onClick={handleGenerate} disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 mb-4 disabled:opacity-50">
              {loading ? <><Spinner /> Generating…</> : <><Zap size={17} /> Generate Sequence</>}
            </button>

            {/* Download panel */}
            {result && (
              <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">Download Report As</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[['txt','TXT'],['csv','CSV'],['json','JSON'],['fasta','FASTA'],['all','All Formats']].map(([v,l]) => (
                    <button key={v} onClick={() => setDownloadFormat(v)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: downloadFormat === v ? 'rgba(0,217,255,0.15)' : 'rgba(255,255,255,0.04)',
                        color:      downloadFormat === v ? '#00d9ff' : '#777',
                        border:     `1px solid ${downloadFormat === v ? 'rgba(0,217,255,0.5)' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
                <button onClick={handleDownload}
                  className="w-full py-2 flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-all"
                  style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.4)', color: '#00d9ff' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,217,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,217,255,0.1)'}>
                  <Download size={15} /> Download {downloadFormat.toUpperCase()} Report
                </button>
              </div>
            )}
          </GlassCard>

          {/* Right – Results */}
          {result ? (
            <GlassCard>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="text-purple-400" size={22} /> Predicted Properties
              </h3>
              {/* Sequence */}
              <div className="p-3 mb-5 rounded-lg" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,217,255,0.2)' }}>
                <p className="text-[10px] text-cyan-400 mb-1 uppercase tracking-wider font-semibold">Generated Sequence</p>
                <code className="text-sm font-mono text-cyan-300 break-all">{result.sequence}</code>
                <p className="text-[10px] text-gray-500 mt-1">{result.sequence.length} amino acids · {result.properties.molecularWeight} Da</p>
              </div>
              {/* Physicochemical */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { l:'Length',          v: result.properties.length + ' aa' },
                  { l:'Net Charge',      v: result.properties.netCharge },
                  { l:'Hydrophobicity',  v: result.properties.hydrophobicity + '%' },
                  { l:'pI',              v: result.properties.isoelectricPoint },
                ].map(({ l, v }) => (
                  <div key={l} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-[10px] text-gray-400">{l}</p>
                    <p className="font-bold text-white">{v}</p>
                  </div>
                ))}
              </div>
              {/* Activity bars */}
              <ScoreBar label="Antimicrobial" value={result.bioactivity.antimicrobial} color="#00d9ff" />
              <ScoreBar label="Antifungal"    value={result.bioactivity.antifungal}    color="#c77dff" />
              <ScoreBar label="Anticancer"    value={result.bioactivity.anticancer}    color="#f72585" />
              <ScoreBar label="Antiviral"     value={result.bioactivity.antiviral}     color="#43f890" />
              {/* Safety */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                {[
                  { l:'Toxicity',   v: result.toxicity,   c: result.toxicity > 50 ? '#f72585' : '#43f890' },
                  { l:'Stability',  v: result.stability,  c: '#00d9ff' },
                  { l:'Solubility', v: result.solubility, c: '#c77dff' },
                ].map(({ l, v, c }) => (
                  <div key={l} className="p-3 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-[10px] text-gray-400 mb-1">{l}</p>
                    <p className="font-bold text-lg" style={{ color: c }}>{v}%</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="flex flex-col items-center justify-center min-h-64">
              <Dna size={56} className="text-cyan-500/20 mb-4" />
              <p className="text-gray-500 text-sm">Select a target type and click Generate to see predictions here.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </section>
  )
}

/* ─── Molecular Docking ──────────────────────────────────────── */
function DockingSection() {
  const [seq, setSeq]             = useState('')
  const [target, setTarget]       = useState('SARS-CoV-2 Spike')
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)
  const [error, setError]         = useState('')

  const PROTEINS = ['SARS-CoV-2 Spike','HER2 Receptor','TNF-α Receptor','MMP-9','PD-L1','EGFR','ACE2']

  const handleDocking = () => {
    setError('')
    if (!seq.trim()) { setError('Please enter a peptide sequence.'); return }
    if (!validateSequence(seq.trim())) { setError('Invalid characters detected. Use standard one-letter amino acid codes.'); return }
    setLoading(true)
    setTimeout(() => {
      setResult(fullAnalysis(seq.trim(), target))
      setLoading(false)
    }, 1400)
  }

  const handleDownload = () => {
    if (!result) return
    downloadFile(generateTextReport(result), `Docking_Report_${Date.now()}.txt`, 'text/plain')
  }

  return (
    <section id="docking" className="py-24 px-4 sm:px-6 lg:px-8"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Molecular <span className="text-gradient-cyan">Docking Analysis</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Predict protein-peptide interaction scores, binding affinity, and hydrogen bond interactions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input */}
          <div className="lg:col-span-2">
            <GlassCard>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FlaskConical className="text-blue-400" size={22} /> Input Parameters
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold mb-2 text-blue-300 uppercase tracking-wider">Peptide Sequence</label>
                  <textarea
                    value={seq}
                    onChange={e => setSeq(e.target.value.toUpperCase())}
                    placeholder="Enter amino acid sequence (e.g. MKKVLLAVLAAGVASLNAA)"
                    rows={4}
                    className="input-bio resize-none"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">{seq.length} characters · ACDEFGHIKLMNPQRSTVWY only</p>
                  {error && <p className="text-xs text-red-400 mt-1">⚠ {error}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2 text-blue-300 uppercase tracking-wider">Target Protein / Receptor</label>
                  <select value={target} onChange={e => setTarget(e.target.value)} className="input-bio">
                    {PROTEINS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <button onClick={handleDocking} disabled={loading || !seq}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <><Spinner /> Running Docking…</> : '🔬 Run Docking Analysis'}
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Results */}
          <div>
            {result ? (
              <GlassCard style={{ height: '100%' }}>
                <h3 className="text-xl font-bold mb-5 text-green-300 flex items-center gap-2">
                  <BarChart3 size={20} /> Docking Results
                </h3>
                <div className="space-y-3">
                  {[
                    { l:'Docking Score',    v: result.docking.dockingScore + ' kcal/mol',   c:'#00d9ff', note:'Lower = Better' },
                    { l:'Binding Affinity', v: result.docking.bindingAffinity + ' nM',       c:'#43f890', note:'Kd Value' },
                    { l:'H-Bond Count',     v: result.docking.hydrogenBonds + ' interactions',c:'#c77dff', note:'' },
                    { l:'RMSD',            v: result.docking.rmsd + ' Å',                   c:'#ffd166', note:'' },
                    { l:'Confidence',       v: result.docking.confidence + '%',               c:'#00d9ff', note:'' },
                  ].map(({ l, v, c, note }) => (
                    <div key={l} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="text-[10px] text-gray-400">{l}{note && <span className="ml-1 text-gray-600">({note})</span>}</p>
                      <p className="font-bold text-lg" style={{ color: c }}>{v}</p>
                    </div>
                  ))}
                </div>
                <button onClick={handleDownload}
                  className="mt-5 w-full py-2 flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: 'rgba(67,248,144,0.1)', border: '1px solid rgba(67,248,144,0.4)', color: '#43f890' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(67,248,144,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(67,248,144,0.1)'}>
                  <Download size={15} /> Download Docking Report
                </button>
              </GlassCard>
            ) : (
              <GlassCard className="flex flex-col items-center justify-center min-h-80">
                <Atom size={56} className="text-blue-500/20 mb-4" />
                <p className="text-gray-500 text-sm text-center">Docking results will appear here after analysis.</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Research Idea Generator ────────────────────────────────── */
function ResearchIdeas() {
  const [idea, setIdea] = useState(null)
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="section-title mb-4">AI Research <span className="text-gradient-cyan">Idea Generator</span></h2>
        <p className="text-gray-400 mb-10">Generate novel research topics, thesis ideas, and drug-discovery concepts instantly.</p>
        <button onClick={() => setIdea(generateResearchIdea())}
          className="btn-primary px-10 py-3 flex items-center gap-2 mx-auto mb-10">
          <BookOpen size={17} /> Generate Research Idea
        </button>
        {idea && (
          <GlassCard className="text-left">
            <div className="flex flex-wrap gap-2 mb-4">
              {idea.keywords.map(k => <Pill key={k} label={k} />)}
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {idea.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-orange-300">{idea.title}</h3>
            <p className="text-gray-300 leading-relaxed">{idea.description}</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setIdea(generateResearchIdea())}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                Generate Another
              </button>
              <button onClick={() => downloadFile(`Research Idea: ${idea.title}\n\n${idea.description}\n\nKeywords: ${idea.keywords.join(', ')}\nDifficulty: ${idea.difficulty}`,
                `ResearchIdea_${Date.now()}.txt`, 'text/plain')}
                className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.3)', color: '#00d9ff' }}>
                <Download size={14} /> Save Idea
              </button>
            </div>
          </GlassCard>
        )}
      </div>
    </section>
  )
}

/* ─── Peptide Database ───────────────────────────────────────── */
function PeptideDatabase() {
  const [query, setQuery] = useState('')
  const [filterActivity, setFilterActivity] = useState('All')
  const activities = ['All', 'Antimicrobial', 'Antifungal', 'Anticancer', 'Antiviral']

  const filtered = SAMPLE_PEPTIDE_DB.filter(p => {
    const qMatch = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.sequence.toLowerCase().includes(query.toLowerCase())
    const aMatch = filterActivity === 'All' || p.activity === filterActivity
    return qMatch && aMatch
  })

  const handleExportDB = () => {
    const csv = ['Name,Sequence,Activity,Length,Charge,Hydrophobicity',
      ...filtered.map(p => `${p.name},${p.sequence},${p.activity},${p.length},${p.charge},${p.hydrophobicity}`)
    ].join('\n')
    downloadFile(csv, `PeptideDB_Export_${Date.now()}.csv`, 'text/csv')
  }

  return (
    <section id="database" className="py-24 px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">Peptide <span className="text-gradient-cyan">Database</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto">Browse, search, and export from our curated library of bioactive peptides.</p>
        </div>
        <GlassCard>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search by name or sequence…"
                className="input-bio pl-9" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {activities.map(a => (
                <button key={a} onClick={() => setFilterActivity(a)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: filterActivity === a ? 'rgba(0,217,255,0.15)' : 'rgba(255,255,255,0.04)',
                    color:      filterActivity === a ? '#00d9ff' : '#666',
                    border:     `1px solid ${filterActivity === a ? 'rgba(0,217,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  }}>{a}</button>
              ))}
            </div>
            <button onClick={handleExportDB}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
              style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.3)', color: '#00d9ff' }}>
              <Download size={13} /> Export CSV
            </button>
          </div>
          {/* Table */}
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            <table className="w-full text-sm">
              <thead style={{ background: 'rgba(255,255,255,0.04)' }}>
                <tr>
                  {['Name','Sequence','Activity','Length','Charge','Hydrophobicity'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((p, i) => (
                  <tr key={p.id}
                    style={{ background: i % 2 ? 'rgba(255,255,255,0.015)' : 'transparent', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="px-4 py-3 font-semibold text-white">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-cyan-300">{p.sequence.substring(0, 18)}{p.sequence.length > 18 ? '…' : ''}</td>
                    <td className="px-4 py-3"><Pill label={p.activity} /></td>
                    <td className="px-4 py-3 text-gray-300">{p.length} aa</td>
                    <td className="px-4 py-3 text-gray-300">{p.charge}</td>
                    <td className="px-4 py-3 text-gray-300">{p.hydrophobicity}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No peptides match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

/* ─── Workflow ───────────────────────────────────────────────── */
function Workflow() {
  const steps = [
    { icon: '📥', label: 'Input Sequence',        desc: 'Enter or generate a peptide' },
    { icon: '🧠', label: 'AI Analysis',            desc: 'Sequence composition analysis' },
    { icon: '📊', label: 'Property Prediction',    desc: 'Activity & safety scores' },
    { icon: '🔬', label: 'Molecular Docking',      desc: 'Protein interaction scoring' },
    { icon: '📄', label: 'Download Report',        desc: 'Export TXT, CSV, JSON, FASTA' },
  ]
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title mb-14">5-Step <span className="text-gradient-cyan">Workflow</span></h2>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center flex-1 relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 relative z-10"
                style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.2)' }}>
                {s.icon}
              </div>
              <p className="font-bold text-sm mb-1">{s.label}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-8 text-cyan-500/40">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Tech Stack ─────────────────────────────────────────────── */
function TechStack() {
  const techs = ['Python','PyTorch','BioPython','Scikit-learn','Transformers','AutoDock','RDKit','NumPy','FastAPI','React']
  return (
    <section className="py-16 px-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-10 text-gray-400">Powered By</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {techs.map(t => (
            <span key={t} className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#999' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Pricing ────────────────────────────────────────────────── */
function Pricing() {
  const plans = [
    {
      name: 'Free Research', price: '$0', period: '/forever',
      features: ['5 sequences/month','Basic activity prediction','Property analysis','Research idea generator','TXT report download'],
      cta: 'Get Started',
    },
    {
      name: 'Pro Scientist', price: '$49', period: '/month', highlight: true,
      features: ['Unlimited sequences','Full docking analysis','All download formats (CSV/JSON/FASTA)','Priority support','API access','Batch processing'],
      cta: 'Start Pro Trial',
    },
    {
      name: 'Enterprise', price: 'Custom', period: '',
      features: ['Custom ML models','White-label UI','Dedicated GPU cluster','HIPAA compliant','SLA agreement','Integration support'],
      cta: 'Contact Sales',
    },
  ]
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Flexible <span className="text-gradient-cyan">Pricing</span></h2>
          <p className="text-gray-400">Start free. Scale when you're ready.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <div key={i} className="rounded-2xl border transition-all duration-300 relative"
              style={{
                background: p.highlight ? 'rgba(0,217,255,0.05)' : 'rgba(255,255,255,0.02)',
                border:     p.highlight ? '1px solid rgba(0,217,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                boxShadow:  p.highlight ? '0 0 40px rgba(0,217,255,0.1)' : 'none',
              }}>
              {p.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-black"
                  style={{ background: 'linear-gradient(135deg,#00d9ff,#0099ff)' }}>
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                <h3 className="text-lg font-bold mb-2">{p.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold" style={{ color: p.highlight ? '#00d9ff' : '#fff' }}>{p.price}</span>
                  <span className="text-gray-500 mb-1">{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check size={15} className="text-green-400 mt-0.5 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2.5 rounded-lg font-semibold transition-all text-sm"
                  style={p.highlight ? {
                    background: 'linear-gradient(135deg,#00d9ff,#0099ff)', color: '#000',
                    boxShadow: '0 0 20px rgba(0,217,255,0.3)',
                  } : {
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa',
                  }}>
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.4)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Dna className="text-cyan-400" size={22} />
              <span className="font-bold text-lg">PeptideAI <span className="text-cyan-400">Lab</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">AI-Driven Peptide Discovery & Sequence Intelligence for researchers worldwide.</p>
          </div>
          {[
            { title:'Product',  links:['Features','Generator','Docking','Database','Pricing'] },
            { title:'Research', links:['Publications','Blog','Case Studies','Open Data'] },
            { title:'Company',  links:['About','Team','Careers','Contact'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold mb-4 text-sm">{title}</h4>
              <ul className="space-y-2">
                {links.map(l => (
                  <li key={l}><a href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs text-gray-600">© 2024 PeptideAI Lab. All rights reserved. MIT Licensed.</p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors"><Github size={18} /></a>
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors"><Linkedin size={18} /></a>
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors"><Mail size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── Root Component ─────────────────────────────────────────── */
export default function PeptideAILab() {
  return (
    <div style={{ background: '#050914', minHeight: '100vh', color: '#fff' }}>
      <Navbar />
      <Hero />
      <PeptideGenerator />
      <DockingSection />
      <ResearchIdeas />
      <PeptideDatabase />
      <Workflow />
      <TechStack />
      <Pricing />
      <Footer />
    </div>
  )
}
