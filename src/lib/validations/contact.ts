import { z } from "zod";

export const interestOptions = [
  "Alquiler de local",
  "Compra de espacio",
  "Franquicia",
  "Restaurante o cafetería",
  "Institución financiera",
  "Quiosco",
  "Renta de espacio",
  "Inversión",
  "Información general",
] as const;

export const spaceCategoryOptions = [
  "Plaza abierta",
  "Local comercial",
  "Food Court",
  "Quiosco",
  "Área financiera",
  "Autoservicio",
  "Renta de espacio",
  "Por definir",
] as const;

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Ingrese su nombre completo"),
  company: z.string().trim().optional(),
  email: z.string().trim().email("Correo electrónico inválido"),
  phone: z
    .string()
    .trim()
    .min(7, "Ingrese un teléfono válido")
    .max(30, "Teléfono demasiado largo"),
  interest: z.enum(interestOptions),
  spaceCategory: z.enum(spaceCategoryOptions),
  approxArea: z.string().trim().optional(),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres)")
    .max(2000, "El mensaje es demasiado largo"),
  privacy: z
    .boolean()
    .refine((value) => value === true, {
      message: "Debes aceptar la política de privacidad",
    }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
