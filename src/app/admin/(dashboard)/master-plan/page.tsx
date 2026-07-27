"use client";

import { AdminCrudTable } from "@/components/admin/AdminCrudTable";

export default function AdminMasterPlanPage() {
  return (
    <AdminCrudTable
      title="Master Plan"
      endpoint="/api/admin/master-plan"
      fields={[
        { name: "tabId", label: "ID pestaña (general/phase1/phase2)" },
        { name: "label", label: "Etiqueta" },
        { name: "title", label: "Título" },
        { name: "description", label: "Descripción", type: "textarea" },
        { name: "image", label: "Imagen principal (thumbnail)", type: "image" },
        { name: "imageAlt", label: "Alt imagen" },
        {
          name: "gallery",
          label: "Galería de fotos",
          type: "images",
        },
        {
          name: "highlights",
          label: "Highlights (uno por línea)",
          type: "textarea",
        },
        { name: "sortOrder", label: "Orden", type: "number" },
      ]}
    />
  );
}
