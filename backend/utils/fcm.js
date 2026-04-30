const admin = require('firebase-admin');

let initialized = false;

function initFirebase() {
  if (initialized || admin.apps.length > 0) {
    initialized = true;
    return;
  }
  try {
    // In production (Vercel), FIREBASE_SERVICE_ACCOUNT env var holds the JSON string
    // Locally, fall back to serviceAccountKey.json file
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      serviceAccount = require('../serviceAccountKey.json');
    }
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    initialized = true;
  } catch (err) {
    console.warn('[FCM] Firebase not initialized:', err.message);
  }
}

initFirebase();

exports.sendPushNotification = async ({ token, title, body, data = {} }) => {
  if (!initialized || !token) return;
  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
      data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
      android: { priority: 'high', notification: { sound: 'default', channelId: 'duty_assignments' } },
    });
  } catch (err) {
    console.warn('[FCM] Send failed:', err.message);
  }
};
