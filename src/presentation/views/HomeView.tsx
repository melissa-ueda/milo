import { ArrowRight, CircleHelp, Sparkles, Upload } from "lucide-react";
import { RecommendationCard } from "../components/RecommendationCard";
import type { RecommendationView } from "../view-models/recommendation-vm";

export function HomeView({
  householdName,
  todayLabel,
  selectedCount,
  items,
  nextShop,
  onToggle,
  onDetail,
  onUpload,
  onList,
}: {
  householdName: string;
  todayLabel: string;
  selectedCount: number;
  items: RecommendationView[];
  nextShop: { likely: boolean; confidence: number; day: string };
  onToggle: (item: RecommendationView) => void;
  onDetail: (item: RecommendationView) => void;
  onUpload: () => void;
  onList: () => void;
}) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#5e7166]">{todayLabel}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-[34px]">
            Good morning, {householdName || "there"}.
          </h1>
        </div>
        <button
          id="add-receipt-btn"
          onClick={onUpload}
          className="inline-flex items-center gap-2 rounded-full border border-[#d5e1d5] bg-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-[#f2f7f0]"
        >
          <Upload size={16} />
          Add a receipt
        </button>
      </div>
      <div className="mt-7 overflow-hidden rounded-3xl bg-[#1d5b45] p-6 text-white shadow-sm md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-[#d4ead7]">
              <Sparkles size={13} />
              Your next shop
            </span>
            <h2 className="mt-4 max-w-xl text-2xl font-medium leading-tight md:text-3xl">
              {nextShop.likely
                ? `You'll likely do groceries ${nextShop.day.toLowerCase()}.`
                : "No urgent shopping yet."}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#d7e8dc]">
              {nextShop.likely
                ? `Based on your recent rhythm, a ${nextShop.day} shop is ${nextShop.confidence}% likely. I've prepared what will keep your household covered for the week ahead.`
                : "Upload a few receipts and Milo will start predicting your shopping rhythm."}
            </p>
          </div>
          <span className="hidden text-5xl md:block">🛍️</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            id="view-list-btn"
            onClick={onList}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#19523f]"
          >
            View shopping list <ArrowRight size={16} />
          </button>
          <button
            id="update-bought-btn"
            onClick={onUpload}
            className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Update what I bought
          </button>
        </div>
      </div>
      <div className="mt-8 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.12em] text-[#6c7d72]">
            Recommended for tomorrow
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            A little less to remember
          </h2>
          <p className="mt-1 text-xs text-[#718077]">
            Tap the circle to include an item in your next shop.
          </p>
        </div>
        <button
          id="items-selected-badge"
          onClick={onList}
          className="shrink-0 text-right text-xs font-semibold text-[#2b6b50]"
        >
          {selectedCount} included
        </button>
      </div>
      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-[#b9cbb9] bg-[#fbfdf9] p-5">
          <p className="font-semibold">Start with your first receipt</p>
          <p className="mt-1 text-sm leading-6 text-[#718077]">
            Milo needs a few real grocery purchases before it can predict what
            your household will need next.
          </p>
          <button
            onClick={onUpload}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#1d5b45] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add a receipt <Upload size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <RecommendationCard
                key={item.name}
                item={item}
                onToggle={onToggle}
                onDetail={onDetail}
              />
            ))}
          </div>
          <button
            id="open-shopping-list-btn"
            onClick={onList}
            className="mt-4 flex w-full items-center justify-between rounded-2xl bg-[#e7f2e7] px-4 py-3.5 text-left text-sm font-semibold text-[#1d5b45]"
          >
            <span>View your shopping list</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-xs font-medium text-[#5f7d68]">
                {selectedCount} items included
              </span>
              <ArrowRight size={16} />
            </span>
          </button>
        </>
      )}
      <div className="mt-7 rounded-2xl border border-[#e2e7de] bg-white p-5">
        <div className="flex gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eef5eb] text-[#2c714e]">
            <CircleHelp size={18} />
          </div>
          <div>
            <h3 className="font-semibold">Why these recommendations?</h3>
            <p className="mt-1 text-sm leading-6 text-[#67786e]">
              Milo combines your past purchases, estimated remaining supply, and
              your usual 7-day shopping rhythm. Tap any item to see the
              reasoning—and tell us when we&apos;re wrong.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
