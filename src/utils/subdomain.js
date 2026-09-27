/**
 * Helper utility for Hostinger multi-subdomain architecture:
 * - Main site: ksavaluers.com
 * - Auth portal: accounts.ksavaluers.com
 * - Admin & Client Dashboard: dashboard.ksavaluers.com
 * - REST API: api.ksavaluers.com
 */

export const isAccountsSubdomain = () => {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname.toLowerCase()
  return host.startsWith('accounts.') || host === 'accounts.ksavaluers.com'
}

export const isDashboardSubdomain = () => {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname.toLowerCase()
  return host.startsWith('dashboard.') || host === 'dashboard.ksavaluers.com'
}

export const isApiSubdomain = () => {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname.toLowerCase()
  return host.startsWith('api.') || host === 'api.ksavaluers.com'
}

export const getSubdomainUrl = (type, path = '') => {
  if (typeof window === 'undefined') return path
  const host = window.location.hostname
  const protocol = window.location.protocol

  // In local development or IP / tunnel, preserve relative routing
  if (
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes('ngrok-free.dev') ||
    /^\d+\.\d+\.\d+\.\d+$/.test(host)
  ) {
    return path
  }

  // Production subdomain mapping
  const baseDomain = 'ksavaluers.com'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (type === 'accounts') {
    return `${protocol}//accounts.${baseDomain}${normalizedPath}`
  } else if (type === 'dashboard') {
    return `${protocol}//dashboard.${baseDomain}${normalizedPath}`
  } else if (type === 'api') {
    return `${protocol}//api.${baseDomain}${normalizedPath}`
  } else if (type === 'main') {
    return `${protocol}//${baseDomain}${normalizedPath}`
  }

  return normalizedPath
}

export const navigateToSubdomain = (type, path = '', router = null) => {
  const url = getSubdomainUrl(type, path)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    window.location.href = url
  } else if (router) {
    router.push(path)
  } else {
    window.location.href = path
  }
}
