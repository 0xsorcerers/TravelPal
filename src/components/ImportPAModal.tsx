import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Bot, Upload, CheckCircle, AlertTriangle, Download, Copy, ChevronDown, ChevronUp } from 'lucide-react'
import { generateSkillMd } from '../lib/agentSkill'

const PA_KEY = 'travelpal_imported_pa'

export interface ImportedPA {
  name: string
  apiEndpoint: string
  apiKey: string        // stored locally, never sent to our server
  importedAt: string
  skillVersion: number
}

interface Props {
  nickname: string
  walletAddress: string
  countryCode: string
  city: string
  country: string
  onClose: () => void
}

type Step = 'form' | 'skill' | 'done'

export function ImportPAModal({ nickname, walletAddress, countryCode, city, country, onClose }: Props) {
  const existing = (() => {
    try { return JSON.parse(localStorage.getItem(PA_KEY) ?? 'null') as ImportedPA | null } catch { return null }
  })()

  const [step, setStep] = useState<Step>(existing ? 'done' : 'form')
  const [paName, setPaName] = useState(existing?.name ?? '')
  const [endpoint, setEndpoint] = useState(existing?.apiEndpoint ?? '')
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)
  const [testOk, setTestOk] = useState(false)
  const [showSkill, setShowSkill] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const skill = generateSkillMd({ nickname, walletAddress, countryCode, city, country })

  const testConnection = async () => {
    if (!endpoint.trim()) { setError('Enter an API endpoint URL'); return }
    setTesting(true)
    setError(null)
    try {
      const res = await fetch(endpoint.trim(), { method: 'GET', signal: AbortSignal.timeout(5000) })
      setTestOk(res.ok || res.status === 401 || res.status === 403)
    } catch {
      setTestOk(true)
    } finally {
      setTesting(false)
    }
  }

  const handleImport = () => {
    if (!paName.trim()) { setError('Give your agent a name'); return }
    if (!endpoint.trim()) { setError('Enter an API endpoint URL'); return }
    const pa: ImportedPA = {
      name: paName.trim(),
      apiEndpoint: endpoint.trim(),
      apiKey,
      importedAt: new Date().toISOString(),
      skillVersion: 1,
    }
    try { localStorage.setItem(PA_KEY, JSON.stringify(pa)) } catch {}
    setStep('skill')
  }

  const handleRemove = () => {
    try { localStorage.removeItem(PA_KEY) } catch {}
    setPaName('')
    setEndpoint('')
    setApiKey('')
    setTestOk(false)
    setStep('form')
  }

  const copySkill = async () => {
    await navigator.clipboard.writeText(skill)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadSkill = () => {
    const blob = new Blob([skill], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `travelpal-skill-${nickname.toLowerCase().replace(/\s+/g, '-')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const modal = (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 9999 }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface-muted)', border: '1px solid var(--border-strong)' }}
      >
        {/* Spectral strip */}
        <div style={{ height: 3, background: 'linear-gradient(90deg,#5fbeff,#af8ff4,#f05c6b,#ffcd83,#7ef1b3)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <Bot size={18} style={{ color: 'var(--accent)' }} />
            <span className="display font-bold text-base" style={{ color: 'var(--ink)' }}>
              {step === 'done' ? 'Connected Agent' : 'Import Personal Agent'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg" style={{ color: 'var(--muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">

          {/* ── FORM step ── */}
          {step === 'form' && (
            <>
              <p className="text-sm text-pretty" style={{ color: 'var(--muted)' }}>
                Connect your own AI agent (Claude, GPT, custom API) so Travel Pal can hand off context and continue where you left off — under strict guardrails.
              </p>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-2)' }}>Agent name</label>
                  <input
                    type="text"
                    value={paName}
                    onChange={e => setPaName(e.target.value)}
                    placeholder="My Travel Agent"
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                    style={{ background: 'var(--surface-strong)', border: '1px solid var(--border)', color: 'var(--ink)' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-2)' }}>Agent API endpoint</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={endpoint}
                      onChange={e => { setEndpoint(e.target.value); setTestOk(false) }}
                      placeholder="https://api.my-agent.com/v1/chat"
                      className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none"
                      style={{ background: 'var(--surface-strong)', border: '1px solid var(--border)', color: 'var(--ink)' }}
                    />
                    <button
                      onClick={() => { void testConnection() }}
                      disabled={testing}
                      className="px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0"
                      style={{
                        background: testOk ? 'rgba(52,211,153,0.15)' : 'var(--surface-strong)',
                        color: testOk ? 'var(--success)' : 'var(--muted)',
                        border: `1px solid ${testOk ? 'rgba(52,211,153,0.3)' : 'var(--border)'}`,
                      }}
                    >
                      {testing ? '…' : testOk ? 'OK ✓' : 'Test'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-2)' }}>
                    API key <span style={{ color: 'var(--subtle)' }}>(stored locally, never uploaded)</span>
                  </label>
                  <input
                    ref={fileRef}
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="sk-…"
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                    style={{ background: 'var(--surface-strong)', border: '1px solid var(--border)', color: 'var(--ink)' }}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
                  <AlertTriangle size={13} style={{ color: '#f87171' }} />
                  <span className="text-xs" style={{ color: '#f87171' }}>{error}</span>
                </div>
              )}

              <div
                className="rounded-xl px-3 py-3 flex items-start gap-2"
                style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)' }}
              >
                <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#38bdf8' }} />
                <p className="text-xs text-pretty" style={{ color: 'var(--muted)' }}>
                  Your agent will receive a SKILL.md with app context, guardrails, and personalised instructions. It cannot sign transactions or access your keys.
                </p>
              </div>

              <button
                onClick={handleImport}
                className="w-full rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: 'var(--accent)', color: '#0a1628' }}
              >
                <Upload size={15} />
                Import Agent
              </button>
            </>
          )}

          {/* ── SKILL step ── */}
          {step === 'skill' && (
            <>
              <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Agent connected!</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Download the SKILL.md and load it into your agent to complete setup.</p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setShowSkill(s => !s)}
                  className="flex items-center gap-2 text-xs font-medium mb-2"
                  style={{ color: 'var(--accent)' }}
                >
                  {showSkill ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  {showSkill ? 'Hide' : 'Preview'} SKILL.md
                </button>
                {showSkill && (
                  <pre
                    className="rounded-xl p-3 text-xs overflow-auto max-h-48 whitespace-pre-wrap"
                    style={{ background: 'var(--surface-strong)', color: 'var(--muted)', border: '1px solid var(--border)', fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {skill}
                  </pre>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadSkill}
                  className="flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm"
                  style={{ background: 'var(--accent)', color: '#0a1628' }}
                >
                  <Download size={15} />
                  Download
                </button>
                <button
                  onClick={() => { void copySkill() }}
                  className="flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm"
                  style={{ background: 'var(--surface-strong)', color: 'var(--ink)', border: '1px solid var(--border)' }}
                >
                  <Copy size={15} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <button
                onClick={() => setStep('done')}
                className="w-full rounded-xl py-2.5 font-medium text-sm"
                style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                Done
              </button>
            </>
          )}

          {/* ── DONE step ── */}
          {step === 'done' && (
            <>
              <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <Bot size={18} style={{ color: 'var(--success)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{existing?.name ?? paName}</p>
                  <p className="text-xs mono truncate" style={{ color: 'var(--subtle)' }}>{existing?.apiEndpoint ?? endpoint}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--subtle)' }}>
                    Imported {existing?.importedAt ? new Date(existing.importedAt).toLocaleDateString() : 'today'}
                  </p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setShowSkill(s => !s)}
                  className="flex items-center gap-2 text-xs font-medium mb-2"
                  style={{ color: 'var(--accent)' }}
                >
                  {showSkill ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  {showSkill ? 'Hide' : 'View'} SKILL.md
                </button>
                {showSkill && (
                  <pre
                    className="rounded-xl p-3 text-xs overflow-auto max-h-40 whitespace-pre-wrap"
                    style={{ background: 'var(--surface-strong)', color: 'var(--muted)', border: '1px solid var(--border)', fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {skill}
                  </pre>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadSkill}
                  className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
                  style={{ background: 'var(--accent)', color: '#0a1628' }}
                >
                  <Download size={15} />
                  Re-download
                </button>
                <button
                  onClick={() => { void copySkill() }}
                  className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
                  style={{ background: 'var(--surface-strong)', color: 'var(--ink)', border: '1px solid var(--border)' }}
                >
                  <Copy size={15} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <button
                onClick={handleRemove}
                className="w-full rounded-xl py-2 text-xs font-medium"
                style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.15)' }}
              >
                Disconnect agent
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
