import { useState } from 'react'
import { Shield, Copy, Check, CheckCircle2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface Props {
  address: string
  onConfirm: () => void
}

export function WalletCreatedModal({ address, onConfirm }: Props) {
  const [copied, setCopied] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const short = `${address.slice(0, 10)}…${address.slice(-8)}`

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: 60, background: 'rgba(5,12,25,0.88)', backdropFilter: 'blur(12px)' }}
    >
      <div className="glass-card rounded-2xl w-full max-w-sm animate-fade-in-up">
        {/* Spectral strip */}
        <div className="spectral-strip rounded-t-2xl" />

        <div className="p-6 flex flex-col items-center gap-5">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse-glow"
            style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)' }}
          >
            <Shield size={28} style={{ color: 'var(--accent)' }} />
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="display text-xl font-bold mb-1.5" style={{ color: 'var(--ink)' }}>
              Wallet Created
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Your Travel Pal agent wallet is ready on Arc Testnet. This address receives USDC from any chain.
            </p>
          </div>

          {/* QR Code */}
          <div
            className="p-3 rounded-xl"
            style={{ background: 'white' }}
          >
            <QRCodeSVG value={address} size={140} level="M" />
          </div>

          {/* Address */}
          <button
            onClick={() => { void copyAddress() }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 w-full justify-between transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)' }}
          >
            <span className="mono text-xs truncate" style={{ color: 'var(--ink-2)' }}>
              {short}
            </span>
            {copied ? (
              <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
            ) : (
              <Copy size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            )}
          </button>

          {/* Networks note */}
          <div
            className="rounded-xl px-4 py-3 w-full text-xs"
            style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.18)', color: 'var(--ink-2)' }}
          >
            <strong style={{ color: 'var(--accent)' }}>Deposit via:</strong> Arc Testnet · Base · Arbitrum · Solana
            <br />
            <span style={{ color: 'var(--muted)' }}>Use low-fee networks to fund your wallet.</span>
          </div>

          {/* Confirmation checkbox */}
          <label className="flex items-start gap-3 cursor-pointer w-full">
            <div
              onClick={() => setConfirmed(c => !c)}
              className="mt-0.5 w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all"
              style={{
                background: confirmed ? 'var(--accent)' : 'transparent',
                border: `2px solid ${confirmed ? 'var(--accent)' : 'var(--border-strong)'}`,
              }}
            >
              {confirmed && <Check size={12} className="text-[#0a1628]" strokeWidth={3} />}
            </div>
            <span className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              I have noted my wallet address and understand this is a non-custodial wallet — Travel Pal does not store or recover it for me.
            </span>
          </label>

          {/* CTA */}
          <button
            onClick={onConfirm}
            disabled={!confirmed}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-sm transition-all active:scale-95"
            style={{
              background: confirmed ? 'var(--accent)' : 'var(--surface)',
              color: confirmed ? '#0a1628' : 'var(--subtle)',
            }}
          >
            <CheckCircle2 size={16} />
            Go to My Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
