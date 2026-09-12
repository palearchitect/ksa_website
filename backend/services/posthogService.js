const { PostHog } = require('posthog-node')

const apiKey = process.env.POSTHOG_API_KEY || process.env.POSTHOG_KEY
const host = process.env.POSTHOG_HOST || 'https://us.i.posthog.com'

let client = null

if (apiKey) {
  try {
    client = new PostHog(apiKey, {
      host: host,
      flushAt: 1,
      flushInterval: 0
    })
    console.log('[PostHog Backend] Initialized successfully with host:', host)
  } catch (err) {
    console.error('[PostHog Backend] Failed to initialize:', err)
  }
} else {
  if (process.env.NODE_ENV !== 'production') {
    console.info('[PostHog Backend] POSTHOG_API_KEY not set. Backend telemetry operating in mock mode.')
  }
}

/**
 * Capture backend events (e.g. critical business transactions, audit actions)
 */
const capture = ({ distinctId, event, properties = {} }) => {
  if (!distinctId || !event) return

  if (client) {
    try {
      client.capture({
        distinctId: String(distinctId),
        event: event,
        properties: properties
      })
    } catch (err) {
      console.warn('[PostHog Backend] Capture error:', err)
    }
  } else if (process.env.NODE_ENV !== 'production') {
    console.debug(`[PostHog Backend Mock Capture] ${event} for ${distinctId}:`, properties)
  }
}

/**
 * Identify a user with traits on the backend
 */
const identify = ({ distinctId, properties = {} }) => {
  if (!distinctId) return

  if (client) {
    try {
      client.identify({
        distinctId: String(distinctId),
        properties: properties
      })
    } catch (err) {
      console.warn('[PostHog Backend] Identify error:', err)
    }
  } else if (process.env.NODE_ENV !== 'production') {
    console.debug(`[PostHog Backend Mock Identify] User ${distinctId}:`, properties)
  }
}

/**
 * Check feature flag status
 */
const isFeatureEnabled = async (flagKey, distinctId) => {
  if (!client || !distinctId) return false
  try {
    return await client.isFeatureEnabled(flagKey, String(distinctId))
  } catch (err) {
    console.warn('[PostHog Backend] Feature flag evaluation error:', err)
    return false
  }
}

/**
 * Graceful flush on server shutdown
 */
const shutdown = async () => {
  if (client) {
    try {
      await client.shutdown()
    } catch (err) {
      console.warn('[PostHog Backend] Error during shutdown:', err)
    }
  }
}

module.exports = {
  client,
  capture,
  identify,
  isFeatureEnabled,
  shutdown
}
