import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createApp } from './app';

initializeApp();
const db = getFirestore();

const expressApp = createApp(db);

export const api = onRequest(
  {
    memory: '256MiB',
    timeoutSeconds: 30,
    region: 'us-central1',
    minInstances: 0,
    cors: ['https://task-manager-challenge-a56e2.web.app', 'http://localhost:4200'],
    invoker: 'public',
  },
  expressApp
);
