import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { supabase } from "@/lib/supabaseClient";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;

export function NotificationSetup() {
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enableNotifications() {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      setError("Must run in browser with serviceWorker support.");
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must sign in before enabling notifications.");
      return;
    }
    try {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Notification permission denied");

      const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: await navigator.serviceWorker.ready });
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
