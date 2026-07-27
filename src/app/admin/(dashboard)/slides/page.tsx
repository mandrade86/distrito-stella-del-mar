"use client";

import { AdminCrudTable } from "@/components/admin/AdminCrudTable";

export default function AdminSlidesPage() {
  return (
    <AdminCrudTable
      title="Hero slides"
      endpoint="/api/admin/slides"
      fields={[
        { name: "src", label: "Imagen", type: "image" },
        { name: "alt", label: "Texto alternativo" },
        { name: "sortOrder", label: "Orden", type: "number" },
        { name: "active", label: "Activo", type: "checkbox" },
      ]}
    />
  );
}
