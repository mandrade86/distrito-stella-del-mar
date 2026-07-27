"use client";

import { AdminCrudTable } from "@/components/admin/AdminCrudTable";

export default function AdminBrandsPage() {
  return (
    <AdminCrudTable
      title="Marcas ancla"
      endpoint="/api/admin/brands"
      fields={[
        { name: "name", label: "Nombre" },
        { name: "logo", label: "Logo", type: "image" },
        { name: "logoScale", label: "Escala", type: "number" },
        { name: "note", label: "Nota", type: "textarea" },
        { name: "sortOrder", label: "Orden", type: "number" },
        { name: "active", label: "Activo", type: "checkbox" },
      ]}
    />
  );
}
