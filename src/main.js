import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { createMetaManager } from 'vue-meta';
import { clerkPlugin } from '@clerk/vue';
import { captureException, posthogPlugin } from './plugins/posthog';
import * as Sentry from '@sentry/vue';

import './assets/tailwind.css';

const app = createApp(App);
const pinia = createPinia();

Sentry.init({
  app,
  dsn: "https://5153d7313d2a1a5a16f19ecf23fe655c@o4512005735251968.ingest.de.sentry.io/4512109410910288",
  dataCollection: {
    // userInfo: false,
    // httpBodies: []
  },
  integrations: [
    Sentry.browserTracingIntegration({ router }),
    Sentry.replayIntegration()
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/api\.ksavaluers\.com\/api/, /^http:\/\/localhost:5173\/api/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

app.use(pinia);
app.use(router);
app.use(createMetaManager());
app.use(posthogPlugin);

const existingErrorHandler = app.config.errorHandler;
app.config.errorHandler = (error, instance, info) => {
  existingErrorHandler?.(error, instance, info);
  captureException(error);
};

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder_key';
app.use(clerkPlugin, {
  publishableKey: clerkPublishableKey
});

app.mount('#app');

// Development verification helper
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__testSentryError = () => {
    Sentry.captureMessage('KSA Valuers Sentry Test Message');
    console.log('🧪 Triggering Sentry test exception...');
    throw new Error('KSA Valuers Sentry Verification Error');
  }
}
