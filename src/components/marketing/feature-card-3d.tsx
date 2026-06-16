import type { LucideIcon } from "lucide-react";

interface FeatureCard3DProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: "emerald" | "sky" | "amber" | "rose";
}

const tones = {
  emerald: "text-emerald-200 bg-emerald-300/10 border-emerald-300/20",
  sky: "text-sky-200 bg-sky-300/10 border-sky-300/20",
  amber: "text-amber-100 bg-amber-200/10 border-amber-200/20",
  rose: "text-rose-100 bg-rose-200/10 border-rose-200/20",
};

export default function FeatureCard3D({
  icon: Icon,
  title,
  description,
  tone,
}: FeatureCard3DProps) {
  return (
    <article className="ruut-card-3d ruut-gradient-border rounded-2xl border border-white/[0.08] bg-[#111217]/88 p-5 backdrop-blur-xl">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${tones[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
      <div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <p className="mt-4 text-xs font-semibold uppercase text-zinc-600">
        Revenue loop module
      </p>
    </article>
  );
}
