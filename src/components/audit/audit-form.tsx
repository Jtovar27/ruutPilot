"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { auditRequestSchema, type AuditRequestInput } from "@/lib/audit";

const leadSourceOptions = [
  "Website",
  "Instagram",
  "Facebook",
  "Google Business",
  "Phone calls",
  "Text messages",
  "Referrals",
  "Walk-ins",
];

const fieldClass =
  "h-10 rounded-lg border-white/[0.12] bg-white/[0.04] text-white placeholder:text-zinc-600";

const selectClass =
  "h-10 w-full rounded-lg border border-white/[0.12] bg-[#101014] px-3 text-sm text-white outline-none transition-colors focus:border-emerald-300 focus:ring-3 focus:ring-emerald-300/20";

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-300">{message}</p>;
}

export default function AuditForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AuditRequestInput>({
    resolver: zodResolver(auditRequestSchema),
    defaultValues: {
      business_name: "",
      owner_name: "",
      email: "",
      phone: "",
      website: "",
      city: "",
      business_type: "Med spa",
      leads_per_week: "",
      lead_sources: [],
      response_time: "",
      quote_process: "",
      deposits_required: "",
      unpaid_invoices: "",
      review_process: "",
      current_tools: "",
      biggest_pain: "",
      preferred_call_time: "",
      extra_notes: "",
      hp: "",
    },
  });

  const selectedSources = useWatch({ control, name: "lead_sources" }) ?? [];

  const progress = useMemo(() => (step === 1 ? "50%" : "100%"), [step]);

  const toggleSource = (source: string) => {
    const next = selectedSources.includes(source)
      ? selectedSources.filter((item) => item !== source)
      : [...selectedSources, source];

    setValue("lead_sources", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const goNext = async () => {
    const valid = await trigger([
      "business_name",
      "owner_name",
      "email",
      "business_type",
      "biggest_pain",
    ]);

    if (valid) setStep(2);
  };

  const onSubmit = async (values: AuditRequestInput) => {
    setSubmitError(null);

    const response = await fetch("/api/audit-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setSubmitError(
        data?.error ?? "The audit request could not be submitted."
      );
      return;
    }

    router.push("/thank-you");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="ruut-gradient-border ruut-glass rounded-2xl border border-white/[0.08] p-5 shadow-2xl shadow-black/25 sm:p-6"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Step {step} of 2</span>
          <span>{step === 1 ? "Business snapshot" : "Revenue gaps"}</span>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-emerald-300 transition-all"
            style={{ width: progress }}
          />
        </div>
      </div>

      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        {...register("hp")}
      />

      {step === 1 ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="business_name" className="text-zinc-200">
                Business name
              </Label>
              <Input
                id="business_name"
                className={`${fieldClass} transition-colors focus-visible:border-emerald-300`}
                placeholder="Example Med Spa"
                {...register("business_name")}
              />
              <ErrorText message={errors.business_name?.message} />
            </div>
            <div>
              <Label htmlFor="business_type" className="text-zinc-200">
                Business type
              </Label>
              <select
                id="business_type"
                className={selectClass}
                {...register("business_type")}
              >
                <option>Med spa</option>
                <option>Beauty spa</option>
                <option>Esthetician</option>
                <option>Salon</option>
                <option>Wellness clinic</option>
                <option>Other service business</option>
              </select>
              <ErrorText message={errors.business_type?.message} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="owner_name" className="text-zinc-200">
                Owner or manager
              </Label>
              <Input
                id="owner_name"
                className={`${fieldClass} transition-colors focus-visible:border-emerald-300`}
                placeholder="Maria Santos"
                {...register("owner_name")}
              />
              <ErrorText message={errors.owner_name?.message} />
            </div>
            <div>
              <Label htmlFor="email" className="text-zinc-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className={`${fieldClass} transition-colors focus-visible:border-emerald-300`}
                placeholder="owner@example.com"
                {...register("email")}
              />
              <ErrorText message={errors.email?.message} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="phone" className="text-zinc-200">
                Phone
              </Label>
              <Input
                id="phone"
                className={`${fieldClass} transition-colors focus-visible:border-emerald-300`}
                placeholder="(407) 555-0199"
                {...register("phone")}
              />
            </div>
            <div>
              <Label htmlFor="website" className="text-zinc-200">
                Website
              </Label>
              <Input
                id="website"
                className={`${fieldClass} transition-colors focus-visible:border-emerald-300`}
                placeholder="https://example.com"
                {...register("website")}
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-zinc-200">
                City
              </Label>
              <Input
                id="city"
                className={fieldClass}
                placeholder="Orlando, FL"
                {...register("city")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="biggest_pain" className="text-zinc-200">
              What feels most broken in your current operations?
            </Label>
            <Textarea
              id="biggest_pain"
              className="min-h-28 rounded-lg border-white/[0.12] bg-white/[0.04] text-white transition-colors placeholder:text-zinc-600 focus-visible:border-emerald-300"
              placeholder="Example: Leads come in from Instagram and the website, but follow-up depends on memory. Quotes are sent manually and deposits are inconsistent."
              {...register("biggest_pain")}
            />
            <ErrorText message={errors.biggest_pain?.message} />
          </div>

          <Button
            type="button"
            onClick={goNext}
            className="h-10 w-full rounded-xl bg-emerald-300 text-zinc-950 shadow-lg shadow-emerald-300/15 hover:bg-emerald-200 sm:w-auto"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="leads_per_week" className="text-zinc-200">
                Leads per week
              </Label>
              <select
                id="leads_per_week"
                className={selectClass}
                {...register("leads_per_week")}
              >
                <option value="">Select a range</option>
                <option>1-5</option>
                <option>6-15</option>
                <option>16-30</option>
                <option>31-60</option>
                <option>60+</option>
              </select>
            </div>
            <div>
              <Label htmlFor="response_time" className="text-zinc-200">
                Typical lead response time
              </Label>
              <select
                id="response_time"
                className={selectClass}
                {...register("response_time")}
              >
                <option value="">Select one</option>
                <option>Under 15 minutes</option>
                <option>Same day</option>
                <option>1-2 days</option>
                <option>More than 2 days</option>
                <option>Not tracked</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-zinc-200">Where do leads come from?</Label>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {leadSourceOptions.map((source) => {
                const active = selectedSources.includes(source);

                return (
                  <button
                    key={source}
                    type="button"
                    onClick={() => toggleSource(source)}
                    className={`flex h-10 items-center justify-between rounded-lg border px-3 text-left text-sm transition-colors ${
                      active
                        ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-100"
                        : "border-white/[0.10] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                    }`}
                  >
                    {source}
                    {active ? <Check className="h-4 w-4" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="quote_process" className="text-zinc-200">
                Quote process
              </Label>
              <select
                id="quote_process"
                className={selectClass}
                {...register("quote_process")}
              >
                <option value="">Select one</option>
                <option>Verbal or text only</option>
                <option>Manual PDF or email</option>
                <option>Software quote</option>
                <option>No consistent process</option>
              </select>
            </div>
            <div>
              <Label htmlFor="deposits_required" className="text-zinc-200">
                Deposit process
              </Label>
              <select
                id="deposits_required"
                className={selectClass}
                {...register("deposits_required")}
              >
                <option value="">Select one</option>
                <option>Required for most bookings</option>
                <option>Required sometimes</option>
                <option>Not required</option>
                <option>Not consistent</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="unpaid_invoices" className="text-zinc-200">
                Unpaid invoices or balances
              </Label>
              <select
                id="unpaid_invoices"
                className={selectClass}
                {...register("unpaid_invoices")}
              >
                <option value="">Select one</option>
                <option>None or rare</option>
                <option>Some each month</option>
                <option>Frequently overdue</option>
                <option>Not tracked clearly</option>
              </select>
            </div>
            <div>
              <Label htmlFor="review_process" className="text-zinc-200">
                Review request process
              </Label>
              <select
                id="review_process"
                className={selectClass}
                {...register("review_process")}
              >
                <option value="">Select one</option>
                <option>Automated</option>
                <option>Manual after appointments</option>
                <option>Only when remembered</option>
                <option>No process</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="current_tools" className="text-zinc-200">
              Current tools
            </Label>
            <Input
              id="current_tools"
              className={fieldClass}
              placeholder="Square, Calendly, Google Sheets, Notes, Instagram DMs..."
              {...register("current_tools")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="preferred_call_time" className="text-zinc-200">
                Preferred call time
              </Label>
              <Input
                id="preferred_call_time"
                className={`${fieldClass} transition-colors focus-visible:border-emerald-300`}
                placeholder="Weekdays after 2 PM"
                {...register("preferred_call_time")}
              />
            </div>
            <div>
              <Label htmlFor="extra_notes" className="text-zinc-200">
                Extra notes
              </Label>
              <Input
                id="extra_notes"
                className={`${fieldClass} transition-colors focus-visible:border-emerald-300`}
                placeholder="Anything else I should know?"
                {...register("extra_notes")}
              />
            </div>
          </div>

          {submitError ? (
            <div className="rounded-lg border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm text-red-100">
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="h-10 rounded-xl border-white/[0.12] bg-white/[0.03] text-white hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-xl bg-emerald-300 text-zinc-950 shadow-lg shadow-emerald-300/15 hover:bg-emerald-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                <>
                  Request audit
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
