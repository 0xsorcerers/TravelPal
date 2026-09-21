import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Globe3D } from './Globe3D'
import type { WalletStatus } from '../hooks/useModularWallet'

interface Props {
  onSubmit: (nickname: string) => void
  walletStatus: WalletStatus
  walletError: string | null
  isClientKeyMissing: boolean
  hasStoredCredential: boolean
  onLogin: () => void
}

export function OnboardingScreen({
  onSubmit,
  walletStatus,
  walletError,
  isClientKeyMissing,
  hasStoredCredential,
  onLogin,
}: Props) {
  const [nickname, setNickname] = useState('')
  const isLoading = walletStatus === 'registering' || walletStatus === 'logging_in' || walletStatus === 'creating_account'

  const statusText: Partial<Record<WalletStatus, string>> = {
    registering: 'Setting up your passkey…',
    logging_in: 'Authenticating with passkey…',
    creating_account: 'Creating your Travel Wallet…',
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 relative"
      style={{ background: 'linear-gradient(180deg, #050c19 0%, #0a1628 50%, #0d1f3c 100%)' }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      <div className="relative w-full max-w-sm flex flex-col items-center gap-6 animate-fade-in-up">
        {/* Globe hero */}
        <Globe3D size={180} />

        {/* Title */}
        <div className="text-center">
          <h1 className="display text-4xl font-bold mb-2" style={{ color: 'var(--ink)', letterSpacing: '-0.04em' }}>
            Travel Pal
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)', maxWidth: '22ch', margin: '0 auto' }}>
            Your AI travel companion with an embedded USDC wallet
          </p>
        </div>

        {/* Spectral strip */}
        <div className="spectral-strip w-16" />

        {/* Card */}
        <div className="glass-card rounded-2xl p-6 w-full">
          {isClientKeyMissing && (
            <div
              className="rounded-xl p-3 mb-4 text-xs leading-relaxed"
              style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}
            >
              <strong>Setup required:</strong> Add your Circle Client Key to <code className="mono">.env</code> as <code className="mono">VITE_CLIENT_KEY</code>. See the setup checklist above.
            </div>
          )}

          <h2 className="display text-lg font-semibold mb-1" style={{ color: 'var(--ink)' }}>
            What should we call you?
          </h2>
          <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
            No email or KYC required — just a nickname to get started.
          </p>

          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && nickname.trim() && !isLoading) onSubmit(nickname.trim()) }}
            placeholder="e.g. SkyRoamer"
            maxLength={24}
            disabled={isLoading}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-4"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)',
              color: 'var(--ink)',
            }}
          />

          <button
            onClick={() => nickname.trim() && !isLoading && onSubmit(nickname.trim())}
            disabled={!nickname.trim() || isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-sm transition-all active:scale-95"
            style={{
              background: nickname.trim() && !isLoading ? 'var(--accent)' : 'var(--surface)',
              color: nickname.trim() && !isLoading ? '#0a1628' : 'var(--subtle)',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {statusText[walletStatus] ?? 'Working…'}
              </>
            ) : (
              <>
                Create My Wallet
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {walletError && !isClientKeyMissing && (
            <p className="text-xs mt-3 text-center" style={{ color: 'var(--danger)' }}>
              {walletError}
            </p>
          )}
        </div>

        {/* Existing wallet login */}
        {hasStoredCredential && !isLoading && (
          <button
            onClick={onLogin}
            className="text-xs underline underline-offset-2"
            style={{ color: 'var(--muted)' }}
          >
            I already have a wallet — sign in with passkey
          </button>
        )}

        <p className="text-xs text-center" style={{ color: 'var(--subtle)', maxWidth: '28ch' }}>
          Your wallet is created locally with a passkey — no server stores your keys.
        </p>
      </div>
    </div>
  )
}
