"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  interest: string;
  spaceCategory: string;
  message: string;
  createdAt: string;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/leads");
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "No se pudieron cargar los contactos");
        return;
      }
      setLeads(json.data ?? []);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-navy">Contactos recibidos</h1>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="overflow-x-auto border border-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sand/60 text-xs uppercase tracking-wide text-navy">
            <tr>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Correo</th>
              <th className="px-3 py-2">Teléfono</th>
              <th className="px-3 py-2">Interés</th>
              <th className="px-3 py-2">Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-navy/10 align-top">
                <td className="px-3 py-2 whitespace-nowrap">
                  {new Date(lead.createdAt).toLocaleString("es-HN")}
                </td>
                <td className="px-3 py-2">{lead.fullName}</td>
                <td className="px-3 py-2">{lead.email}</td>
                <td className="px-3 py-2">{lead.phone}</td>
                <td className="px-3 py-2">{lead.interest}</td>
                <td className="max-w-xs px-3 py-2 text-muted">{lead.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
