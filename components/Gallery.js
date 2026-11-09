"use client";
import { useEffect, useMemo, useState } from "react";
import { upload } from "@vercel/blob/client";

const slug = (s) =>
  s.trim().toLowerCase().replace(/[^a-z0-9\-_ ]/g, "").replace(/\s+/g, "-");
const kb = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.round(n / 1024) + " KB");

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");
  const [album, setAlbum] = useState("");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [view, setView] = useState(null);

  async function load() {
    try {
      const r = await fetch("/api/photos");
      if (r.status === 401) return (location.href = "/login");
      const d = await r.json();
      setPhotos(d.photos || []);
    } catch {
      setErr("Foto gagal dimuat. Muat ulang halaman.");
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const albums = useMemo(() => [...new Set(photos.map((p) => p.album))].sort(), [photos]);
  const shown = filter === "Semua" ? photos : photos.filter((p) => p.album === filter);

  async function onFiles(e) {
    const files = [...e.target.files];
    e.target.value = "";
    if (!files.length) return;
    const a = slug(album) || "umum";
    setErr("");
    for (let i = 0; i < files.length; i++) {
      setBusy(`Mengunggah ${i + 1} dari ${files.length}…`);
      try {
        await upload(`photos/${a}/${files[i].name}`, files[i], {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
      } catch {
        setErr(`Gagal mengunggah ${files[i].name}. Pastikan formatnya gambar dan ukurannya di bawah 30 MB.`);
      }
    }
    setBusy("");
    load();
  }

  async function remove(p) {
    if (!confirm(`Hapus ${p.name}? Foto tidak bisa dikembalikan.`)) return;
    await fetch("/api/photos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: p.url }),
    });
    setView(null);
    setPhotos((x) => x.filter((i) => i.url !== p.url));
  }

  async function logout() {
    await fetch("/api/login", { method: "DELETE" });
    location.href = "/login";
  }

  return (
    <main className="wrap">
      <header className="top">
        <h1>Label Team Photos</h1>
        <button className="link" onClick={logout}>Keluar</button>
      </header>

      <section className="uploader">
        <label>
          Album
          <input
            list="albums"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            placeholder="mis. event-juni (kosong = umum)"
          />
          <datalist id="albums">
            {albums.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </label>
        <label className={"btn" + (busy ? " off" : "")}>
          {busy || "Pilih foto"}
          <input type="file" accept="image/*" multiple hidden disabled={!!busy} onChange={onFiles} />
        </label>
      </section>
      {err && <p className="err">{err}</p>}

      <nav className="tabs">
        {["Semua", ...albums].map((a) => (
          <button key={a} className={a === filter ? "on" : ""} onClick={() => setFilter(a)}>
            {a}
          </button>
        ))}
      </nav>

      {loading ? (
        <p className="empty">Memuat foto…</p>
      ) : shown.length === 0 ? (
        <p className="empty">Belum ada foto. Isi nama album, lalu pilih foto untuk diunggah.</p>
      ) : (
        <div className="grid">
          {shown.map((p) => (
            <figure key={p.url} onClick={() => setView(p)}>
              <img src={p.url} alt={p.name} loading="lazy" />
              <figcaption>
                <span>{p.album}</span>
                <span>{kb(p.size)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {view && (
        <div className="lb" onClick={() => setView(null)}>
          <div className="box" onClick={(e) => e.stopPropagation()}>
            <img src={view.url} alt={view.name} />
            <div className="bar">
              <span>{view.album} · {view.name}</span>
              <a className="link" href={view.url} download target="_blank" rel="noreferrer">Unduh</a>
              <button className="link danger" onClick={() => remove(view)}>Hapus</button>
              <button className="link" onClick={() => setView(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
