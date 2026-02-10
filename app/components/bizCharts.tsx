"use client"

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type TrendPoint = { day: number; revenue: number }
type ProfitCostPoint = { day: number; profit: number; cost: number }
type CashflowPoint = { month: number; revenue: number; profit: number }
type CostMixPoint = { name: string; value: number }

export const RevenueTrendChart = ({ data }: { data: TrendPoint[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
      <XAxis stroke="#666" dataKey="day" />
      <YAxis stroke="#666" />
      <Tooltip
        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
        labelStyle={{ color: "#fff" }}
        formatter={(value: any) => (typeof value === "number" ? `$${value.toFixed(2)}` : value)}
      />
      <Line type="monotone" dataKey="revenue" stroke="#84cc16" strokeWidth={3} dot={false} />
    </LineChart>
  </ResponsiveContainer>
)

export const ProfitCostChart = ({ data }: { data: ProfitCostPoint[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
      <XAxis stroke="#666" dataKey="day" />
      <YAxis stroke="#666" />
      <Tooltip
        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
        labelStyle={{ color: "#fff" }}
        formatter={(value: any) => (typeof value === "number" ? `$${value.toFixed(2)}` : value)}
      />
      <Area type="monotone" dataKey="profit" fill="#84cc16" stroke="#84cc16" fillOpacity={0.3} />
      <Area type="monotone" dataKey="cost" fill="#666" stroke="#999" fillOpacity={0.2} />
    </AreaChart>
  </ResponsiveContainer>
)

export const CashflowChart = ({
  data,
  projectionMonths,
  onProjectionChange,
}: {
  data: CashflowPoint[]
  projectionMonths: number
  onProjectionChange: (value: number) => void
}) => (
  <>
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm text-slate-300">Cashflow Projection</p>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>Months</span>
        <input
          type="number"
          value={projectionMonths}
          onChange={(e) => onProjectionChange(Number(e.target.value))}
          className="w-16 bg-transparent border border-slate-600 text-white rounded-md px-2 py-1 focus:outline-none"
        />
      </div>
    </div>
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
        <XAxis dataKey="month" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip
          contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
          formatter={(value: any) => (typeof value === "number" ? `$${value.toFixed(2)}` : value)}
        />
        <Line type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="profit" stroke="#84cc16" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </>
)

export const CostStructureChart = ({ data }: { data: CostMixPoint[] }) => (
  <>
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm text-slate-300">Cost Structure</p>
      <div className="text-xs text-slate-400">Fixed vs Variable</div>
    </div>
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
        <XAxis dataKey="name" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip
          contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
          formatter={(value: any) => (typeof value === "number" ? `$${value.toFixed(2)}` : value)}
        />
        <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </>
)
