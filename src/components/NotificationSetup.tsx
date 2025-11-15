import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { supabase } from "@/lib/supabaseClient";

// Your Firebase config and VAPID key
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
const VAPID_KEY = "YOUR_VAPID_KEY";

export function NotificationSetup() {
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enableNotifications() {
    // Only run this code in the browser!
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      setError("Must run in browser with serviceWorker support.");
      return;
    }
    // Check login first:
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must sign in before enabling notifications.");
      return;
    }
    try {
      // Initialize Firebase app and get messaging
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Notification permission denied");

      // Get FCM token
      const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: await navigator.serviceWorker.ready });

      // Save token to Supabase users table
      await supabase.from("users").update({ fcm_token: token }).eq("id", user.id);

      setEnabled(true);
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
    }
  }

  return (
    <div>
      <button onClick={enableNotifications}>Enable Notifications</button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {enabled && <div style={{ color: "green", marginTop: 8 }}>Notifications enabled!</div>}
    </div>
  );
}
