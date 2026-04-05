"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import {
  AreaChart as AreaIcon,
  BarChart2,
  CalendarDays,
  CalendarRange,
  Calendar,
  DatabaseZap,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DataPoint = { date: string; [key: string]: string | number };
type GroupBy = "day" | "week" | "month";
type Range = "1m" | "3m" | "6m" | "12m";
type ChartType = "area" | "bar";

interface InteractiveChartProps {
  data: DataPoint[];
  title?: string;
  description?: string;
  labels?: Record<string, string>;
  defaultRange?: Range;
  defaultGroupBy?: GroupBy;
  defaultChartType?: ChartType;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
  "#3b82f6",
  "#a855f7",
  "#14b8a6",
];
const RANGE_MONTHS: Record<Range, number> = {
  "1m": 1,
  "3m": 3,
  "6m": 6,
  "12m": 12,
};

const GROUP_META: Record<GroupBy, { label: string; icon: React.ReactNode }> = {
  day: { label: "Day", icon: <CalendarDays size={12} /> },
  week: { label: "Week", icon: <CalendarRange size={12} /> },
  month: { label: "Month", icon: <Calendar size={12} /> },
};

// ─── Date Utilities ───────────────────────────────────────────────────────────

function parseDate(raw: string): Date {
  const direct = new Date(raw);
  if (!isNaN(direct.getTime())) return direct;
  const normalized = raw.replace(/(\d+)(st|nd|rd|th)/gi, "$1");
  const fallback = new Date(normalized);
  if (!isNaN(fallback.getTime())) return fallback;
  const nums = normalized.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length >= 3) {
    const [a, b, c] = nums;
    if (a > 31) return new Date(a, b - 1, c);
    if (a > 12) return new Date(c, b - 1, a);
    return new Date(c, a - 1, b);
  }
  return new Date(NaN);
}

function getISOWeek(d: Date): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getWeekKey(d: Date): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  return `${t.getUTCFullYear()}-W${String(getISOWeek(d)).padStart(2, "0")}`;
}

function toGroupKey(d: Date, g: GroupBy): string {
  if (g === "month")
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  if (g === "week") return getWeekKey(d);
  return d.toISOString().split("T")[0];
}

function formatLabel(key: string, g: GroupBy): string {
  if (g === "week") {
    const [year, week] = key.split("-W");
    return `W${week} '${year.slice(2)}`;
  }
  if (g === "month") {
    const [year, month] = key.split("-");
    return new Intl.DateTimeFormat("en", {
      month: "short",
      year: "2-digit",
    }).format(new Date(+year, +month - 1, 1));
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(key));
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const btnClass = (active: boolean) =>
  `flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
    active
      ? "bg-primary text-primary-foreground"
      : "bg-background text-muted-foreground hover:bg-muted"
  }`;

// recharts renders SVG <text> — Tailwind dark: classes don't apply.
// CSS variables from shadcn react automatically to theme changes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const XTick = ({ x, y, payload }: any) => (
  <text
    x={x}
    y={y}
    dy={4}
    textAnchor="middle"
    fontSize={11}
    className="fill-muted-foreground"
  >
    {payload.value}
  </text>
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const YTick = ({ x, y, payload }: any) => (
  <text
    x={x}
    y={y}
    dy={4}
    textAnchor="end"
    fontSize={11}
    className="fill-muted-foreground"
  >
    {payload.value}
  </text>
);
const axisProps = { tick: <XTick /> };
const yAxisProps = { tick: <YTick /> };

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

interface TooltipEntry {
  name: string;
  value: ValueType;
  color: string;
}
function ChartTooltip({
  active,
  payload,
  label,
  labels,
}: {
  active?: boolean;
  payload?: readonly TooltipEntry[];
  label?: string;
  labels: Record<string, string>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover text-popover-foreground shadow-md px-3 py-2 text-xs space-y-1 min-w-30">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map(({ name, value, color }) => (
        <div key={name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: color }}
          />
          <span className="text-muted-foreground">{labels[name] ?? name}</span>
          <span className="font-medium ml-auto pl-4">
            {typeof value === "number" && !isNaN(value)
              ? value.toLocaleString()
              : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TemporalSumChart({
  data,
  title = "Analytics",
  description,
  labels = {},
  defaultRange = "3m",
  defaultGroupBy = "week",
  defaultChartType = "area",
}: InteractiveChartProps) {
  const [range, setRange] = useState<Range>(defaultRange);
  const [groupBy, setGroupBy] = useState<GroupBy>(defaultGroupBy);
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const valueKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const row of data) {
      for (const k of Object.keys(row)) {
        if (k !== "date" && typeof row[k] === "number") keys.add(k);
      }
    }
    return Array.from(keys);
  }, [data]);

  const grouped = useMemo(() => {
    const start = new Date();
    start.setMonth(start.getMonth() - RANGE_MONTHS[range]);

    const map = new Map<string, Record<string, number>>();

    for (const row of data) {
      const d = parseDate(row.date);
      if (isNaN(d.getTime()) || d < start) continue;
      const key = toGroupKey(d, groupBy);
      if (!map.has(key)) map.set(key, {});
      const entry = map.get(key)!;
      for (const k of valueKeys) {
        const val = row[k];
        // Guard: skip NaN / undefined / non-numeric values
        const num = typeof val === "number" && !isNaN(val) ? val : 0;
        entry[k] = (entry[k] ?? 0) + num;
      }
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, sums]) => ({
        _label: formatLabel(key, groupBy),
        ...Object.fromEntries(
          valueKeys.map((k) => [
            k,
            sums[k] !== undefined ? +sums[k].toFixed(2) : null,
          ]),
        ),
      }));
  }, [data, range, groupBy, valueKeys]);

  const visible = valueKeys.filter((k) => !hidden.has(k));
  const toggle = (k: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const sharedProps = {
    data: grouped,
    margin: { top: 10, right: 10, left: 0, bottom: 0 },
  };
  const tooltip = (
    <Tooltip
      content={({ active, payload, label }) => (
        <ChartTooltip
          active={active}
          payload={
            payload as readonly { name: string; value: number; color: string }[]
          }
          label={String(label ?? "")}
          labels={labels}
        />
      )}
    />
  );

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="font-semibold text-lg leading-none tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-lg border overflow-hidden">
            {(["1m", "3m", "6m", "12m"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={btnClass(range === r)}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border overflow-hidden">
            {(["day", "week", "month"] as GroupBy[]).map((g) => (
              <button
                key={g}
                onClick={() => setGroupBy(g)}
                className={btnClass(groupBy === g)}
              >
                {GROUP_META[g].icon}
                {GROUP_META[g].label}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setChartType("area")}
              className={btnClass(chartType === "area")}
            >
              <AreaIcon size={12} />
              Area
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={btnClass(chartType === "bar")}
            >
              <BarChart2 size={12} />
              Bar
            </button>
          </div>
        </div>
      </div>

      {/* Series toggles */}
      <div className="flex flex-wrap gap-2">
        {valueKeys.map((k, i) => (
          <button
            key={k}
            onClick={() => toggle(k)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${hidden.has(k) ? "opacity-40 bg-muted" : "bg-background"}`}
            style={{ borderColor: COLORS[i % COLORS.length] }}
          >
            {hidden.has(k) ? <EyeOff size={10} /> : <Eye size={10} />}
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            {labels[k] ?? k}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-72" style={{ minWidth: 0 }}>
        {!mounted ? null : grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
            <DatabaseZap size={24} className="opacity-40" />
            No data for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart {...sharedProps}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="_label" {...axisProps} />
                <YAxis {...yAxisProps} />
                {tooltip}
                <Legend
                  formatter={(value) => labels[value] ?? value}
                  wrapperStyle={{
                    fontSize: 12,
                    color: "hsl(var(--muted-foreground))",
                  }}
                />
                {visible.map((k, i) => (
                  <Bar
                    key={k}
                    dataKey={k}
                    name={k}
                    fill={COLORS[i % COLORS.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            ) : (
              <AreaChart {...sharedProps}>
                <defs>
                  {visible.map((k, i) => (
                    <linearGradient
                      key={k}
                      id={`grad-${k}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS[i % COLORS.length]}
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS[i % COLORS.length]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="_label" {...axisProps} />
                <YAxis {...yAxisProps} />
                {tooltip}
                <Legend
                  formatter={(value) => labels[value] ?? value}
                  wrapperStyle={{
                    fontSize: 12,
                    color: "hsl(var(--muted-foreground))",
                  }}
                />
                {visible.map((k, i) => (
                  <Area
                    key={k}
                    type="monotone"
                    dataKey={k}
                    name={k}
                    stroke={COLORS[i % COLORS.length]}
                    fill={`url(#grad-${k})`}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <DatabaseZap size={11} />
        {grouped.length} points · sum by {groupBy} · {data.length} raw entries
      </p>
    </div>
  );
}
