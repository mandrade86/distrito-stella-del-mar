"use client";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onReset?: () => void;
};

export function PercentField({ label, value, onChange, onReset }: Props) {
  const n = Math.min(100, Math.max(0, Number(String(value).replace("%", "")) || 0));

  return (
    <label className="block text-sm">
      <span className="mb-1 flex items-center justify-between gap-2 font-medium text-navy">
        <span>
          {label}{" "}
          <span className="font-semibold text-ocean">{n}%</span>
        </span>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-normal text-ocean underline"
          >
            Restaurar
          </button>
        ) : null}
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={n}
        onChange={(e) => onChange(e.target.value)}
        className="w-full accent-navy"
      />
      <input
        type="number"
        min={0}
        max={100}
        className="mt-2 w-24 border border-navy/15 bg-off-white px-2 py-1 text-xs"
        value={n}
        onChange={(e) => {
          const next = Math.min(100, Math.max(0, Number(e.target.value) || 0));
          onChange(String(next));
        }}
      />
    </label>
  );
}
