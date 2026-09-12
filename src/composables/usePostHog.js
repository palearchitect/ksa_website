import { inject } from 'vue'
import {
  captureEvent,
  identifyUser,
  resetUser,
  isFeatureEnabled,
  getFeatureFlag
} from '@/plugins/posthog'

export function usePostHog() {
  const posthog = inject('posthog', null)

  return {
    posthog,
    capture: captureEvent,
    identify: identifyUser,
    reset: resetUser,
    isFeatureEnabled,
    getFeatureFlag
  }
}

export default usePostHog
