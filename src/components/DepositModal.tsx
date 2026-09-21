import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Copy, Check, ArrowDownToLine } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { TokenUSDC } from '@web3icons/react'

const NETWORKS = [
  { id: 'arc', label: 'Arc Testnet', note: 'Native USDC, ~0 gas', color: '#38bdf8' },
  { id: 'base', label: 'Base', note: 'Low fees, ERC-20 USDC', color: '#0052ff' },
  { id: 'arbitrum', label: 'Arbitrum', note: 'Low fees, ERC-20 USDC', color: '#28a0f0' },
  { id: 'solana', label: 'Solana', note: 'SPL USDC, minimal fees', color: '#9945ff' },
]

interface Props {
  address: string
  onClose: () => void
}

export function DepositModal({ address, onClose }: Props) {
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [selectedNet, setSelectedNet] = useState('arc')

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const short = `${address.slice(0, 12)}…${address.slice(-10)}`

  return createPortal(
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ zIndex: 9999, background: 'rgba(5,12,25,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="glass-card rounded-t-2xl w-full max-w-md animate-fade-in-up">
        <div className="spectral-strip rounded-t-2xl" />

        <div className="p-5 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDownToLine size={18} style={{ color: 'var(--accent)' }} />
              <span className="display font-semibold text-base" style={{ color: 'var(--ink)' }}>Deposit USDC</span>
            </div>
            <button onClick={onClose} className="p-1" style={{ color: 'var(--muted)' }}>
              <X size={18} />
            </button>
          </div>

          {/* Network selector */}
          <div className="grid grid-cols-2 gap-2">
            {NETWORKS.map(net => (
              <button
                key={net.id}
                onClick={() => setSelectedNet(net.id)}
                className="flex flex-col items-start gap-0.5 rounded-xl px-3 py-2.5 text-left transition-all"
                style={{
                  background: selectedNet === net.id ? `${net.color}18` : 'var(--surface)',
                  border: `1px solid ${selectedNet === net.id ? net.color + '55' : 'var(--border)'}`,
                }}
              >
                <span className="text-xs font-semibold" style={{ color: selectedNet === net.id ? net.color : 'var(--ink-2)' }}>
                  {net.label}
                </span>
                <span className="text-xs" style={{ color: 'var(--subtle)' }}>{net.note}</span>
              </button>
            ))}
          </div>

          {/* QR + address */}
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-xl" style={{ background: 'white' }}>
              <QRCodeSVG value={address} size={150} level="M" />
            </div>

            <div className="flex items-center gap-2 w-full">
              <TokenUSDC size={20} variant="branded" />
              <span className="mono text-xs flex-1 truncate" style={{ color: 'var(--ink-2)' }}>{short}</span>
              <button
                onClick={() => { void copyAddress() }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all active:scale-95"
                style={{ background: 'var(--surface-strong)', color: 'var(--accent)' }}
              >
                {copiedAddress ? <Check size={12} /> : <Copy size={12} />}
                {copiedAddress ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <p className="text-xs text-center" style={{ color: 'var(--subtle)' }}>
            Send USDC to this address on the selected network. Funds appear after blockchain confirmation.
          </p>

          <button
            onClick={onClose}
            className="w-full rounded-xl py-3 text-sm font-semibold"
            style={{ background: 'var(--surface-strong)', color: 'var(--ink-2)' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  , document.body)
}
