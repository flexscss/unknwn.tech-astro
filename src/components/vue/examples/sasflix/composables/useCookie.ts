interface CookieOptions {
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

interface CookieRef<T> {
  get: () => T | undefined
  set: (newValue: T) => void
}

const defaultOptions: CookieOptions = {
  maxAge: 60 * 60 * 24 * 30,
  path: '/',
  sameSite: 'strict'
}

export function useCookie<T>(key: string, options: CookieOptions = {}): { value: CookieRef<T> } {
  const cookieOptions = { ...defaultOptions, ...options }

  const getValue = (): T | undefined => {
    try {
      const value = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${key}=`))
        ?.split('=')[1]

      return value ? JSON.parse(decodeURIComponent(value)) : undefined
    }
    catch {
      return undefined
    }
  }

  const setValue = (value: T) => {
    const stringValue = encodeURIComponent(JSON.stringify(value))
    let cookieString = `${key}=${stringValue}`

    if (cookieOptions.maxAge)
      cookieString += `; max-age=${cookieOptions.maxAge}`
    if (cookieOptions.path)
      cookieString += `; path=${cookieOptions.path}`
    if (cookieOptions.domain)
      cookieString += `; domain=${cookieOptions.domain}`
    if (cookieOptions.secure)
      cookieString += '; secure'
    if (cookieOptions.sameSite)
      cookieString += `; samesite=${cookieOptions.sameSite}`

    document.cookie = cookieString
  }

  return {
    value: {
      get: getValue,
      set: setValue
    }
  }
}
