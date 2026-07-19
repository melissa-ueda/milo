import { Plus } from "lucide-react";
import type { RecommendationView } from "../view-models/recommendation-vm";

export function PantryView({
  items,
  onDetail,
  onUpload,
}: {
  items: RecommendationView[];
  onDetail: (item: RecommendationView) => void;
  onUpload: () => void;
}) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#5e7166]">
            Your living inventory
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            My pantry
          </h1>
          <p className="mt-2 text-sm text-[#708076]">
            A practical picture—not a perfect count.
          </p>
        </div>
        <button
          id="add-inventory-btn"
          onClick={onUpload}
          className="rounded-full bg-[#1d5b45] p-3 text-white"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <button
            id={`pantry-item-${i.name.replace(/\s+/g, "-").toLowerCase()}`}
            key={i.name}
            onClick={() => onDetail(i)}
            className="rounded-2xl border border-[#e2e7de] bg-white p-5 text-left hover:border-[#bdceb9]"
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{i.emoji}</span>
              <span className="rounded-full bg-[#f2f4f0] px-2.5 py-1 text-xs font-medium text-[#637168]">
                {i.amount}
              </span>
            </div>
            <p className="mt-5 font-semibold">{i.name}</p>
            <p className="mt-1 text-sm text-[#718076]">{i.remaining}</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf0eb]">
              <div
                className="h-full rounded-full bg-[#6ca976]"
                style={{ width: `${i.percentRemaining}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
