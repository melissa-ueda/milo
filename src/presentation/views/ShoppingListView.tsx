"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export type ShoppingItemView = {
  name: string;
  emoji: string;
  subtitle: string;
};

export function ShoppingListView({
  items,
  onClose,
  onAddItem,
}: {
  items: ShoppingItemView[];
  onClose: () => void;
  onAddItem: (name: string) => void;
}) {
  const [newItem, setNewItem] = useState("");
  const addItem = () => {
    const name = newItem.trim();
    if (!name) return;
    onAddItem(name);
    setNewItem("");
  };
  return (
    <div className="pb-8">
      <button
        onClick={onClose}
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#2b6b50]"
      >
        ← Back to home
      </button>
      <div className="mt-7">
        <p className="text-sm font-medium text-[#5e7166]">Ready when you are</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Your shopping list
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#718077]">
          {items.length} items for your next shop. Milo made a starting
          point—you can add anything else here.
        </p>
      </div>
      <div className="mt-7 space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center gap-3 rounded-2xl border border-[#e2e7de] bg-white p-4"
            >
              <span className="text-2xl">{item.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-0.5 text-xs text-[#718077]">{item.subtitle}</p>
              </div>
              <Check size={18} className="text-[#28704c]" />
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-[#b9cbb9] bg-[#fbfdf9] p-5 text-sm text-[#718077]">
            No items included yet. Go back to recommendations to choose what you
            need.
          </p>
        )}
      </div>
      <div className="mt-5 rounded-2xl bg-[#eef5eb] p-4">
        <p className="text-sm font-semibold text-[#1d5b45]">
          Something Milo couldn&apos;t predict?
        </p>
        <p className="mt-1 text-xs leading-5 text-[#5f7866]">
          Add a one-off item, a craving, or anything you remembered at the last
          minute.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            aria-label="Add another shopping list item"
            placeholder="e.g. birthday candles"
            value={newItem}
            onChange={(event) => setNewItem(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") addItem();
            }}
            className="min-w-0 flex-1 rounded-xl border border-[#dce5da] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4b8460]"
          />
          <button
            id="add-shopping-list-item-btn"
            onClick={addItem}
            disabled={!newItem.trim()}
            className="rounded-xl bg-[#1d5b45] px-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
      <button
        onClick={onClose}
        className="mt-5 w-full rounded-xl bg-[#1d5b45] py-3 text-sm font-semibold text-white"
      >
        Done
      </button>
    </div>
  );
}
