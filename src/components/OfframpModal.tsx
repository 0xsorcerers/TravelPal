import { createPortal } from 'react-dom'
import { X, TrendingDown, Globe } from 'lucide-react'
import { buildOfframpUrl } from '../lib/offrampUrl'

interface Props {
  countryCode: string
  country: string
  walletAddress: string | null
  onClose: () => void
}

export function OfframpModal({ countryCode, country, walletAddress, onClose }: Props) {
  const widgetUrl = buildOfframpUrl({ countryCode, walletAddress: walletAddress ?? undefined })

  return createPortal(
    <div
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: 9999, background: 'rgba(5,12,25,0.92)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex-shrink-0 glass-card border-b-0 rounded-none px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown size={18} style={{ color: 'var(--teal)' }} />
          <div>
            <span className="display font-semibold text-sm" style={{ color: 'var(--ink)' }}>
              Convert to Local Currency
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Globe size={10} style={{ color: 'var(--muted)' }} />
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {country || 'Your region'} · USDC → local fiat
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full"
          style={{ background: 'var(--surface)', color: 'var(--muted)' }}
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 relative">
        <iframe
          src={widgetUrl}
          title="USDC Offramp"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; camera; gyroscope; payment"
        />
      </div>

      <div
        className="flex-shrink-0 px-5 py-3 text-center text-xs"
        style={{ color: 'var(--subtle)', borderTop: '1px solid var(--border)' }}
      >
        Offramp powered by Onramper · Rates updated in real time · {country}
      </div>
    </div>
  , document.body)
}
