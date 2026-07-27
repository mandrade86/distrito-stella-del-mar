"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeIn } from "@/components/ui/FadeIn";
import {
  contactSchema,
  interestOptions,
  spaceCategoryOptions,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { cn } from "@/lib/utils";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("contacto").contact ?? {};

type Props = { copy?: SectionCopy };

export function Contact({ copy }: Props) {
  const text = { ...defaults, ...copy };
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      interest: "Información general",
      spaceCategory: "Por definir",
      privacy: false,
    },
  });

  useEffect(() => {
    const applyQuery = () => {
      const query =
        window.location.search ||
        window.location.hash.split("?")[1] ||
        "";
      const params = new URLSearchParams(query.replace(/^\?/, ""));
      const interes = params.get("interes");
      const espacio = params.get("espacio");
      if (interes && interestOptions.includes(interes as (typeof interestOptions)[number])) {
        setValue("interest", interes as ContactFormValues["interest"]);
      }
      if (espacio) {
        setValue(
          "message",
          `Me interesa recibir información sobre el espacio ${espacio}.`,
        );
      }
      if (interes === "Renta de espacio") {
        setValue("spaceCategory", "Renta de espacio");
      }
    };
    applyQuery();
    window.addEventListener("popstate", applyQuery);
    window.addEventListener("hashchange", applyQuery);
    return () => {
      window.removeEventListener("popstate", applyQuery);
      window.removeEventListener("hashchange", applyQuery);
    };
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("success");
      reset({
        interest: "Información general",
        spaceCategory: "Por definir",
        privacy: false,
      });
    } catch {
      setStatus("error");
    }
  });

  return (
    <section id="contacto" className="bg-sand section-y">
      <div className="section-pad container-site grid gap-10 lg:grid-cols-12 lg:gap-14">
        <FadeIn className="lg:col-span-5">
          <SectionTitle
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
          />
        </FadeIn>

        <FadeIn delay={0.08} className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            className="space-y-4 border border-navy/10 bg-white p-6 md:p-8"
            noValidate
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nombre completo" error={errors.fullName?.message}>
                <input
                  {...register("fullName")}
                  className={inputClass(errors.fullName)}
                  autoComplete="name"
                />
              </Field>
              <Field label="Empresa" error={errors.company?.message}>
                <input
                  {...register("company")}
                  className={inputClass(errors.company)}
                  autoComplete="organization"
                />
              </Field>
              <Field label="Correo electrónico" error={errors.email?.message}>
                <input
                  type="email"
                  {...register("email")}
                  className={inputClass(errors.email)}
                  autoComplete="email"
                />
              </Field>
              <Field label="Teléfono" error={errors.phone?.message}>
                <input
                  type="tel"
                  {...register("phone")}
                  className={inputClass(errors.phone)}
                  autoComplete="tel"
                />
              </Field>
              <Field label="Tipo de interés" error={errors.interest?.message}>
                <select {...register("interest")} className={inputClass(errors.interest)}>
                  {interestOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Categoría de espacio"
                error={errors.spaceCategory?.message}
              >
                <select
                  {...register("spaceCategory")}
                  className={inputClass(errors.spaceCategory)}
                >
                  {spaceCategoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field
              label="Área aproximada requerida (m²)"
              error={errors.approxArea?.message}
            >
              <input {...register("approxArea")} className={inputClass(errors.approxArea)} />
            </Field>

            <Field label="Mensaje" error={errors.message?.message}>
              <textarea
                rows={4}
                {...register("message")}
                className={inputClass(errors.message)}
              />
            </Field>

            <label className="flex items-start gap-3 text-sm text-charcoal">
              <input
                type="checkbox"
                className="mt-1"
                {...register("privacy")}
              />
              <span>
                Acepto la política de privacidad y el tratamiento de mis datos
                para fines de contacto comercial.
              </span>
            </label>
            {errors.privacy ? (
              <p className="text-sm text-red-700">{errors.privacy.message}</p>
            ) : null}

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center rounded-sm bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-deep-blue disabled:opacity-60 sm:w-auto"
            >
              {status === "loading" ? "Enviando…" : "Enviar solicitud"}
            </button>

            {status === "success" ? (
              <p className="text-sm text-ocean" role="status">
                Gracias. Su solicitud fue recibida correctamente.
              </p>
            ) : null}
            {status === "error" ? (
              <p className="text-sm text-red-700" role="alert">
                No pudimos enviar el formulario. Intenta de nuevo en unos
                minutos.
              </p>
            ) : null}
          </form>
        </FadeIn>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-navy">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-red-700">{error}</span> : null}
    </label>
  );
}

function inputClass(error?: { message?: string }) {
  return cn(
    "w-full rounded-sm border bg-off-white px-3 py-2.5 text-charcoal outline-none transition focus:border-ocean",
    error ? "border-red-400" : "border-navy/15",
  );
}
