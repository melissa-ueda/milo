import { Check } from "lucide-react";
import type { Household } from "@/src/domain/entities/household";
import { SelectField } from "../components/SelectField";
import {
  CADENCE_OPTIONS,
  COOKING_OPTIONS,
  PREFERENCE_OPTIONS,
  SHOPPING_DAY_OPTIONS,
} from "../labels/en";

export function HouseholdView({
  household,
  onChange,
  onSave,
  geminiApiKey,
  setGeminiApiKey,
}: {
  household: Household;
  onChange: <K extends keyof Household>(field: K, value: Household[K]) => void;
  onSave: () => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}) {
  return (
    <>
      <div>
        <p className="text-sm font-medium text-[#5e7166]">
          The context behind your predictions
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Your household
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#708076]">
          Milo uses these details to make a stronger starting estimate, then
          learns from what you actually buy.
        </p>
      </div>
      <div className="mt-7 space-y-5">
        <section className="rounded-2xl border border-[#e2e7de] bg-white p-5">
          <h2 className="font-semibold text-[#17261f]">Gemini API Key</h2>
          <p className="mt-1 text-xs text-[#718077]">
            This key is used locally on your device for receipt reading and
            grocery predictions. It is never uploaded to any server.
          </p>
          <input
            type="password"
            aria-label="Gemini API Key"
            placeholder={
              geminiApiKey
                ? "••••••••••••••••••••••••••••••••"
                : "Paste your API key here"
            }
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="mt-3 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3.5 py-2.5 text-sm font-medium text-[#17261f] outline-none focus:border-[#4b8460] transition"
          />
          <span className="mt-2 block text-[11px] text-[#718077]">
            Get a free API Key from{" "}
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
        <section className="rounded-2xl border border-[#e2e7de] bg-white p-5">
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
        <section className="rounded-2xl border border-[#e2e7de] bg-white p-5">
          <h2 className="font-semibold">Shopping rhythm</h2>
          <p className="mt-1 text-sm text-[#718077]">
            This helps Milo get started. Your actual behavior will take over.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SelectField
              label="Usual frequency"
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
          </div>
        </section>
        <section className="rounded-2xl border border-[#e2e7de] bg-white p-5">
          <h2 className="font-semibold">Everyday habits</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
      <button
        id="save-household-btn"
        onClick={onSave}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1d5b45] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#174a38]"
      >
        <Check size={16} />
        Save household settings
      </button>
    </>
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
