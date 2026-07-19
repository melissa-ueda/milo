import type { Option } from "../labels/en";

/** A labelled select bound to coded options (value = code, display = label). */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block text-sm font-medium text-[#596b60]">
      {label}
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="mt-2 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3 py-2.5 text-sm font-medium text-[#17261f] outline-none focus:border-[#4b8460]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
