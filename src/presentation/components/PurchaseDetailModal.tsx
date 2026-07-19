import { ShoppingBag, Sparkles, X } from "lucide-react";
import type { PurchaseView } from "../view-models/history-vm";

export function PurchaseDetailModal({
  purchase,
  onClose,
}: {
  purchase: PurchaseView;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-center bg-[#10231a]/35">
      <div className="flex w-full max-w-[430px] items-end">
        <div className="flex w-full max-h-[85vh] flex-col rounded-t-3xl bg-white p-6 shadow-2xl animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-[#edf0eb]">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eef5eb] text-[#28704c]">
                  <ShoppingBag size={16} />
                </span>
                <h2 className="text-xl font-bold tracking-tight">
                  {purchase.store}
                </h2>
              </div>
              <p className="mt-1 text-xs text-[#718077]">
                {purchase.date} • {purchase.itemCount}
              </p>
            </div>
            <button
              id="close-purchase-modal"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-[#f4f6f2] transition duration-200"
              aria-label="Close modal"
            >
              <X size={19} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-2.5 max-h-[40vh] pr-1">
            {purchase.items.map((item, idx) => (
              <div
                id={`purchase-detail-item-${idx}`}
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#f7f8f5] hover:bg-[#f1f3ee] transition duration-150"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm text-[#17261f]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#718077]">
                      Qty: {item.qty} • {item.price}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#17261f]">
                  {item.lineTotal}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#edf0eb]">
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-semibold text-[#17261f]">
                Total Paid
              </span>
              <span className="text-2xl font-bold text-[#1d5b45]">
                {purchase.total}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#eff6ec] p-3 text-xs text-[#28704c] font-medium">
              <Sparkles size={14} className="shrink-0" />
              <span>
                Milo successfully learned your consumption rate from this
                receipt.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
