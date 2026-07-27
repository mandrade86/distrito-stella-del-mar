"use client";

import { AdminCrudTable } from "@/components/admin/AdminCrudTable";

export default function AdminSpacesPage() {
  return (
    <AdminCrudTable
      title="Locales comerciales"
      endpoint="/api/admin/spaces"
      fields={[
        { name: "code", label: "Código" },
        { name: "name", label: "Nombre" },
        {
          name: "category",
          label: "Categoría",
          type: "select",
          options: [
            "plaza",
            "local",
            "food-court",
            "quiosco",
            "financiero",
            "autoservicio",
            "convenciones",
          ],
        },
        { name: "area", label: "Área m²", type: "number" },
        { name: "phase", label: "Fase", type: "number" },
        { name: "level", label: "Nivel" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: ["Disponible", "Vendido", "Rentado", "Reservado"],
        },
        { name: "featured", label: "Destacado", type: "checkbox" },
        { name: "image", label: "Imagen", type: "image" },
        { name: "sortOrder", label: "Orden", type: "number" },
      ]}
    />
  );
}
