import { useState, useEffect } from 'react'
import { ArrowDownToLine, TrendingDown, RefreshCw, Camera, LogOut, Wifi, Bot } from 'lucide-react'
import { TokenUSDC } from '@web3icons/react'
import { ParallaxBackground } from './ParallaxBackground'
import { Globe3D } from './Globe3D'
import { LocalTimeBadge } from './LocalTimeBadge'
import { DepositModal } from './DepositModal'
import { OfframpModal } from './OfframpModal'
import { FeedPanel } from './FeedPanel'
import { TravelPhotosManager } from './TravelPhotosManager'
import { ImportPAModal } from './ImportPAModal'
import { useBackgroundImages } from '../hooks/useBackgroundImages'
import { useFeed } from '../hooks/useFeed'
import type { GeoLocation } from '../hooks/useGeolocation'
import type { ModularWalletState } from '../hooks/useModularWallet'

interface Props {
  nickname: string
  geo: GeoLocation
  wallet: ModularWalletState & {
    refreshBalance: () => Promise<void>
  }
  onLogout: () => void
}

export function Dashboard({ nickname, geo, wallet, onLogout }: Props) {
  const [showDeposit, setShowDeposit] = useState(false)
  const [showOfframp, setShowOfframp] = useState(false)
  const [showPhotos, setShowPhotos] = useState(false)
  const [showImportPA, setShowImportPA] = useState(false)
  const openImportPA = () => setShowImportPA(true)
  const closeImportPA = () => setShowImportPA(false)
  const [refreshing, setRefreshing] = useState(false)
  const [greetSeen, setGreetSeen] = useState(false)

  const bg = useBackgroundImages({
    city: geo.city,
    countryCode: geo.countryCode,
    lat: geo.lat,
    lng: geo.lng,
  })

  const feed = useFeed(geo.countryCode, geo.city)

  useEffect(() => {
    const t = setTimeout(() => setGreetSeen(true), 3000)
    return () => clearTimeout(t)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await wallet.refreshBalance()
    setRefreshing(false)
  }

  return (
    <>
      <ParallaxBackground src={bg.currentBackground} source={bg.imageSource}>
        <div className="mx-auto max-w-md px-4 pb-12 pt-5 flex flex-col gap-5">

          {/* Top bar */}
          <div className="flex items-start justify-between">
            <LocalTimeBadge
              city={geo.city}
              country={geo.country}
              timezone={geo.timezone}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={openImportPA}
                className="p-2 rounded-full glass-pill transition-all active:scale-90"
                title="Import Personal Agent"
              >
                <Bot size={16} style={{ color: 'var(--accent)' }} />
              </button>
              <button
                onClick={() => setShowPhotos(true)}
                className="p-2 rounded-full glass-pill transition-all active:scale-90"
                title="Travel Photos"
              >
                <Camera size={16} style={{ color: 'var(--ink-2)' }} />
              </button>
              <button
                onClick={onLogout}
                className="p-2 rounded-full glass-pill transition-all active:scale-90"
                title="Log out"
              >
                <LogOut size={16} style={{ color: 'var(--muted)' }} />
              </button>
            </div>
          </div>

          {/* Hero section */}
          <div className="flex flex-col items-center gap-3 py-4 animate-fade-in-up">
            <Globe3D size={160} />

            {!greetSeen ? (
              <div className="text-center animate-fade-in-up">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Welcome back,</p>
                <h1 className="display text-3xl font-bold" style={{ color: 'var(--ink)', letterSpacing: '-0.03em' }}>
                  {nickname}
                </h1>
              </div>
            ) : (
              <div className="text-center animate-fade-in-up">
                <p className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Explore the world with</p>
                <h1 className="display text-2xl font-bold" style={{ color: 'var(--ink)' }}>Travel Pal</h1>
              </div>
            )}
          </div>

          {/* Balance card */}
          <div className="glass-card rounded-2xl p-5 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TokenUSDC size={20} variant="branded" />
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)', letterSpacing: '0.07em' }}>
                  USDC Balance
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                  style={{ background: wallet.status === 'ready' ? 'var(--success)' : 'var(--subtle)' }}
                />
                <span className="text-xs" style={{ color: 'var(--subtle)' }}>Arc Testnet</span>
                <button
                  onClick={() => { void handleRefresh() }}
                  className="p-1 rounded-lg transition-all active:scale-90"
                  style={{ color: 'var(--muted)' }}
                >
                  <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            <div className="flex items-end gap-2 mb-4">
              <span
                className="display tabular-nums"
                style={{ fontSize: '2.8rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.04em' }}
              >
                ${wallet.usdcBalance}
              </span>
              <span className="mb-1.5 text-sm font-medium" style={{ color: 'var(--muted)' }}>USDC</span>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeposit(true)}
                className="flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm transition-all active:scale-95"
                style={{ background: 'var(--accent)', color: '#0a1628' }}
              >
                <ArrowDownToLine size={16} />
                Deposit
              </button>
              <button
                onClick={() => setShowOfframp(true)}
                className="flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm transition-all active:scale-95"
                style={{ background: 'rgba(45,212,191,0.15)', color: 'var(--teal)', border: '1px solid rgba(45,212,191,0.3)' }}
              >
                <TrendingDown size={16} />
                Cash Out
              </button>
            </div>
          </div>

          {/* Wallet address chip */}
          {wallet.address && (
            <div className="glass-pill rounded-xl px-4 py-2.5 flex items-center gap-2">
              <Wifi size={12} style={{ color: 'var(--success)' }} />
              <span className="mono text-xs flex-1 truncate" style={{ color: 'var(--muted)' }}>
                {wallet.address.slice(0, 8)}…{wallet.address.slice(-6)}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(52,211,153,0.12)', color: 'var(--success)', border: '1px solid rgba(52,211,153,0.2)' }}
              >
                Active
              </span>
            </div>
          )}

          {/* Location info */}
          {!geo.loading && (
            <div
              className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in-up"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}
              >
                <span style={{ fontSize: '1.1rem' }}>📍</span>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                  {geo.city}{geo.country ? `, ${geo.country}` : ''}
                </p>
                <p className="text-xs" style={{ color: 'var(--subtle)' }}>
                  {geo.lat !== 0 ? `${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)}` : 'Locating…'}
                  {geo.source === 'ip' && <span className="ml-1 opacity-50">· IP</span>}
                  {geo.source === 'gps' && <span className="ml-1 opacity-50">· GPS</span>}
                </p>
              </div>
              {bg.imageSource === 'geo' && (
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(56,189,248,0.12)', color: 'var(--accent)', border: '1px solid rgba(56,189,248,0.2)' }}
                >
                  📸 geo photo
                </span>
              )}
            </div>
          )}

          {/* Feed */}
          <FeedPanel
            alerts={feed.alerts}
            readIds={feed.readIds}
            unreadCount={feed.unreadCount}
            filter={feed.filter}
            onFilterChange={feed.setFilter}
            onMarkRead={feed.markRead}
            onDismiss={feed.dismiss}
          />

          <p className="text-center text-xs" style={{ color: 'var(--subtle)', opacity: 0.6 }}>
            Travel Pal · Powered by Arc Testnet · USDC
          </p>
        </div>
      </ParallaxBackground>

      {/* Modals */}
      {showDeposit && wallet.address && (
        <DepositModal address={wallet.address} onClose={() => setShowDeposit(false)} />
      )}

      {showOfframp && (
        <OfframpModal
          countryCode={geo.countryCode}
          country={geo.country}
          walletAddress={wallet.address}
          onClose={() => setShowOfframp(false)}
        />
      )}

      {showPhotos && (
        <TravelPhotosManager
          userPhotos={bg.userPhotos}
          useMyPhotos={bg.useMyPhotos}
          onAddPhotos={bg.addUserPhotos}
          onRemovePhoto={bg.removeUserPhoto}
          onToggleMyPhotos={bg.toggleMyPhotos}
          onClose={() => setShowPhotos(false)}
        />
      )}

      {showImportPA && wallet.address && (
        <ImportPAModal
          nickname={nickname}
          walletAddress={wallet.address}
          countryCode={geo.countryCode}
          city={geo.city}
          country={geo.country}
          onClose={closeImportPA}
        />
      )}
    </>
  )
}
