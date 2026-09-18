import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { createMetaManager } from 'vue-meta';
import { clerkPlugin } from '@clerk/vue';
import { posthogPlugin } from './plugins/posthog';

import './assets/tailwind.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(createMetaManager());
app.use(posthogPlugin);

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder_key';
app.use(clerkPlugin, {
  publishableKey: clerkPublishableKey
});

app.mount('#app');
