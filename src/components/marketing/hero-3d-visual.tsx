import {
  CalendarCheck,
  CircleDollarSign,
  MessageSquareText,
  Sparkles,
  Star,
} from "lucide-react";

const radarRows = [
  ["Quotes pending", "$2,400", "78%"],
  ["Unpaid balances", "$1,150", "42%"],
  ["Clients to reactivate", "5", "61%"],
];

const railItems = [
  { icon: MessageSquareText, label: "Lead", color: "text-emerald-200" },
  { icon: CalendarCheck, label: "Booking", color: "text-sky-200" },
  { icon: CircleDollarSign, label: "Payment", color: "text-amber-200" },
  { icon: Star, label: "Review", color: "text-rose-200" },
];

export default function Hero3DVisual() {
  return (
    <div className="ruut-perspective relative mx-auto w-full max-w-2xl lg:mr-0">
      <div className="absolute inset-x-10 -bottom-8 h-16 rounded-[50%] bg-emerald-400/10 blur-2xl" />
      <div className="ruut-float ruut-gradient-border ruut-glass relative overflow-hidden rounded-2xl border border-white/[0.08] p-3 [transform:rotateX(9deg)_rotateY(-13deg)_rotateZ(1deg)]">
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0d10]/92">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-red-300/80" />
              <span className="size-2 rounded-full bg-amber-300/80" />
              <span className="size-2 rounded-full bg-emerald-300/80" />
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold text-emerald-100">
              Revenue Command
            </span>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-[0.74fr_1.26fr]">
            <div className="space-y-3">
              {railItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-3"
                >
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-xs font-semibold text-zinc-200">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#121317] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Revenue Leakage Radar
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Example Spa - live priorities
                  </p>
                </div>
                <Sparkles className="h-5 w-5 text-emerald-200" />
              </div>

              <div className="mt-5 space-y-3">
                {radarRows.map(([label, value, width]) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                      <span className="text-zinc-400">{label}</span>
                      <span className="font-semibold text-white">{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-sky-300 to-amber-200"
                        style={{ width }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                <p className="text-xs font-semibold text-emerald-100">
                  AI next action
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-200">
                  Follow up on Ana&apos;s $450 quote and send a deposit link
                  before the weekend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ruut-float-delayed absolute -left-2 top-14 hidden rounded-xl border border-white/[0.10] bg-[#111217]/85 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:block">
        <p className="text-[11px] font-semibold uppercase text-zinc-500">
          Response target
        </p>
        <p className="mt-1 text-xl font-semibold text-white">12 min</p>
      </div>

      <div className="ruut-float absolute -right-3 bottom-16 hidden rounded-xl border border-amber-200/20 bg-amber-200/10 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl md:block">
        <p className="text-[11px] font-semibold uppercase text-amber-100/70">
          Stuck revenue
        </p>
        <p className="mt-1 text-xl font-semibold text-amber-100">$3,550</p>
      </div>
    </div>
  );
}
