import { z } from "zod";

const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""));

export const auditRequestSchema = z.object({
  business_name: z.string().trim().min(2).max(120),
  owner_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: optionalText(60),
  website: optionalText(180),
  city: optionalText(120),
  business_type: z.string().trim().min(2).max(80),
  leads_per_week: optionalText(80),
  lead_sources: z.array(z.string().trim().min(1).max(60)).max(10),
  response_time: optionalText(120),
  quote_process: optionalText(120),
  deposits_required: optionalText(80),
  unpaid_invoices: optionalText(80),
  review_process: optionalText(120),
  current_tools: optionalText(500),
  biggest_pain: z.string().trim().min(10).max(1200),
  preferred_call_time: optionalText(160),
  extra_notes: optionalText(1200),
  hp: optionalText(80),
});

export type AuditRequestInput = z.infer<typeof auditRequestSchema>;

export function toAuditInsert(values: AuditRequestInput) {
  const { hp, ...payload } = values;
  void hp;

  return {
    ...payload,
    phone: payload.phone || null,
    website: payload.website || null,
    city: payload.city || null,
    leads_per_week: payload.leads_per_week || null,
    lead_sources: payload.lead_sources ?? [],
    response_time: payload.response_time || null,
    quote_process: payload.quote_process || null,
    deposits_required: payload.deposits_required || null,
    unpaid_invoices: payload.unpaid_invoices || null,
    review_process: payload.review_process || null,
    current_tools: payload.current_tools || null,
    preferred_call_time: payload.preferred_call_time || null,
    extra_notes: payload.extra_notes || null,
  };
}
