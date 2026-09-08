"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Network,
  BrainCircuit,
  Target,
  Send,
  ShieldCheck
} from "lucide-react";

interface AgentCard {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  icon: React.ElementType;
}

const AGENTS: AgentCard[] = [
  {
    id: "discovery",
    name: "Discovery Engine",
    code: "AG-01",
    category: "Ingestion",
    description:
      "Scrapes your website to learn what you sell, maps your ideal customer profile, and generates 5 target accounts with tuned news queries.",
    icon: Search,
  },
  {
    id: "harvester",
    name: "Harvester",
    code: "AG-02",
    category: "Ingestion",
    description:
      "Monitors the open web in real time for funding rounds, hiring sprees, tenders and tech-stack shifts deduplicated with canonical SHA-256 hashes.",
    icon: Network,
  },
  {
    id: "intent",
    name: "Intent Analyzer",
    code: "AG-03",
    category: "Intelligence",
    description:
      "Classifies every raw signal into a buying stage: Targeting, Awareness, Consideration, or Purchase Ready with deterministic confidence.",
    icon: BrainCircuit,
  },
  {
    id: "scoring",
    name: "Score Calculator",
    code: "AG-04",
    category: "Intelligence",
    description:
      "Scores each signal from 1 to 100 based on intent stage, source authority and recency promoting high-conviction signals into verified leads.",
    icon: Target,
  },
  {
    id: "corsair",
    name: "Corsair Outreach",
    code: "AG-05",
    category: "Outreach",
    description:
      "Drafts a warm, human-to-human executive pitch for every high-intent lead, framed around their exact trigger event using multi-stage AI reframing.",
    icon: Send,
  },
  {
    id: "compliance",
    name: "Compliance Ledger",
    code: "AG-06",
    category: "Governance",
    description:
      "Maintains a cryptographically verified SHA-256 audit ledger across all harvested signals, ensuring deterministic compliance and regulatory governance.",
    icon: ShieldCheck,
  },
];

export default function AgentBentoGrid() {
  const [score, setScore] = useState(98.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore(98.2 + Math.random() * (99.8 - 98.2));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden py-20 border-b border-white/10 bg-transparent">

      <div className="relative z-10 px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-[48px] font-bold text-pearl mb-2 uppercase tracking-tight">
            The Autonomous Staff
          </h2>
          <div className="h-1 w-24 bg-gold" />
          <p className="text-pearl/80 text-base mt-4 max-w-2xl leading-relaxed">
            Six specialized agents working as one revenue assembly line.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Agent 1: Discovery Engine */}
          <AgentCard
            member={AGENTS[0]}
            className="col-span-12 md:col-span-7 h-[300px]"
            badgeTags={["ICP Mapping", "5 Targets / Run"]}
          />

          {/* Agent 2: Harvester */}
          <AgentCard
            member={AGENTS[1]}
            className="col-span-12 md:col-span-5 h-[300px]"
            badgeTags={["SHA-256 Deduplication", "500+ Live Sources", "Canonical Hashing"]}
          />

          {/* Agent 3: Intent Analyzer */}
          <AgentCard
            member={AGENTS[2]}
            className="col-span-12 md:col-span-4 h-[260px]"
            badgeTags={["Awareness", "Purchase Ready"]}
          />

          {/* Agent 4: Score Calculator */}
          <AgentCardWithScore
            member={AGENTS[3]}
            className="col-span-12 md:col-span-4 h-[260px]"
            liveScore={score}
            badgeTags={[]}
          />

          {/* Agent 5: Corsair Outreach */}
          <AgentCard
            member={AGENTS[4]}
            className="col-span-12 md:col-span-4 h-[260px]"
            badgeTags={["Warm 2-Stage Pitch Engine"]}
            accentDecor
          />

          {/* Agent 6: Compliance Ledger */}
          <AgentCard
            member={AGENTS[5]}
            className="col-span-12 h-[140px]"
            badgeTags={["SHA-256 Audit Trail", "Cryptographic Guard"]}
            compact
          />
        </div>
      </div>
    </section>
  );
}

function AgentCard({
  member,
  className,
  badgeTags = [],
  accentDecor,
  compact
}: {
  member: AgentCard;
  className?: string;
  badgeTags?: string[];
  accentDecor?: boolean;
  compact?: boolean;
}) {
  const Icon = member.icon;
  return (
    <div
      className={`group card-interactive-pop bg-slate-950/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/40 p-8 flex flex-col justify-between ${className}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="transition group-hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]">
            <Icon size={22} className="text-[#E8B546] group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
          </div>
          <h4 className="text-[24px] font-semibold text-pearl">{member.name}</h4>
        </div>

        <p className="text-pearl/70 text-sm leading-relaxed">{member.description}</p>

        {badgeTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badgeTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#F5D061]/90 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {compact && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#F5D061]/90 text-xs border border-white/10 px-2 py-0.5 rounded-sm">
              {member.code}
            </span>
            <span className="font-mono text-[9px] text-[#E8B546]/80 border border-white/10 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
              {member.category}
            </span>
          </div>
        </div>
      )}

      {accentDecor && (
        <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 group-hover:opacity-30 transition-all duration-1000 pointer-events-none">
          <Send size={160} className="text-[#E8B546]" />
        </div>
      )}
    </div>
  );
}

function AgentCardWithScore({
  member,
  className,
  liveScore,
  badgeTags = []
}: {
  member: AgentCard;
  className?: string;
  liveScore: number;
  badgeTags?: string[];
}) {
  const Icon = member.icon;
  return (
    <div
      className={`group card-interactive-pop bg-slate-950/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/40 p-8 flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center gap-3">
          <div className="transition group-hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]">
            <Icon size={22} className="text-[#E8B546] group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
          </div>
          <h4 className="text-[20px] font-semibold text-pearl">{member.name}</h4>
        </div>

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-[52px] font-bold text-[#E8B546] drop-shadow-[0_0_15px_rgba(212,175,55,0.5)] leading-none">
            {liveScore.toFixed(1)}%
          </span>
          <span className="text-[10px] font-extrabold text-pearl/60 uppercase tracking-widest">
            Avg. Agent Accuracy
          </span>
        </div>

        <p className="text-pearl/70 text-sm leading-relaxed mt-3">{member.description}</p>
      </div>

      {badgeTags.length > 0 && (
        <div className="flex gap-2">
          {badgeTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#F5D061]/90 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
