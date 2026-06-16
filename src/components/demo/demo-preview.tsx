"use client";

import {
  ClipboardList,
  MessageSquareText,
  Quote,
  RefreshCcw,
  Star,
} from "lucide-react";
import { useState } from "react";

const tabs = [
  "Command Center",
  "Revenue Radar",
  "Lead Inbox",
  "Quote Builder",
  "Follow-Up Center",
  "Review Requests",
] as const;

const priorities = [
  ["Ana Rivera", "$450 quote pending", "Send AI follow-up"],
  ["Bella Skin Co.", "$275 invoice overdue", "Send payment reminder"],
  ["Camila M.", "Consultation tomorrow", "Confirm deposit"],
  ["Diana P.", "Service completed yesterday", "Request Google review"],
] as const;

export default function DemoPreview() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Command Center");

  return (
    <div className="ruut-perspective">
      <div className="ruut-gradient-border ruut-glass rounded-2xl border border-white/[0.08] p-2 [transform:rotateX(3deg)]">
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#111217]">
          <div className="flex flex-col gap-3 border-b border-white/[0.08] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="shrink-0">
              <p className="text-sm font-semibold text-white">
                RuutPilot Demo
              </p>
              <p className="text-xs text-zinc-500">Example Spa workspace</p>
            </div>
            <div
              aria-label="Demo sections"
              role="tablist"
              className="ruut-no-scrollbar grid max-w-full grid-cols-2 gap-2 sm:flex sm:overflow-x-auto sm:overscroll-x-contain sm:pb-1 lg:justify-end"
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active === tab}
                  onClick={() => setActive(tab)}
                  className={`h-8 w-full shrink-0 whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-emerald-200 sm:w-auto ${
                    active === tab
                      ? "bg-emerald-300 text-zinc-950"
                      : "border border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.07]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {active === "Command Center" ? <CommandCenter /> : null}
            {active === "Revenue Radar" ? <RevenueRadar /> : null}
            {active === "Lead Inbox" ? <LeadInbox /> : null}
            {active === "Quote Builder" ? <QuoteBuilder /> : null}
            {active === "Follow-Up Center" ? <FollowUpCenter /> : null}
            {active === "Review Requests" ? <ReviewRequests /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function CommandCenter() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-5">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-emerald-300" />
          <h2 className="text-lg font-semibold text-white">
            Today&apos;s priorities
          </h2>
        </div>
        <div className="mt-5 space-y-3">
          {priorities.map(([name, reason, action]) => (
            <div
              key={name}
              className="ruut-card-3d flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className="text-sm text-zinc-400">{reason}</p>
              </div>
              <button className="h-9 rounded-xl bg-white px-3 text-xs font-semibold text-zinc-950">
                {action}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-5">
        <h3 className="text-sm font-semibold text-white">AI focus</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Focus on 5 revenue actions today: follow up on two quotes, confirm
          tomorrow&apos;s deposits, send one overdue payment reminder, and request
          reviews from completed appointments.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            ["$7,820", "monthly collected"],
            ["$3,550", "stuck revenue"],
            ["8", "new leads"],
            ["4", "reviews pending"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-xl bg-white/[0.04] p-3">
              <p className="text-xl font-semibold text-white">{value}</p>
              <p className="text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevenueRadar() {
  const items = [
    ["$2,400", "Quotes not followed up", "Send follow-up", "text-amber-300"],
    ["$1,150", "Unpaid invoices", "Send reminder", "text-red-300"],
    ["8", "Leads older than 24h", "Assign response", "text-sky-300"],
    ["5", "Clients ready to reactivate", "Draft campaign", "text-emerald-300"],
    ["3", "Missing review requests", "Ask for review", "text-violet-300"],
    ["2", "Appointments without deposit", "Send deposit link", "text-orange-300"],
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map(([value, label, action, tone]) => (
        <div key={label} className="ruut-card-3d rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-5">
          <p className={`text-3xl font-semibold ${tone}`}>{value}</p>
          <p className="mt-2 text-sm text-zinc-300">{label}</p>
          <button className="mt-5 h-9 rounded-xl border border-white/[0.10] px-3 text-xs font-semibold text-white">
            {action}
          </button>
        </div>
      ))}
    </div>
  );
}

function LeadInbox() {
  const columns: Array<[string, string[]]> = [
    ["New", ["Julia - Botox consult", "Maribel - HydraFacial"]],
    ["Contacted", ["Sandra - laser package", "Nina - skincare plan"]],
    ["Quote Sent", ["Ana - $450 facial package", "Luz - $900 bridal prep"]],
    ["Booked", ["Camila - Saturday 11 AM", "Bianca - deposit paid"]],
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {columns.map(([column, leads]) => (
        <div key={column} className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-4">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-emerald-300" />
            <h3 className="text-sm font-semibold text-white">{column}</h3>
          </div>
          <div className="space-y-3">
            {leads.map((lead) => (
              <div key={lead} className="rounded-xl bg-white/[0.04] p-3">
                <p className="text-sm text-white">{lead}</p>
                <p className="mt-1 text-xs text-zinc-500">Next action ready</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuoteBuilder() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-5">
        <div className="flex items-center gap-2">
          <Quote className="h-5 w-5 text-emerald-300" />
          <h2 className="text-lg font-semibold text-white">
            Facial Treatment Package
          </h2>
        </div>
        <div className="mt-5 space-y-3">
          {[
            ["Initial consultation", "$75"],
            ["Treatment session", "$250"],
            ["Aftercare kit", "$125"],
          ].map(([name, price]) => (
            <div key={name} className="flex justify-between border-b border-white/[0.08] pb-3 text-sm">
              <span className="text-zinc-300">{name}</span>
              <span className="font-semibold text-white">{price}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl bg-emerald-300/10 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-300">Deposit required</span>
            <span className="font-semibold text-emerald-200">$75</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-zinc-300">Quote total</span>
            <span className="font-semibold text-white">$450</span>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-5">
        <h3 className="text-sm font-semibold text-white">AI description</h3>
        <p className="mt-3 text-sm leading-7 text-zinc-300">
          This package includes a personalized consultation, a targeted facial
          treatment, and an aftercare kit selected for your skin goals. A $75
          deposit secures your appointment and is applied toward the final
          balance.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button className="rounded-xl bg-emerald-300 px-3 py-2 text-xs font-semibold text-zinc-950">
            Copy quote link
          </button>
          <button className="rounded-xl border border-white/[0.10] px-3 py-2 text-xs font-semibold text-white">
            Convert to booking
          </button>
          <button className="rounded-xl border border-white/[0.10] px-3 py-2 text-xs font-semibold text-white">
            Send follow-up
          </button>
        </div>
      </div>
    </div>
  );
}

function FollowUpCenter() {
  const groups = [
    ["Overdue", "Bella has a $275 invoice overdue by 4 days.", "$275"],
    ["Due today", "Ana received a $450 quote 3 days ago.", "$450"],
    ["Upcoming", "Luz has not booked again in 45 days.", "$300 est."],
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {groups.map(([status, reason, value]) => (
        <div key={status} className="ruut-card-3d rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-5">
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 text-emerald-300" />
            <p className="text-sm font-semibold text-white">{status}</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">{reason}</p>
          <p className="mt-3 text-xs text-zinc-500">Potential revenue</p>
          <p className="text-xl font-semibold text-white">{value}</p>
          <button className="mt-5 h-9 rounded-xl bg-white px-3 text-xs font-semibold text-zinc-950">
            Generate message
          </button>
        </div>
      ))}
    </div>
  );
}

function ReviewRequests() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-5">
        <Star className="h-5 w-5 text-amber-300" />
        <h2 className="mt-4 text-lg font-semibold text-white">
          Completed services missing reviews
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Three clients completed services yesterday and have no review request
          logged. RuutPilot keeps the request human-approved in v1.
        </p>
      </div>
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-5">
        <h3 className="text-sm font-semibold text-white">Suggested request</h3>
        <p className="mt-3 rounded-xl bg-white/[0.04] p-4 text-sm leading-7 text-zinc-300">
          Hi Diana, thank you for visiting Example Spa yesterday. If you loved
          your treatment, would you mind sharing a quick Google review? It helps
          local clients feel confident booking with us.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button className="rounded-xl bg-emerald-300 px-3 py-2 text-xs font-semibold text-zinc-950">
            Copy message
          </button>
          <button className="rounded-xl border border-white/[0.10] px-3 py-2 text-xs font-semibold text-white">
            Mark sent
          </button>
        </div>
      </div>
    </div>
  );
}
