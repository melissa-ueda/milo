"use client";

import { useState } from "react";
import { Check, ChevronRight, Pencil, X } from "lucide-react";
import {
  CATEGORY_LIST,
  categoryEmoji,
  categoryLabels,
} from "../lib/categories";
import type { Category } from "../lib/categories";
import { ParsedReceipt } from "../lib/types/parsed-receipt";
import { ReviewItem } from "@/lib/types/review-item";

type ReviewSheetProps = {
  receipt: ParsedReceipt;
  items: ReviewItem[];
  onItemsChange: (items: ReviewItem[]) => void;
  onSave: () => void;
  onClose: () => void;
  saving?: boolean;
};

export function ReviewSheet({
  receipt,
  items,
  onItemsChange,
  onSave,
  onClose,
  saving = false,
}: ReviewSheetProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const removeItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<ReviewItem>) => {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-[#10231a]/35">
      <div className="flex w-full max-w-[430px] items-end">
        <div className="flex w-full max-h-[92vh] flex-col rounded-t-3xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#edf0eb] p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-[#6c7e72]">
                Review receipt
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Check size={16} className="text-[#28704c]" />
                <h2 className="text-xl font-semibold">{receipt.store}</h2>
              </div>
              <p className="mt-0.5 text-sm text-[#718077]">
                {items.length} item{items.length !== 1 ? "s" : ""} detected · €
                {total.toFixed(2)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-[#f4f6f2] transition"
              aria-label="Close"
            >
              <X size={19} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-2">
            {items.map((item) =>
              editingId === item.id ? (
                <EditItemRow
                  key={item.id}
                  item={item}
                  onSave={(updates) => {
                    updateItem(item.id, updates);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl bg-[#f7f8f5] p-3"
                >
                  <span className="text-2xl">
                    {categoryEmoji[item.category]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm">
                      {item.normalizedName}
                    </p>
                    <p className="text-xs text-[#718077]">
                      {item.quantity} {item.unit} · €{item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="rounded-full p-2 text-[#28704c] hover:bg-[#eef5eb]"
                    aria-label={`Edit ${item.normalizedName}`}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-full p-2 text-[#a26a60] hover:bg-[#fdf1ef]"
                    aria-label={`Remove ${item.normalizedName}`}
                  >
                    <X size={15} />
                  </button>
                </div>
              ),
            )}
          </div>

          <div className="border-t border-[#edf0eb] p-5 space-y-3">
            <button
              onClick={onSave}
              disabled={saving || items.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1d5b45] py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#b7c9ba]"
            >
              {saving ? "Saving…" : `Save ${items.length} items`}
              {!saving && <ChevronRight size={18} />}
            </button>
            <p className="text-center text-xs text-[#829087]">
              Milo will learn from this receipt to improve future predictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditItemRow({
  item,
  onSave,
  onCancel,
}: {
  item: ReviewItem;
  onSave: (updates: Partial<ReviewItem>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item.normalizedName);
  const [category, setCategory] = useState<Category>(item.category);
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [unit, setUnit] = useState(item.unit);
  const [price, setPrice] = useState(String(item.price));

  const handleSave = () => {
    onSave({
      normalizedName: name.trim(),
      category,
      quantity: parseFloat(quantity) || 1,
      unit: unit.trim(),
      price: parseFloat(price) || 0,
    });
  };

  return (
    <div className="rounded-xl border border-[#28704c] bg-[#eef5eb] p-4 space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-[#dce5da] bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#4b8460]"
        placeholder="Product name"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        className="w-full rounded-lg border border-[#dce5da] bg-white px-3 py-2 text-sm outline-none focus:border-[#4b8460]"
      >
        {CATEGORY_LIST.map((cat) => (
          <option key={cat} value={cat}>
            {categoryEmoji[cat]} {categoryLabels[cat]}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-3 gap-2">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="rounded-lg border border-[#dce5da] bg-white px-3 py-2 text-sm outline-none focus:border-[#4b8460]"
          placeholder="Qty"
        />
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="rounded-lg border border-[#dce5da] bg-white px-3 py-2 text-sm outline-none focus:border-[#4b8460]"
          placeholder="Unit"
        />
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="rounded-lg border border-[#dce5da] bg-white px-3 py-2 text-sm outline-none focus:border-[#4b8460]"
          placeholder="Price"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-[#dce5da] py-2 text-sm font-semibold text-[#596b60]"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="flex-1 rounded-lg bg-[#1d5b45] py-2 text-sm font-semibold text-white disabled:bg-[#b7c9ba]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
