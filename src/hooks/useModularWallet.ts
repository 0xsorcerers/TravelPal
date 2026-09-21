import { useState, useCallback, useRef, useEffect } from 'react'
import { createPublicClient } from 'viem'
import { arcTestnet } from 'viem/chains'
import type { SmartAccount } from 'viem/account-abstraction'
import { createBundlerClient, toWebAuthnAccount } from 'viem/account-abstraction'
import type { P256Credential } from 'viem/account-abstraction'
import {
  WebAuthnMode,
  toCircleSmartAccount,
  toModularTransport,
  toPasskeyTransport,
  toWebAuthnCredential,
} from '@circle-fin/modular-wallets-core'
import { erc20Abi } from 'viem'
import { getUsdc } from '@/onchain-facts'
import { Amount, usdcDecimalsFor } from '@/onchain-money'

const CRED_KEY = 'travelpal_passkey_credential'
const ADDR_KEY = 'travelpal_wallet_address'

const clientKey = import.meta.env.VITE_CLIENT_KEY as string
const clientUrl = import.meta.env.VITE_CLIENT_URL as string

export type WalletStatus =
  | 'idle'
  | 'registering'
  | 'logging_in'
  | 'creating_account'
  | 'ready'
  | 'error'

export interface ModularWalletState {
  status: WalletStatus
  address: string | null
  usdcBalance: string
  error: string | null
  isClientKeyMissing: boolean
}

export interface UseModularWalletReturn extends ModularWalletState {
  register: (username: string) => Promise<void>
  login: () => Promise<void>
  refreshBalance: () => Promise<void>
  hasStoredCredential: boolean
}

function loadCredential(): P256Credential | null {
  try {
    const raw = localStorage.getItem(CRED_KEY)
    if (raw) return JSON.parse(raw) as P256Credential
  } catch {}
  return null
}

function saveCredential(cred: P256Credential) {
  try { localStorage.setItem(CRED_KEY, JSON.stringify(cred)) } catch {}
}

export function useModularWallet(): UseModularWalletReturn {
  const [state, setState] = useState<ModularWalletState>({
    status: 'idle',
    address: localStorage.getItem(ADDR_KEY),
    usdcBalance: '0.00',
    error: null,
    isClientKeyMissing: !clientKey,
  })
  const accountRef = useRef<SmartAccount | null>(null)
  const bundlerRef = useRef<ReturnType<typeof createBundlerClient> | null>(null)

  const hasStoredCredential = !!loadCredential()

  const buildClients = useCallback(() => {
    const passkeyTransport = toPasskeyTransport(clientUrl, clientKey)
    const modularTransport = toModularTransport(`${clientUrl}/arcTestnet`, clientKey)
    const publicClient = createPublicClient({ chain: arcTestnet, transport: modularTransport })
    const bundlerClient = createBundlerClient({ chain: arcTestnet, transport: modularTransport })
    return { passkeyTransport, publicClient, bundlerClient }
  }, [])

  const initAccount = useCallback(async (cred: P256Credential, username: string) => {
    const { publicClient, bundlerClient } = buildClients()
    const webAuthnAccount = toWebAuthnAccount({ credential: cred })
    const account = await toCircleSmartAccount({
      client: publicClient,
      owner: webAuthnAccount,
      name: username,
    })
    accountRef.current = account
    bundlerRef.current = bundlerClient
    const addr = account.address
    localStorage.setItem(ADDR_KEY, addr)
    setState(s => ({ ...s, address: addr, status: 'ready', error: null }))
    return { account, bundlerClient }
  }, [buildClients])

  const fetchBalance = useCallback(async (address: string) => {
    try {
      const usdcFact = getUsdc(arcTestnet.id)
      if (!usdcFact) return
      const { publicClient } = buildClients()
      const raw = await publicClient.readContract({
        address: usdcFact.address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      })
      const formatted = Amount.fromRaw(raw, usdcDecimalsFor(arcTestnet.id)).toFixed(2)
      setState(s => ({ ...s, usdcBalance: formatted }))
    } catch {}
  }, [buildClients])

  const refreshBalance = useCallback(async () => {
    const addr = state.address
    if (addr) await fetchBalance(addr)
  }, [state.address, fetchBalance])

  const register = useCallback(async (username: string) => {
    if (!clientKey) {
      setState(s => ({ ...s, error: 'Missing VITE_CLIENT_KEY — see setup instructions', isClientKeyMissing: true }))
      return
    }
    setState(s => ({ ...s, status: 'registering', error: null }))
    try {
      const { passkeyTransport } = buildClients()
      const cred = await toWebAuthnCredential({ transport: passkeyTransport, mode: WebAuthnMode.Register, username })
      saveCredential(cred)
      setState(s => ({ ...s, status: 'creating_account' }))
      const { account } = await initAccount(cred, username)
      await fetchBalance(account.address)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      setState(s => ({ ...s, status: 'error', error: msg }))
    }
  }, [buildClients, initAccount, fetchBalance])

  const login = useCallback(async () => {
    if (!clientKey) {
      setState(s => ({ ...s, error: 'Missing VITE_CLIENT_KEY — see setup instructions', isClientKeyMissing: true }))
      return
    }
    setState(s => ({ ...s, status: 'logging_in', error: null }))
    try {
      const { passkeyTransport } = buildClients()
      const cred = await toWebAuthnCredential({ transport: passkeyTransport, mode: WebAuthnMode.Login })
      saveCredential(cred)
      setState(s => ({ ...s, status: 'creating_account' }))
      const { account } = await initAccount(cred, 'traveler')
      await fetchBalance(account.address)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setState(s => ({ ...s, status: 'error', error: msg }))
    }
  }, [buildClients, initAccount, fetchBalance])

  // Poll balance every 5 seconds once wallet is ready
  useEffect(() => {
    if (state.status !== 'ready' || !state.address) return
    const addr = state.address
    // oxlint-disable-next-line react/set-state-in-effect
    void fetchBalance(addr)
    const id = setInterval(() => { void fetchBalance(addr) }, 5000)
    return () => clearInterval(id)
  }, [state.status, state.address, fetchBalance])

  return { ...state, register, login, refreshBalance, hasStoredCredential }
}
