"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Leaf,
  LoaderCircle,
  Plus,
  Sparkles,
  Upload,
} from "lucide-react";
import type { Household } from "@/src/domain/entities/household";
import { SelectField } from "../components/SelectField";
import {
  CADENCE_OPTIONS,
  COOKING_OPTIONS,
  PREFERENCE_OPTIONS,
  SHOPPING_DAY_OPTIONS,
} from "../labels/en";

export type OnboardingStep = "welcome" | "profile" | "first-item";

export function OnboardingView({
  step,
  household,
  onGetStarted,
  onChange,
  onProfileComplete,
  onComplete,
  onReceiptSelected,
  isProcessingReceipt,
  receiptError,
  geminiApiKey,
  setGeminiApiKey,
}: {
  step: OnboardingStep;
  household: Household;
  onGetStarted: () => void;
  onChange: <K extends keyof Household>(field: K, value: Household[K]) => void;
  onProfileComplete: () => void;
  onComplete: (firstItem?: string) => void;
  onReceiptSelected: (file: File) => void;
  isProcessingReceipt: boolean;
  receiptError?: string;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}) {
  if (step === "profile")
    return (
      <OnboardingProfile
        household={household}
        onChange={onChange}
        onComplete={onProfileComplete}
        geminiApiKey={geminiApiKey}
        setGeminiApiKey={setGeminiApiKey}
      />
    );
  if (step === "first-item")
    return (
      <OnboardingFirstItem
        onComplete={onComplete}
        onReceiptSelected={onReceiptSelected}
        isProcessingReceipt={isProcessingReceipt}
        receiptError={receiptError}
      />
    );

  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-8">
      <Brand />
      <div className="flex flex-1 flex-col justify-center py-12">
        <div className="relative mx-auto grid h-52 w-52 place-items-center rounded-[52px] bg-[#e4f1e3]">
          <div className="absolute -right-2 top-5 grid h-12 w-12 place-items-center rounded-2xl bg-white text-xl shadow-sm">
            ✨
          </div>
          <div className="absolute -left-3 bottom-7 grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl shadow-sm">
            🥬
          </div>
          <div className="grid h-28 w-28 place-items-center rounded-[34px] bg-[#1d5b45] text-6xl text-white shadow-lg">
            m
          </div>
        </div>
        <p className="mt-12 text-center text-sm font-semibold uppercase tracking-[.16em] text-[#5e7166]">
          Meet your household intelligence
        </p>
        <h1 className="mt-3 text-center text-[38px] font-semibold leading-[1.05] tracking-[-.04em]">
          An AI that remembers so you don&apos;t have to.
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-center text-[15px] leading-6 text-[#67786e]">
          Milo learns what your household buys and uses, then turns everyday
          grocery patterns into simple, timely decisions that save money, time,
          and food waste.
        </p>
        <div className="mt-8 space-y-3">
          <Point
            icon={<Leaf size={17} />}
            title="See the bigger picture"
            text="Groceries, pantry levels, and shopping patterns in one calm view."
          />
          <Point
            icon={<Sparkles size={17} />}
            title="Get useful nudges"
            text="Milo surfaces what matters before it becomes a problem."
          />
          <Point
            icon={<Check size={17} />}
            title="Teach it your way"
            text="Start with a receipt or a quick household setup."
          />
        </div>
      </div>
      <button
        id="get-started-btn"
        onClick={onGetStarted}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1d5b45] px-5 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#174a38]"
      >
        Get started <ArrowRight size={18} />
      </button>
      <p className="mt-4 text-center text-xs text-[#829087]">
        Your data stays yours. You&apos;re in control of what Milo learns.
      </p>
    </div>
  );
}

function OnboardingProfile({
  household,
  onChange,
  onComplete,
  geminiApiKey,
  setGeminiApiKey,
}: {
  household: Household;
  onChange: <K extends keyof Household>(field: K, value: Household[K]) => void;
  onComplete: () => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}) {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-8">
      <div className="flex items-center justify-between">
        <Brand />
        <span className="text-xs font-semibold text-[#718077]">
          Step 2 of 3
        </span>
      </div>
      <div className="flex-1 py-10">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#5e7166]">
          Let&apos;s make it yours
        </p>
        <h1 className="mt-2 text-[34px] font-semibold leading-tight tracking-[-.035em]">
          Tell Milo about your household.
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-[#67786e]">
          This gives Milo a useful starting point. It will learn and adjust as
          your household goes about its days.
        </p>
        <div className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-[#596b60]">
            What should Milo call your home?
            <input
              aria-label="Household name"
              autoFocus
              placeholder="e.g. The Müller household"
              value={household.name}
              onChange={(event) => onChange("name", event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#dce5da] bg-white px-4 py-3 text-base font-medium text-[#17261f] outline-none focus:border-[#4b8460]"
            />
          </label>
          <section className="rounded-2xl border border-[#e2e7de] bg-white p-4">
            <h2 className="font-semibold text-[#17261f]">Gemini API Key</h2>
            <p className="mt-1 text-xs text-[#718077]">
              Milo runs entirely on your device. Enter your free Gemini API Key
              to enable receipt scanning and AI-powered grocery predictions.
            </p>
            <input
              type="password"
              aria-label="Gemini API Key"
              placeholder="Paste your API key here (AIzaSy...)"
              value={geminiApiKey}
              onChange={(event) => setGeminiApiKey(event.target.value)}
              className="mt-3 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-4 py-2.5 text-sm font-semibold text-[#17261f] outline-none focus:border-[#4b8460] transition"
            />
            <span className="mt-2 block text-[11px] text-[#718077]">
              Don&apos;t have a key? Get one for free at{" "}
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1d5b45] underline font-semibold hover:text-[#174a38]"
              >
                Google AI Studio
              </a>
              .
            </span>
          </section>
          <section className="rounded-2xl border border-[#e2e7de] bg-white p-4">
            <h2 className="font-semibold">Who&apos;s at home?</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <NumberField
                label="Adults"
                value={household.adults}
                onChange={(v) => onChange("adults", v)}
              />
              <NumberField
                label="Children"
                value={household.children}
                onChange={(v) => onChange("children", v)}
              />
              <NumberField
                label="Pets"
                value={household.pets}
                onChange={(v) => onChange("pets", v)}
              />
            </div>
          </section>
          <section className="rounded-2xl border border-[#e2e7de] bg-white p-4">
            <h2 className="font-semibold">Your household rhythm</h2>
            <div className="mt-4 space-y-3">
              <SelectField
                label="Usual shopping frequency"
                value={household.cadence}
                options={CADENCE_OPTIONS}
                onChange={(v) => onChange("cadence", v)}
              />
              <SelectField
                label="Usual shopping day"
                value={household.day}
                options={SHOPPING_DAY_OPTIONS}
                onChange={(v) => onChange("day", v)}
              />
              <SelectField
                label="Cooking at home"
                value={household.cooking}
                options={COOKING_OPTIONS}
                onChange={(v) => onChange("cooking", v)}
              />
              <SelectField
                label="Food preferences"
                value={household.preferences}
                options={PREFERENCE_OPTIONS}
                onChange={(v) => onChange("preferences", v)}
              />
            </div>
          </section>
        </div>
      </div>
      <button
        id="create-household-btn"
        onClick={onComplete}
        disabled={!household.name.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1d5b45] px-5 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#174a38] disabled:cursor-not-allowed disabled:bg-[#b7c9ba]"
      >
        Create my household <ArrowRight size={18} />
      </button>
      <p className="mt-4 text-center text-xs text-[#829087]">
        You can change these details anytime in Household settings.
      </p>
    </div>
  );
}

function OnboardingFirstItem({
  onComplete,
  onReceiptSelected,
  isProcessingReceipt,
  receiptError,
}: {
  onComplete: (firstItem?: string) => void;
  onReceiptSelected: (file: File) => void;
  isProcessingReceipt: boolean;
  receiptError?: string;
}) {
  const [mode, setMode] = useState<"choice" | "manual" | "receipt">("choice");
  const [name, setName] = useState("");

  if (mode === "manual")
    return (
      <div className="flex min-h-screen flex-col px-6 pb-8 pt-8">
        <div className="flex items-center justify-between">
          <Brand />
          <span className="text-xs font-semibold text-[#718077]">
            Step 3 of 3
          </span>
        </div>
        <div className="flex-1 py-10">
          <button
            onClick={() => setMode("choice")}
            className="text-sm font-semibold text-[#2b6b50]"
          >
            ← Back
          </button>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[.16em] text-[#5e7166]">
            Add manually
          </p>
          <h1 className="mt-2 text-[34px] font-semibold leading-tight tracking-[-.035em]">
            What&apos;s one thing you always have at home?
          </h1>
          <div className="mt-8 space-y-5">
            <label className="block text-sm font-semibold text-[#596b60]">
              Grocery item
              <input
                aria-label="First grocery item"
                autoFocus
                placeholder="e.g. Whole milk"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#dce5da] bg-white px-4 py-3 text-base font-medium text-[#17261f] outline-none focus:border-[#4b8460]"
              />
            </label>
          </div>
        </div>
        <button
          onClick={() => name.trim() && onComplete(name.trim())}
          disabled={!name.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1d5b45] px-5 py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#b7c9ba]"
        >
          Add item and continue <ArrowRight size={18} />
        </button>
      </div>
    );

  if (mode === "receipt")
    return (
      <div className="flex min-h-screen flex-col px-6 pb-8 pt-8">
        <Brand />
        <div className="flex flex-1 flex-col justify-center text-center">
          <span
            className={`mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-[#eef5eb] text-4xl ${isProcessingReceipt ? "text-[#28704c]" : ""}`}
            aria-hidden="true"
          >
            {isProcessingReceipt ? (
              <LoaderCircle size={34} className="animate-spin" />
            ) : (
              "✨"
            )}
          </span>
          <h1 className="mt-7 text-3xl font-semibold tracking-tight">
            {isProcessingReceipt
              ? "Analyzing your receipt"
              : "Receipt ready to teach Milo"}
          </h1>
          <p className="mt-3 text-[15px] leading-6 text-[#67786e]">
            {isProcessingReceipt
              ? "Milo is identifying products and quantities."
              : "We'll use your first receipt as the starting point for your household inventory."}
          </p>
          {receiptError && (
            <p className="mt-4 rounded-xl bg-[#fdf1ef] p-3 text-left text-sm text-[#9d4a3d]">
              {receiptError}
            </p>
          )}
        </div>
        <button
          onClick={() => onComplete()}
          disabled={isProcessingReceipt}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1d5b45] px-5 py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#b7c9ba]"
        >
          {isProcessingReceipt ? "Analyzing receipt…" : "Continue to Milo"}
          {!isProcessingReceipt && <ArrowRight size={18} />}
        </button>
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-8">
      <div className="flex items-center justify-between">
        <Brand />
        <span className="text-xs font-semibold text-[#718077]">
          Step 3 of 3
        </span>
      </div>
      <div className="flex-1 py-10">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#5e7166]">
          Give Milo a starting point
        </p>
        <h1 className="mt-2 text-[34px] font-semibold leading-tight tracking-[-.035em]">
          How would you like to add your first groceries?
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-[#67786e]">
          Start with what&apos;s easiest. You can always add more later.
        </p>
        <input
          id="onboarding-receipt-picker"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setMode("receipt");
            onReceiptSelected(file);
            event.target.value = "";
          }}
        />
        <div className="mt-8 space-y-3">
          <button
            onClick={() =>
              document.getElementById("onboarding-receipt-picker")?.click()
            }
            className="flex w-full items-center gap-4 rounded-2xl border border-[#c6d8c6] bg-[#eef7eb] p-4 text-left"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[#28704c]">
              <Upload size={20} />
            </span>
            <span>
              <span className="block font-semibold">Upload a receipt</span>
              <span className="mt-0.5 block text-sm text-[#718077]">
                Let Milo identify several items at once.
              </span>
            </span>
            <ChevronRight className="ml-auto text-[#7b9581]" size={19} />
          </button>
          <button
            onClick={() => setMode("manual")}
            className="flex w-full items-center gap-4 rounded-2xl border border-[#e2e7de] bg-white p-4 text-left"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f3f5f0] text-[#28704c]">
              <Plus size={20} />
            </span>
            <span>
              <span className="block font-semibold">Add an item manually</span>
              <span className="mt-0.5 block text-sm text-[#718077]">
                Tell Milo about one household staple.
              </span>
            </span>
            <ChevronRight className="ml-auto text-[#9aaba0]" size={19} />
          </button>
        </div>
      </div>
      <button
        onClick={() => onComplete()}
        className="w-full rounded-xl py-3 text-sm font-semibold text-[#5f7465]"
      >
        I&apos;ll add items later
      </button>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1d5b45] text-lg text-white">
        m
      </span>
      <span className="text-lg font-semibold tracking-tight">milo</span>
    </div>
  );
}

function Point({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#e2e7de] bg-white/75 p-3.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#eef5eb] text-[#28704c]">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-[#718077]">{text}</p>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm font-medium text-[#596b60]">
      {label}
      <input
        aria-label={label}
        inputMode="numeric"
        value={value}
        onChange={(event) =>
          onChange(
            Number.parseInt(event.target.value.replace(/[^0-9]/g, ""), 10) || 0,
          )
        }
        className="mt-2 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3 py-2.5 text-base font-semibold text-[#17261f] outline-none focus:border-[#4b8460]"
      />
    </label>
  );
}
