"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@distritostelladelmar.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo iniciar sesión");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-navy/10 bg-white p-8 shadow-sm"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          CMS
        </p>
        <h1 className="mt-2 font-serif text-3xl text-navy">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-muted">
          Panel de administración de Distrito Stella del Mar.
        </p>
        <label className="mt-6 block text-sm">
          <span className="mb-1 block font-medium text-navy">Correo</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-navy/15 bg-off-white px-3 py-2"
          />
        </label>
        <label className="mt-4 block text-sm">
          <span className="mb-1 block font-medium text-navy">Contraseña</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-navy/15 bg-off-white px-3 py-2"
          />
        </label>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-sm bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
