import { ChevronRight, ScanLine, ShoppingBag, Trash2 } from "lucide-react";
import type { PurchaseView } from "../view-models/history-vm";

export function HistoryView({
  purchases,
  onUpload,
  onPurchaseClick,
  onDeletePurchase,
}: {
  purchases: PurchaseView[];
  onUpload: () => void;
  onPurchaseClick: (p: PurchaseView) => void;
  onDeletePurchase: (id: string) => void;
}) {
  return (
    <>
      <p className="text-sm font-medium text-[#5e7166]">
        What Milo has learned from
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Shopping history
      </h1>
      <div className="mt-7 overflow-hidden rounded-2xl border border-[#e2e7de] bg-white">
        {purchases.length === 0 ? (
          <div className="p-5 text-sm leading-6 text-[#718077]">
            No receipts yet. Add your first receipt and Milo will start learning
            your household&apos;s grocery rhythm.
          </div>
        ) : (
          purchases.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-3 border-b border-[#edf0eb] p-4 last:border-0"
            >
              <button
                id={`purchase-item-${i}`}
                onClick={() => onPurchaseClick(p)}
                className="flex min-w-0 flex-1 items-center gap-4 text-left outline-none"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef5eb] text-[#28704c]">
                  <ShoppingBag size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{p.store}</p>
                  <p className="text-sm text-[#738077]">
                    {p.date} · {p.itemCount}
                  </p>
                </div>
                <span className="text-sm font-medium">{p.total}</span>
                <ChevronRight size={18} className="shrink-0 text-[#9aa79f]" />
              </button>
              <button
                id={`delete-purchase-${i}`}
                onClick={() => onDeletePurchase(p.id)}
                aria-label={`Delete ${p.store} receipt from ${p.date}`}
                title="Delete receipt"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#a26a60] hover:bg-[#fdf1ef]"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
      <button
        id="scan-receipt-btn"
        onClick={onUpload}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#b9cbb9] bg-[#fbfdf9] p-7 text-sm font-semibold text-[#347054]"
      >
        <ScanLine size={19} />
        Scan another receipt
      </button>
    </>
  );
}
