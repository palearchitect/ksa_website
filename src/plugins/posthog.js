import posthog from 'posthog-js'

const apiKey = import.meta.env.VITE_POSTHOG_KEY
const apiHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

let isInitialized = false

export const initPostHog = () => {
  if (isInitialized) return posthog

  if (!apiKey) {
    if (import.meta.env.DEV) {
      console.info('[PostHog] VITE_POSTHOG_KEY not set. Operating in no-op mock mode.')
    }
    return posthog
  }

  try {
    posthog.init(apiKey, {
      api_host: apiHost,
      capture_pageview: false, // Pageviews are tracked explicitly via Vue Router
      capture_pageleave: true,
      person_profiles: 'identified_only',
      autocapture: true,
      loaded: (ph) => {
        if (import.meta.env.DEV) {
          console.info('[PostHog] Initialized successfully with host:', apiHost)
        }
      }
    })
    isInitialized = true
  } catch (error) {
    console.error('[PostHog] Initialization error:', error)
  }

  return posthog
}

export const posthogPlugin = {
  install(app) {
    const client = initPostHog()
    app.config.globalProperties.$posthog = client
    app.provide('posthog', client)
  }
}

export const captureEvent = (eventName, properties = {}) => {
  try {
    if (apiKey && isInitialized) {
      posthog.capture(eventName, properties)
    } else if (import.meta.env.DEV) {
      console.debug(`[PostHog Mock Capture] ${eventName}`, properties)
    }
  } catch (err) {
    console.warn('[PostHog] Failed to capture event:', eventName, err)
  }
}

export const identifyUser = (distinctId, userProperties = {}) => {
  try {
    if (apiKey && isInitialized && distinctId) {
      posthog.identify(String(distinctId), userProperties)
    } else if (import.meta.env.DEV) {
      console.debug(`[PostHog Mock Identify] User ${distinctId}:`, userProperties)
    }
  } catch (err) {
    console.warn('[PostHog] Failed to identify user:', err)
  }
}

export const resetUser = () => {
  try {
    if (apiKey && isInitialized) {
      posthog.reset()
    } else if (import.meta.env.DEV) {
      console.debug('[PostHog Mock Reset] User session reset.')
    }
  } catch (err) {
    console.warn('[PostHog] Failed to reset user:', err)
  }
}

export const isFeatureEnabled = (flagKey) => {
  try {
    if (apiKey && isInitialized) {
      return posthog.isFeatureEnabled(flagKey)
    }
  } catch (err) {
    console.warn('[PostHog] Failed to evaluate feature flag:', flagKey, err)
  }
  return false
}

export const getFeatureFlag = (flagKey) => {
  try {
    if (apiKey && isInitialized) {
      return posthog.getFeatureFlag(flagKey)
    }
  } catch (err) {
    console.warn('[PostHog] Failed to get feature flag:', flagKey, err)
  }
  return undefined
}

export default posthog
