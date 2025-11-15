import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");

  async function sendOtp() {
    setError("");
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else setCodeSent(true);
  }

  return (
    <div>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your Email" />
      <button onClick={sendOtp}>Send Magic Link</button>
      {codeSent && <span>Check your email for the login link!</span>}
      {error && <span style={{color:"red"}}>{error}</span>}
    </div>
  );
}
