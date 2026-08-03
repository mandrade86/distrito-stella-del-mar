import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact";
import { siteConfig } from "@/config/contact";
import { getAdminSession } from "@/lib/auth/admin";
import { dbAvailable, prisma } from "@/lib/db";
import { isSiteLive } from "@/lib/site-access";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const fromAddress =
  process.env.CONTACT_FROM_EMAIL || "Distrito Stella del Mar <onboarding@resend.dev>";
const toAddress = process.env.CONTACT_TO_EMAIL || siteConfig.email;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildEmailHtml(data: ContactFormValues) {
  const rows: [string, string][] = [
    ["Nombre completo", data.fullName],
    ["Empresa", data.company || "—"],
    ["Correo electrónico", data.email],
    ["Teléfono", data.phone],
    ["Tipo de interés", data.interest],
    ["Categoría de espacio", data.spaceCategory],
    ["Área aproximada (m²)", data.approxArea || "—"],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;color:#667481;font-size:13px;">${escapeHtml(
          label,
        )}</td><td style="padding:6px 12px;color:#1b2630;font-size:13px;font-weight:600;">${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f0e8;padding:24px;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e0d5;">
        <div style="background:#082f53;padding:20px 24px;">
          <p style="margin:0;color:#c5a15a;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">
            Distrito Stella del Mar
          </p>
          <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;">Nueva solicitud de contacto</h1>
        </div>
        <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
        <div style="padding:14px 24px 22px;">
          <p style="margin:0 0 6px;color:#667481;font-size:13px;">Mensaje</p>
          <p style="margin:0;color:#1b2630;font-size:14px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(
            data.message,
          )}</p>
        </div>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isSiteLive()) && !(await getAdminSession())) {
      return NextResponse.json(
        { ok: false, error: "Sitio no público." },
        { status: 403 },
      );
    }

    const body: unknown = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.info("[contact]", parsed.data);
    }

    if (await dbAvailable()) {
      try {
        await prisma.contactLead.create({
          data: {
            fullName: parsed.data.fullName,
            company: parsed.data.company || null,
            email: parsed.data.email,
            phone: parsed.data.phone,
            interest: parsed.data.interest,
            spaceCategory: parsed.data.spaceCategory,
            approxArea: parsed.data.approxArea || null,
            message: parsed.data.message,
          },
        });
      } catch (dbError) {
        console.error("[contact] db save error", dbError);
      }
    }

    if (resend) {
      const { error } = await resend.emails.send({
        from: fromAddress,
        to: toAddress,
        replyTo: parsed.data.email,
        subject: `Nueva solicitud: ${parsed.data.interest} — ${parsed.data.fullName}`,
        html: buildEmailHtml(parsed.data),
      });

      if (error) {
        console.error("[contact] resend error", error);
        return NextResponse.json({ ok: false }, { status: 502 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
