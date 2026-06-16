import {
  BadgeDollarSign,
  CalendarCheck,
  MessageSquareText,
  RefreshCcw,
  Star,
} from "lucide-react";

const cards = [
  ["New leads", "8", "3 need a response"],
  ["Quotes pending", "$2.4k", "2 high intent"],
  ["Unpaid", "$1.15k", "1 overdue"],
  ["Reviews", "3", "ready to send"],
];

const actions = [
  { icon: MessageSquareText, text: "Reply to Julia's Botox consult" },
  { icon: BadgeDollarSign, text: "Send Bella's payment reminder" },
  { icon: CalendarCheck, text: "Confirm Camila's deposit" },
  { icon: Star, text: "Request Diana's Google review" },
];

export default function DashboardMockup3D() {
  return (
    <section className="relative overflow-hidden bg-[#0b0c0e] py-20 lg:py-28">
      <div className="absolute inset-0 ruut-grid-surface opacity-45" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div className="ruut-reveal">
            <p className="text-xs font-semibold uppercase text-emerald-300">
              Product preview
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-white md:text-4xl">
              A floating command center that makes the business loop visible.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-400">
              RuutPilot should feel tangible before login: leads, quotes,
              bookings, invoices, follow-ups, and reviews are connected in one
              workspace instead of scattered across tools.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Audit-ready", "Spa-specific", "Human-approved AI", "Revenue-first"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm font-medium text-zinc-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="ruut-perspective">
            <div className="ruut-glass ruut-gradient-border relative rounded-2xl border border-white/[0.08] p-3 [transform:rotateX(7deg)_rotateY(10deg)]">
              <div className="rounded-xl border border-white/[0.08] bg-[#101114]">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-300/70" />
                    <span className="size-2 rounded-full bg-amber-300/70" />
                    <span className="size-2 rounded-full bg-emerald-300/70" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500">
                    ruutpilot.app/command-center
                  </span>
                </div>

                <div className="grid gap-4 p-4 md:grid-cols-[1fr_0.8fr]">
                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      {cards.map(([label, value, sub]) => (
                        <div
                          key={label}
                          className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4"
                        >
                          <p className="text-xs text-zinc-500">{label}</p>
                          <p className="mt-2 text-2xl font-semibold text-white">
                            {value}
                          </p>
                          <p className="mt-1 text-xs text-emerald-200/80">
                            {sub}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#0b0c0e] p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">
                          Revenue recovered
                        </p>
                        <RefreshCcw className="h-4 w-4 text-emerald-200" />
                      </div>
                      <div className="h-24 rounded-xl bg-[linear-gradient(135deg,rgba(52,211,153,0.24),rgba(56,189,248,0.08)_45%,rgba(250,204,21,0.16))]" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-[#0b0c0e] p-4">
                    <p className="text-sm font-semibold text-white">
                      Next actions
                    </p>
                    <div className="mt-4 space-y-3">
                      {actions.map((action) => (
                        <div
                          key={action.text}
                          className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3"
                        >
                          <action.icon className="h-4 w-4 shrink-0 text-emerald-200" />
                          <p className="text-xs leading-5 text-zinc-300">
                            {action.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-8 h-8 w-3/4 rounded-[50%] bg-black/55 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
