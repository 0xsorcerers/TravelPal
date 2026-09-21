import { useState } from 'react'
import { OnboardingScreen } from './components/OnboardingScreen'
import { WalletCreatedModal } from './components/WalletCreatedModal'
import { Dashboard } from './components/Dashboard'
import { useGeolocation } from './hooks/useGeolocation'
import { useModularWallet } from './hooks/useModularWallet'

const NICKNAME_KEY = 'travelpal_nickname'
const ONBOARDED_KEY = 'travelpal_onboarded'

type AppScreen = 'onboarding' | 'wallet_created' | 'dashboard'

export default function App() {
  const geo = useGeolocation()
  const wallet = useModularWallet()

  const [screen, setScreen] = useState<AppScreen>(() => {
    const onboarded = localStorage.getItem(ONBOARDED_KEY) === 'true'
    const hasAddress = !!localStorage.getItem('travelpal_wallet_address')
    if (onboarded && hasAddress) return 'dashboard'
    return 'onboarding'
  })

  const [nickname, setNickname] = useState<string>(() => {
    return localStorage.getItem(NICKNAME_KEY) ?? ''
  })

  const handleOnboardingSubmit = async (nick: string) => {
    setNickname(nick)
    localStorage.setItem(NICKNAME_KEY, nick)
    await wallet.register(nick)
    // After register resolves, wallet.address is set; show the confirmation modal
    setScreen('wallet_created')
  }

  const handleLogin = async () => {
    await wallet.login()
    // If already onboarded, go straight to dashboard
    if (localStorage.getItem(ONBOARDED_KEY) === 'true') {
      setScreen('dashboard')
    } else {
      setScreen('wallet_created')
    }
  }

  const handleWalletConfirmed = () => {
    localStorage.setItem(ONBOARDED_KEY, 'true')
    setScreen('dashboard')
  }

  const handleLogout = () => {
    setScreen('onboarding')
  }

  if (screen === 'onboarding') {
    return (
      <OnboardingScreen
        onSubmit={nick => { void handleOnboardingSubmit(nick) }}
        walletStatus={wallet.status}
        walletError={wallet.error}
        isClientKeyMissing={wallet.isClientKeyMissing}
        hasStoredCredential={wallet.hasStoredCredential}
        onLogin={() => { void handleLogin() }}
      />
    )
  }

  if (screen === 'wallet_created' && wallet.address) {
    return (
      <WalletCreatedModal
        address={wallet.address}
        onConfirm={handleWalletConfirmed}
      />
    )
  }

  // Fallback: if wallet_created but address not ready yet (still registering), show onboarding
  if (screen === 'wallet_created') {
    return (
      <OnboardingScreen
        onSubmit={nick => { void handleOnboardingSubmit(nick) }}
        walletStatus={wallet.status}
        walletError={wallet.error}
        isClientKeyMissing={wallet.isClientKeyMissing}
        hasStoredCredential={wallet.hasStoredCredential}
        onLogin={() => { void handleLogin() }}
      />
    )
  }

  return (
    <Dashboard
      nickname={nickname}
      geo={geo}
      wallet={wallet}
      onLogout={handleLogout}
    />
  )
}
