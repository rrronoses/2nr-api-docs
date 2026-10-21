// Common disposable / temporary email domains
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', 'temp-mail.org', 'temp-mail.io', 'tempmailo.com',
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.org', 'guerrillamail.net',
  '10minutemail.com', '10minutemail.net', '10minmail.com',
  'yopmail.com', 'yopmail.fr', 'yopmail.net',
  'throwawaymail.com', 'throwaway.email',
  'fakeinbox.com', 'fakemailgenerator.com',
  'getnada.com', 'nada.email',
  'maildrop.cc', 'mailnesia.com',
  'trashmail.com', 'trashmail.me', 'trashmail.net',
  'sharklasers.com', 'grr.la', 'guerrillamailblock.com',
  'dispostable.com', 'mailcatch.com',
  'tempail.com', 'tempinbox.com',
  'mohmal.com', 'emailondeck.com',
  'mintemail.com', 'mytemp.email',
  'tmpmail.org', 'tmpmail.net',
  'emailfake.com', 'emailtemporanea.com',
  'tempr.email', 'discard.email',
  'mailnull.com', 'spamgourmet.com',
  'getairmail.com', 'mailforspam.com',
  'spambox.us', 'spamfree24.org',
  'bccto.me', 'chacuo.net',
  'anonymousemail.me', 'anonbox.net',
  'mailinator.net', 'mailinator2.com',
  'inboxkitten.com', 'tempmailaddress.com',
  'tmpeml.com', 'tempmailgen.com',
  'burnermail.io', 'mailpoof.com',
  'temp-mail.ru', 'crazymailing.com',
  'mailtemp.net', 'tempm.com',
  'emailnax.com', 'mailsac.com',
  'harakirimail.com', 'jetable.org',
  'kasmail.com', 'spamobox.com',
  'mailzilla.com', 'spamspot.com',
  'tempmailer.com', 'tempmailer.de',
  'fakemail.net', 'trash-mail.com',
  'wegwerfmail.de', 'wegwerfmail.net',
  'objectmail.com', 'proxymail.eu',
  'rcpt.at', 'trash-mail.at',
  'wegwerfmail.org', 'zwergmail.de',
  // maxxspace was used in the original HAR captures – treat as disposable for this app
  'maxxspace.com',
])

// Well-known real providers (optional whitelist feel)
const TRUSTED_PROVIDERS = [
  'gmail.com', 'googlemail.com',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'yahoo.com', 'yahoo.co.in', 'yahoo.co.uk',
  'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me',
  'zoho.com', 'zohomail.com',
  'aol.com',
  'gmx.com', 'gmx.net',
  'mail.com',
  'yandex.com', 'yandex.ru',
  'rediffmail.com',
  'fastmail.com',
  'tutanota.com', 'tuta.io',
]

export function isDisposableEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split('@')[1]
  if (!domain) return true
  return DISPOSABLE_DOMAINS.has(domain)
}

export function isValidRealEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase()

  // Basic format
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address.' }
  }

  if (isDisposableEmail(trimmed)) {
    return {
      valid: false,
      error: 'Temporary / disposable emails are not allowed. Please use Gmail, Outlook, Yahoo, or another real email provider.',
    }
  }

  return { valid: true }
}

export function getEmailProviderHint(email: string): string | null {
  const domain = email.trim().toLowerCase().split('@')[1]
  if (!domain) return null
  if (TRUSTED_PROVIDERS.includes(domain)) return domain
  return null
}