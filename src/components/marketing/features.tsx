import {
  BadgeDollarSign,
  CalendarCheck,
  ClipboardList,
  MessageSquareText,
  Quote,
  RefreshCcw,
  Star,
  UsersRound,
} from "lucide-react"
import FeatureCard3D from "@/components/marketing/feature-card-3d"

const features = [
  {
    icon: ClipboardList,
    title: "Command Center",
    description:
      "Open the day with priorities, overdue work, payments, follow-ups, and AI-suggested actions in one operational view.",
  },
  {
    icon: MessageSquareText,
    title: "Lead Inbox",
    description:
      "Capture website, landing page, manual, and CSV leads in one place with response-time visibility.",
  },
  {
    icon: UsersRound,
    title: "Client 360",
    description:
      "Keep contact details, preferences, quote history, bookings, invoices, notes, and recommended next actions together.",
  },
  {
    icon: Quote,
    title: "Quote Builder",
    description:
      "Create professional spa treatment quotes with line items, deposits, expiration dates, and follow-up reminders.",
  },
  {
    icon: CalendarCheck,
    title: "Booking Tracker",
    description:
      "Track scheduled, confirmed, deposit-paid, completed, no-show, and follow-up-needed appointments.",
  },
  {
    icon: BadgeDollarSign,
    title: "Payment Tracking",
    description:
      "See who owes money, what is overdue, which deposits are missing, and which quotes can become payments.",
  },
  {
    icon: RefreshCcw,
    title: "Follow-Up Center",
    description:
      "Turn stale leads, pending quotes, unpaid invoices, and inactive clients into revenue-linked tasks.",
  },
  {
    icon: Star,
    title: "Review Requests",
    description:
      "Prompt review requests after completed services and keep unhappy-client notes out of public review flows.",
  },
]

export default function Features() {
  return (
    <section id="radar" className="relative overflow-hidden border-y border-white/[0.08] bg-[#101114] py-20 lg:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(52,211,153,0.08),transparent_35%,rgba(250,204,21,0.05)_72%,transparent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-12 grid gap-6 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-300">
              The product wedge
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white md:text-4xl">
              Not another dashboard. A revenue recovery system.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-zinc-400">
            The MVP stays focused on the operating loop that matters for small
            service businesses: respond fast, quote cleanly, collect deposits,
            complete the appointment, request the review, and reactivate later.
          </p>
        </div>

        <div className="ruut-perspective relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard3D
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              tone={index % 4 === 0 ? "emerald" : index % 4 === 1 ? "sky" : index % 4 === 2 ? "amber" : "rose"}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
