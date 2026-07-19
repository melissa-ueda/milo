import { Check, ChevronRight } from "lucide-react";
import type { RecommendationView } from "../view-models/recommendation-vm";

export function RecommendationCard({
  item,
  onToggle,
  onDetail,
}: {
  item: RecommendationView;
  onToggle: (item: RecommendationView) => void;
  onDetail: (item: RecommendationView) => void;
}) {
  const color =
    item.confidence > 85
      ? "bg-[#e5f2e6] text-[#28704c]"
      : item.confidence > 70
        ? "bg-[#fff1dc] text-[#9a6419]"
        : "bg-[#f0f1ee] text-[#6c736d]";
  return (
    <article className="group flex items-center gap-3 rounded-2xl border border-[#e2e7de] bg-white p-4 transition hover:border-[#bdceb9]">
      <button
        aria-label={`${item.selected ? "Remove" : "Include"} ${item.name} in next shop`}
        title={`${item.selected ? "Remove from" : "Include in"} next shop`}
        onClick={() => onToggle(item)}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${item.selected ? "border-[#28704c] bg-[#28704c] text-white" : "border-[#bdc8be] text-transparent"}`}
      >
        <Check size={15} />
      </button>
      <button
        id={`rec-detail-${item.name.replace(/\s+/g, "-").toLowerCase()}`}
        onClick={() => onDetail(item)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f3f5f0] text-xl">
          {item.emoji}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{item.name}</span>
          <span className="mt-0.5 block truncate text-sm text-[#728077]">
            {item.remaining} · likely out {item.due}
          </span>
        </span>
      </button>
      <div className="hidden text-right sm:block">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}
        >
          {item.confidence}% sure
        </span>
        <span className="mt-1.5 block text-xs text-[#78857d]">
          {item.cadence}
        </span>
      </div>
      <ChevronRight size={19} className="text-[#9aaba0]" />
    </article>
  );
}
