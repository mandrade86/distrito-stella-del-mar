"use client";

import { AdminCrudTable } from "@/components/admin/AdminCrudTable";

export default function AdminGalleryPage() {
  return (
    <AdminCrudTable
      title="Galería"
      endpoint="/api/admin/gallery"
      fields={[
        { name: "src", label: "Imagen", type: "image" },
        { name: "alt", label: "Texto alternativo", type: "textarea" },
        {
          name: "span",
          label: "Formato",
          type: "select",
          options: ["square", "wide", "tall"],
        },
        { name: "sortOrder", label: "Orden", type: "number" },
        { name: "active", label: "Activo", type: "checkbox" },
      ]}
    />
  );
}
