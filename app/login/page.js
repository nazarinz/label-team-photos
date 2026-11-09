"use client";
import { useState } from "react";

export default function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (r.ok) {
      location.href = "/";
    } else {
      setErr("Password salah. Coba lagi.");
      setBusy(false);
    }
  }

  return (
    <main className="login">
      <form onSubmit={submit}>
        <h1>Label Team Photos</h1>
        <p>Masukkan password tim untuk membuka galeri.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password tim"
          autoFocus
          required
        />
        {err && <p className="err">{err}</p>}
        <button className="btn" disabled={busy}>
          {busy ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </main>
  );
}
