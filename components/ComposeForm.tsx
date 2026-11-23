"use client";

import { useState } from "react";

type Status = { kind: "ok" | "err"; text: string } | null;

export default function ComposeForm() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        window.location.href = "/?error=1";
        return;
      }
      if (!res.ok) {
        setStatus({ kind: "err", text: data.error ?? "Xatolik yuz berdi." });
      } else {
        setStatus({ kind: "ok", text: `Yuborildi: ${data.sent} ta xat ✓` });
        setTo("");
        setSubject("");
        setBody("");
      }
    } catch {
      setStatus({ kind: "err", text: "Internet bilan muammo. Qayta urinib ko'ring." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Kimga</span>
        <input
          className="field"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="ali@gmail.com, vali@mail.ru"
          autoComplete="off"
          required
        />
        <span className="mt-1 block text-xs text-muted">Bir nechta manzilni vergul bilan ajrating.</span>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Mavzu</span>
        <input className="field" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Salom!" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Xat matni</span>
        <textarea
          className="field min-h-56 resize-y"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Assalomu alaykum..."
          required
        />
      </label>

      {status && (
        <p
          role={status.kind === "err" ? "alert" : "status"}
          className="rounded-xl border border-line px-4 py-3 text-sm"
          style={{ color: status.kind === "ok" ? "var(--ok)" : "var(--err)" }}
        >
          {status.text}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
        {loading ? "Yuborilmoqda…" : "Yuborish"}
      </button>
    </form>
  );
}
