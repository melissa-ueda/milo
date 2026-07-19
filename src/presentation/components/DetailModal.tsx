import { Sparkles, Trash2, X } from "lucide-react";
import type { RecommendationView } from "../view-models/recommendation-vm";

export function DetailModal({
  item,
  onClose,
  onRemove,
  onStillHave,
  onRanOut,
}: {
  item: RecommendationView;
  onClose: () => void;
  onRemove: () => void;
  onStillHave: () => void;
  onRanOut: () => void;
}) {
  const slug = item.name.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="fixed inset-0 z-40 flex justify-center bg-[#10231a]/35">
      <div className="flex w-full max-w-[430px] items-end">
        <div className="w-full rounded-t-3xl bg-white p-6 shadow-2xl">
          <div className="flex justify-between">
            <span className="text-4xl">{item.emoji}</span>
            <button
              id="close-detail-modal"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-[#f4f6f2]"
            >
              <X size={19} />
            </button>
          </div>
          <h2 className="mt-4 text-2xl font-semibold">{item.name}</h2>
          <p className="mt-1 text-sm text-[#718077]">
            Milo is {item.confidence}% confident in this prediction.
          </p>
          <div className="mt-6 rounded-2xl bg-[#eff6ec] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#28704c]">
              <Sparkles size={16} />
              Why this is on your list
            </div>
            <p className="mt-2 text-sm leading-6 text-[#52705c]">
              Your household typically uses {item.name.toLowerCase()}{" "}
              {item.cadence.replace("Usually ", "").toLowerCase()}.
              {` You last bought it ${
                item.daysSinceLastPurchase === 0
                  ? "today"
                  : item.daysSinceLastPurchase === 1
                    ? "yesterday"
                    : `${item.daysSinceLastPurchase} days ago`
              } and have ${item.remaining.toLowerCase()}.`}
              {item.due === "Now"
                ? " It is likely empty now and should be replenished."
                : ` It is predicted to run out by ${item.due}.`}
            </p>
          </div>
          <p className="mt-5 text-sm font-semibold text-[#596b60]">
            Help Milo get this right
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              id={`still-have-item-btn-${slug}`}
              onClick={onStillHave}
              className="rounded-xl border border-[#dce5da] px-3 py-3 text-sm font-semibold text-[#28704c] hover:bg-[#f4f7f2]"
            >
              I still have some
            </button>
            <button
              id={`ran-out-item-btn-${slug}`}
              onClick={onRanOut}
              className="rounded-xl bg-[#eef5eb] px-3 py-3 text-sm font-semibold text-[#28704c] hover:bg-[#e2f0e2]"
            >
              Mark as used up
            </button>
          </div>
          <p className="mt-2 text-xs text-[#829087]">
            Your answer adjusts future recommendations.
          </p>
          <button
            id={`remove-item-btn-${slug}`}
            onClick={onRemove}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-[#9d4a3d] hover:bg-[#fdf1ef] transition duration-150"
          >
            <Trash2 size={16} />I don&apos;t need this
          </button>
        </div>
      </div>
    </div>
  );
}
