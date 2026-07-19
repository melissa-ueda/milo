"use client";

import { useState } from "react";
import { Plus, ReceiptText, X } from "lucide-react";

export function UploadModal({
  isProcessing,
  error,
  onClose,
  onFileSelected,
  onAddManualItem,
}: {
  isProcessing: boolean;
  error?: string;
  onClose: () => void;
  onFileSelected: (file: File) => void;
  onAddManualItem: (name: string) => void;
}) {
  const [isManual, setIsManual] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍎");
  const [amount, setAmount] = useState("1 pack");
  const [remaining, setRemaining] = useState("About half left");

  const commonEmojis = [
    "🍎",
    "🥛",
    "🥚",
    "🍞",
    "☕",
    "🫒",
    "🍌",
    "🧀",
    "🍗",
    "🥦",
    "🥫",
    "🧻",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  const triggerFilePicker = () =>
    document.getElementById("receipt-file-picker")?.click();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddManualItem(name.trim());
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-center bg-[#10231a]/35">
      <div className="flex w-full max-w-[430px] items-end">
        <div className="w-full max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-[#6c7e72]">
                Teach Milo
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                {isManual
                  ? "Add product manually"
                  : isProcessing
                    ? "Scanning receipt..."
                    : "Add what you bought"}
              </h2>
            </div>
            <button
              id="close-upload-modal"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-[#f4f6f2] transition duration-200"
            >
              <X size={19} />
            </button>
          </div>

          {isManual ? (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="manual-name"
                  className="block text-sm font-semibold text-[#596b60]"
                >
                  Product Name
                </label>
                <input
                  id="manual-name"
                  type="text"
                  required
                  placeholder="e.g. Greek Yogurt, Avocados"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3.5 py-2.5 text-sm font-medium text-[#17261f] outline-none focus:border-[#4b8460] transition duration-150"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#596b60]">
                  Select Icon / Emoji
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {commonEmojis.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEmoji(em)}
                      className={`grid h-10 w-10 place-items-center text-xl rounded-lg border transition duration-150 ${emoji === em ? "border-[#28704c] bg-[#eef5eb] scale-110" : "border-[#e2e7de] bg-[#fbfdf9] hover:bg-[#f2f5f0]"}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="manual-amount"
                    className="block text-sm font-semibold text-[#596b60]"
                  >
                    Pack Size / Qty
                  </label>
                  <input
                    id="manual-amount"
                    type="text"
                    placeholder="e.g. 500g, 6-pack"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3.5 py-2.5 text-sm font-medium text-[#17261f] outline-none focus:border-[#4b8460] transition duration-150"
                  />
                </div>
                <div>
                  <label
                    htmlFor="manual-remaining"
                    className="block text-sm font-semibold text-[#596b60]"
                  >
                    Current Stock
                  </label>
                  <select
                    id="manual-remaining"
                    value={remaining}
                    onChange={(e) => setRemaining(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3.5 py-2.5 text-sm font-medium text-[#17261f] outline-none focus:border-[#4b8460] transition duration-150"
                  >
                    <option>Full</option>
                    <option>About half left</option>
                    <option>About 1/4 left</option>
                    <option>Empty</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  id="cancel-manual-btn"
                  type="button"
                  onClick={() => setIsManual(false)}
                  className="flex-1 rounded-xl border border-[#dce5da] py-3 text-sm font-semibold text-[#596b60] hover:bg-[#f4f6f2] transition duration-150"
                >
                  Back
                </button>
                <button
                  id="submit-manual-btn"
                  type="submit"
                  className="flex-1 rounded-xl bg-[#1d5b45] py-3 text-sm font-semibold text-white hover:bg-[#174a38] transition duration-150"
                >
                  Add Item
                </button>
              </div>
            </form>
          ) : isProcessing ? (
            <div className="py-12 text-center flex flex-col items-center">
              <span className="relative flex h-12 w-12">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2c714e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-12 w-12 bg-[#1d5b45] items-center justify-center text-white">
                  <ReceiptText size={20} className="animate-bounce" />
                </span>
              </span>
              <h3 className="mt-6 text-lg font-semibold text-[#17261f]">
                Analyzing receipt...
              </h3>
              <p className="mt-2 text-sm text-[#718077]">
                Milo is identifying products and quantities.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mt-4 rounded-xl bg-[#fdf1ef] p-3 text-sm text-[#9d4a3d]">
                  {error}
                </div>
              )}
              <input
                type="file"
                id="receipt-file-picker"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                id="upload-receipt-modal-btn"
                onClick={triggerFilePicker}
                className="mt-6 grid w-full place-items-center rounded-2xl border-2 border-dashed border-[#bcd0bd] bg-[#f7fbf5] p-9 text-center hover:bg-[#f1f8ee] transition duration-150 outline-none"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#2f6e4d] shadow-sm">
                  <ReceiptText size={22} />
                </span>
                <span className="mt-3 font-semibold text-base text-[#17261f]">
                  Take a photo or upload a receipt
                </span>
                <span className="mt-1 text-sm text-[#718077]">
                  Milo will identify products and quantities
                </span>
              </button>
              <div className="my-5 flex items-center gap-3 text-xs text-[#a0aaa2] font-semibold">
                <span className="h-px flex-1 bg-[#e7ebe5]" />
                OR
                <span className="h-px flex-1 bg-[#e7ebe5]" />
              </div>
              <button
                id="add-manually-modal-btn"
                onClick={() => setIsManual(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce5da] py-3 text-sm font-semibold text-[#1d5b45] hover:bg-[#f4f6f2] transition duration-150 outline-none"
              >
                <Plus size={16} />
                Add products manually
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
