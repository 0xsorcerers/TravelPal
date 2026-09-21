const ONRAMPER_BASE = 'https://widget.onramper.com'

export function buildOfframpUrl(params: {
  countryCode: string
  walletAddress?: string
}): string {
  const { countryCode, walletAddress } = params

  const qp = new URLSearchParams({
    apiKey: 'pk_prod_01HXGDM2XMYFM6KJKJQJ9JKQQK', // public demo key — replace with a real key in production
    defaultCrypto: 'USDC',
    onlyCryptos: 'USDC',
    defaultFiat: getFiatForCountry(countryCode),
    onlyOnramps: 'false',
    onlyOfframps: 'true',
    isAddressEditable: 'false',
    themeName: 'dark',
  })

  if (walletAddress) {
    qp.set('wallets', `USDC:${walletAddress}`)
  }

  return `${ONRAMPER_BASE}?${qp.toString()}`
}

function getFiatForCountry(code: string): string {
  const map: Record<string, string> = {
    US: 'USD', GB: 'GBP', EU: 'EUR', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR',
    JP: 'JPY', KR: 'KRW', AU: 'AUD', CA: 'CAD', CH: 'CHF', CN: 'CNY',
    IN: 'INR', MX: 'MXN', BR: 'BRL', SG: 'SGD', HK: 'HKD', TH: 'THB',
    ID: 'IDR', MY: 'MYR', PH: 'PHP', VN: 'VND', PK: 'PKR', BD: 'BDT',
    EG: 'EGP', NG: 'NGN', ZA: 'ZAR', KE: 'KES', GH: 'GHS',
    AE: 'AED', SA: 'SAR', TR: 'TRY', PL: 'PLN', SE: 'SEK', NO: 'NOK',
    DK: 'DKK', NZ: 'NZD', AR: 'ARS', CL: 'CLP', CO: 'COP',
  }
  return map[code] ?? 'USD'
}
