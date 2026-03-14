import { z } from "zod";

export const patientInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  mrn: z.string().optional(),
});

export const providerInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  specialty: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  npi: z.string().optional(),
});

export const consentInputSchema = z.object({
  patientId: z.string().uuid(),
  status: z.string().min(1),
  scope: z.string().min(1),
  categories: z.array(z.string()).min(1),
});

export const webhookInputSchema = z.object({
  name: z.string().min(1),
  targetUrl: z.string().url(),
  events: z.array(z.string()).min(1),
});

export const apiKeyInputSchema = z.object({
  name: z.string().min(1),
  permissions: z.array(z.string()).default([]),
});

export const organizationInputSchema = z.object({
  name: z.string().min(2),
});

export const authActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("login"),
    email: z.string().email(),
    password: z.string().min(1),
  }),
  z.object({
    action: z.literal("logout"),
  }),
]);
