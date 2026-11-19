import { STATUS, type Report } from "@/lib/content/report";

/** What shows before choosing a topic: how many topics fall in each color, the key reading and a list. */

export function ReportOverview({ report }: { report: Report }) {
  const tally = (Object.keys(STATUS) as (keyof typeof STATUS)[]).map((key) => ({
    ...STATUS[key],
    key,
    count: report.rows.filter((r) => r.status === key).length,
  }));
  const maxWeight = Math.max(1, ...report.list.items.map((item) => item.weight ?? 0));

  return (
    <div>
      <ul className="grid grid-cols-3 gap-3">
        {tally.map((t) => (
          <li key={t.key} className="rounded-xl border border-white/10 bg-navy/50 p-3 md:p-4">
            <span className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-extrabold md:text-4xl" style={{ color: t.color }}>
                {t.count}
              </span>
              <span className="text-sm text-gray-text">de {report.rows.length}</span>
            </span>
            <span className="mt-1 block text-xs leading-tight text-gray-text md:text-sm">{t.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-yellow/30 bg-yellow/4 p-4 md:p-5">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-yellow">{report.keyReading.title}</p>
        <p className="mt-2 text-base leading-snug text-gray-light md:text-lg">{report.keyReading.text}</p>
      </div>

      <p className="mt-7 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gray-muted">{report.list.title}</p>
      <ul className="mt-3 space-y-2.5">
        {report.list.items.map((item) =>
          item.weight !== undefined ? (
            <li
              key={item.label}
              className="grid grid-cols-[minmax(0,1fr)_6rem_auto] items-center gap-3 text-sm md:text-[0.9375rem]"
            >
              <span className="text-gray-light">{item.label}</span>
              <span className="h-2 overflow-hidden rounded-full bg-white/5">
                <span
                  className="block h-full rounded-full bg-green-bright/70"
                  style={{ width: `${(item.weight / maxWeight) * 100}%` }}
                />
              </span>
              <span className="tabular-nums text-gray-text">{item.value}</span>
            </li>
          ) : (
            <li key={item.label} className="flex items-start gap-3 text-sm">
              <span className="w-12 shrink-0 rounded-md bg-white/10 py-0.5 text-center font-mono text-xs font-semibold tracking-[0.06em] text-white">
                {item.label}
              </span>
              <span className="flex flex-wrap gap-1.5">
                {item.value.split(", ").map((part) => (
                  <span key={part} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-gray-light">
                    {part}
                  </span>
                ))}
              </span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
