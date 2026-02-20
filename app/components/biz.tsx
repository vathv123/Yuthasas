"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { signOut } from "next-auth/react"
import dynamic from "next/dynamic"
import { isPromoActive } from "@/lib/promo"
import { useSearchParams } from "next/navigation"

interface BizProps {
  businessType?: string
  businessScale?: string
  financialStress?: string
  tier?: string
}

type CostCategory = {
  id: string
  name: string
  placeholder: string
}

type Item = {
  id: string
  name: string
  price: number
  soldPerDay: number
  profitMargin: number
}

type Tab =
  | "calculator"
  | "analysis"
  | "reports"
  | "forecast"
  | "inventory"
  | "pricing"

const iconBase = "w-5 h-5"
const CostIcon = ({ id }: { id: string }) => {
  switch (id) {
    case "ingredient":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 10h16M6 10v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8" />
          <path d="M8 10V6a4 4 0 0 1 8 0v4" />
        </svg>
      )
    case "workforce":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <path d="M14 20a5 5 0 0 1 7 0" />
        </svg>
      )
    case "electricity":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      )
    case "rent":
    case "factory":
    case "stallFee":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 10l9-7 9 7" />
          <path d="M5 10v10h14V10" />
          <path d="M9 20v-6h6v6" />
        </svg>
      )
    case "packaging":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M3 7v10l9 4 9-4V7" />
          <path d="M12 11v10" />
        </svg>
      )
    case "marketing":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 12h3l7-4v8l-7-4H4z" />
          <path d="M18 9a4 4 0 0 1 0 6" />
        </svg>
      )
    case "transportation":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 16l2-6h12l2 6" />
          <path d="M5 16h14v3H5z" />
          <circle cx="7" cy="19" r="1.5" />
          <circle cx="17" cy="19" r="1.5" />
        </svg>
      )
    case "equipment":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 10h6l2 2h8" />
          <path d="M6 10l2-4h3l2 4" />
          <path d="M6 14h12" />
        </svg>
      )
    case "insurance":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3l8 3v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3z" />
        </svg>
      )
    case "other":
    default:
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      )
  }
}

const TabIcon = ({ id }: { id: Tab }) => {
  switch (id) {
    case "calculator":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M8 7h8" />
          <path d="M8 11h3M13 11h3M8 15h3M13 15h3" />
        </svg>
      )
    case "analysis":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 19V5" />
          <path d="M10 19V9" />
          <path d="M16 19V3" />
          <path d="M22 19H2" />
        </svg>
      )
    case "reports":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M15 3v4h4" />
          <path d="M9 12h6M9 16h6M9 8h3" />
        </svg>
      )
    case "forecast":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M6 15l4-4 3 3 5-6" />
        </svg>
      )
    case "inventory":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M3 7v10l9 4 9-4V7" />
        </svg>
      )
    case "pricing":
      return (
        <svg className={iconBase} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 7h6a3 3 0 010 6H9a3 3 0 000 6h6" />
          <path d="M12 5v14" />
        </svg>
      )
  }
}

const ExportIcon = ({ id }: { id: string }) => {
  switch (id) {
    case "json":
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M15 3v4h4" />
          <path d="M8 11h8M8 15h8" />
        </svg>
      )
    case "csv":
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      )
    case "pdf":
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M9 13h6" />
          <path d="M9 17h6" />
        </svg>
      )
    case "excel":
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 8l6 8M15 8l-6 8" />
        </svg>
      )
    case "image":
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8" cy="10" r="2" />
          <path d="M21 17l-6-6-4 4-2-2-4 4" />
        </svg>
      )
    case "doc":
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M9 8h6M9 12h6M9 16h6" />
        </svg>
      )
    default:
      return null
  }
}

const RevenueTrendChart = dynamic(
  () => import("./bizCharts").then((m) => m.RevenueTrendChart),
  { ssr: false, loading: () => <div className="h-[300px] rounded-xl bg-slate-100 animate-pulse" /> }
)
const ProfitCostChart = dynamic(
  () => import("./bizCharts").then((m) => m.ProfitCostChart),
  { ssr: false, loading: () => <div className="h-[300px] rounded-xl bg-slate-100 animate-pulse" /> }
)
const CashflowChart = dynamic(
  () => import("./bizCharts").then((m) => m.CashflowChart),
  { ssr: false, loading: () => <div className="h-[240px] rounded-xl bg-slate-100 animate-pulse" /> }
)
const CostStructureChart = dynamic(
  () => import("./bizCharts").then((m) => m.CostStructureChart),
  { ssr: false, loading: () => <div className="h-[240px] rounded-xl bg-slate-100 animate-pulse" /> }
)

// Business type specific configurations
const businessTypeConfig: Record<string, { productExample: string; costCategories: CostCategory[]; productSuggestions: string[] }> = {
  "Food & Beverage": {
    productExample: "Coffee, Meals, Drinks",
    costCategories: [
      { id: "ingredient", name: "Ingredient Cost", placeholder: "Cost per item" },
      { id: "workforce", name: "Workforce Fees", placeholder: "Staff salary/wages" },
      { id: "electricity", name: "Electricity Cost", placeholder: "Monthly electricity" },
      { id: "stallFee", name: "Stall/Kitchen Fee", placeholder: "Location rental" },
      { id: "rent", name: "Storage/Office Rent", placeholder: "Monthly rent" },
      { id: "packaging", name: "Packaging Materials", placeholder: "Boxes, bags, containers" },
      { id: "other", name: "Other Costs", placeholder: "Miscellaneous" },
    ],
    productSuggestions: ["Coffee", "Meals", "Beverages", "Desserts", "Snacks"],
  },
  "Retail / Trading": {
    productExample: "Electronics, Clothing, Accessories",
    costCategories: [
      { id: "ingredient", name: "Product Cost", placeholder: "Cost per unit" },
      { id: "workforce", name: "Staff Salaries", placeholder: "Employee wages" },
      { id: "rent", name: "Store Rent", placeholder: "Monthly rental" },
      { id: "electricity", name: "Utilities", placeholder: "Electricity & water" },
      { id: "stallFee", name: "Display/Shelf Fee", placeholder: "Shelf space cost" },
      { id: "marketing", name: "Marketing", placeholder: "Ads & promotions" },
      { id: "other", name: "Other Costs", placeholder: "Miscellaneous" },
    ],
    productSuggestions: ["Item 1", "Item 2", "Item 3"],
  },
  "Services": {
    productExample: "Consulting, Repairs, Cleaning",
    costCategories: [
      { id: "ingredient", name: "Service Material Cost", placeholder: "Cost per service" },
      { id: "workforce", name: "Service Provider Salary", placeholder: "Staff compensation" },
      { id: "transportation", name: "Transportation", placeholder: "Vehicle/fuel costs" },
      { id: "rent", name: "Office/Shop Rent", placeholder: "Monthly rental" },
      { id: "equipment", name: "Equipment & Tools", placeholder: "Maintenance & supplies" },
      { id: "insurance", name: "Insurance", placeholder: "Business insurance" },
      { id: "other", name: "Other Costs", placeholder: "Miscellaneous" },
    ],
    productSuggestions: ["Service A", "Service B", "Service C"],
  },
  "Manufacturing": {
    productExample: "Furniture, Textiles, Crafts",
    costCategories: [
      { id: "ingredient", name: "Raw Materials", placeholder: "Material cost per unit" },
      { id: "workforce", name: "Factory Wages", placeholder: "Worker compensation" },
      { id: "electricity", name: "Facility Power", placeholder: "Factory electricity" },
      { id: "factory", name: "Factory Rent", placeholder: "Production facility" },
      { id: "equipment", name: "Equipment Maintenance", placeholder: "Machine upkeep" },
      { id: "packaging", name: "Packaging", placeholder: "Product packaging" },
      { id: "other", name: "Other Costs", placeholder: "Miscellaneous" },
    ],
    productSuggestions: ["Product A", "Product B", "Product C"],
  },
  "Other": {
    productExample: "Item 1, Item 2, Item 3",
    costCategories: [
      { id: "ingredient", name: "Product/Service Cost", placeholder: "Cost per unit" },
      { id: "workforce", name: "Workforce", placeholder: "Staff salary" },
      { id: "rent", name: "Rent", placeholder: "Monthly rent" },
      { id: "electricity", name: "Utilities", placeholder: "Electricity & water" },
      { id: "stallFee", name: "Location Fee", placeholder: "Stall/location fee" },
      { id: "other", name: "Other Costs", placeholder: "Miscellaneous" },
    ],
    productSuggestions: ["Item 1", "Item 2", "Item 3"],
  },
}

// Business scale configurations
const scaleConfig: Record<string, { maxProducts: number; title: string; description: string }> = {
  "Sole Proprietorship / Micro Business": {
    maxProducts: 5,
    title: "Solo Business",
    description: "Optimized for you running the business",
  },
  "Small-Scale Enterprise": {
    maxProducts: 8,
    title: "Small Team",
    description: "For growing teams",
  },
  "Mid-Size Enterprise": {
    maxProducts: 12,
    title: "Department Business",
    description: "Multiple departments",
  },
  "Large-Scale Corporate": {
    maxProducts: 20,
    title: "Corporate",
    description: "Enterprise-level operations",
  },
}

const Biz = ({
  businessType = "Food & Beverage",
  businessScale = "Small-Scale Enterprise",
  financialStress = "Sometimes",
  tier = "Free",
}: BizProps) => {
  const config = businessTypeConfig[businessType] || businessTypeConfig["Other"]
  const scale = scaleConfig[businessScale] || scaleConfig["Small-Scale Enterprise"]
  const maxProducts = scale.maxProducts

  // =========================
  // STATE
  // =========================
  const [activeTab, setActiveTab] = useState<Tab>("calculator")
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"queries" | "settings" | null>(null)
  const [isPremium, setIsPremium] = useState(tier === "Premium")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showPaywayModal, setShowPaywayModal] = useState(false)
  const [paywayQrImage, setPaywayQrImage] = useState<string | null>(null)
  const [paywayQrString, setPaywayQrString] = useState<string | null>(null)
  const [paywayTranId, setPaywayTranId] = useState<string | null>(null)
  const [paywayStatus, setPaywayStatus] = useState<"idle" | "loading" | "pending" | "paid" | "error">("idle")
  const [promoActive, setPromoActive] = useState(isPromoActive())
  const params = useSearchParams()
  const [taxRate, setTaxRate] = useState(10)
  const [discountRate, setDiscountRate] = useState(0)
  const [targetMargin, setTargetMargin] = useState(35)
  const [priceChange, setPriceChange] = useState(0)
  const [volumeChange, setVolumeChange] = useState(0)
  const [costChange, setCostChange] = useState(0)
  const [projectionMonths, setProjectionMonths] = useState(12)
  const [growthRate, setGrowthRate] = useState(2)
  const [inventoryUnits, setInventoryUnits] = useState(0)
  const [leadTimeDays, setLeadTimeDays] = useState(7)
  const [safetyStockDays, setSafetyStockDays] = useState(3)
  const [businessName, setBusinessName] = useState("")
  const [settingsCurrency, setSettingsCurrency] = useState("USD")
  const [settingsTimezone, setSettingsTimezone] = useState("Asia/Phnom_Penh")
  const [settingsDefaultExport, setSettingsDefaultExport] = useState("pdf")
  const [settingsEmailSummary, setSettingsEmailSummary] = useState(true)
  const [settingsWeeklySummary, setSettingsWeeklySummary] = useState(false)
  const [settingsLowMarginAlert, setSettingsLowMarginAlert] = useState(true)
  const [settingsIncludeLogo, setSettingsIncludeLogo] = useState(true)
  const [settingsCompactMode, setSettingsCompactMode] = useState(false)
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "", price: 0, soldPerDay: 0, profitMargin: 30 },
    { id: "2", name: "", price: 0, soldPerDay: 0, profitMargin: 30 },
    { id: "3", name: "", price: 0, soldPerDay: 0, profitMargin: 30 },
  ])

  const [isLoaded, setIsLoaded] = useState(false)
  const saveTimer = useRef<number | null>(null)

  useEffect(() => {
    setIsPremium(tier === "Premium")
  }, [tier])

  useEffect(() => {
    if (!isPremium && (activeTab === "analysis" || activeTab === "reports" || activeTab === "forecast" || activeTab === "inventory" || activeTab === "pricing")) {
      setActiveTab("calculator")
    }
  }, [isPremium, activeTab])

  useEffect(() => {
    const id = window.setInterval(() => setPromoActive(isPromoActive()), 60000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const wantsPayway = params?.get("payway") === "1"
    if (wantsPayway && !promoActive && !isPremium) {
      startPaywayPayment()
    }
  }, [params, promoActive, isPremium])

  // Dynamic cost state setup
  const [costs, setCosts] = useState<Record<string, number>>({})
  
  // Initialize costs from config
  const initializeCosts = () => {
    const newCosts: Record<string, number> = {}
    config.costCategories.forEach(cat => {
      newCosts[cat.id] = 0
    })
    setCosts(newCosts)
  }

  // Initialize on mount or when config changes
  if (Object.keys(costs).length === 0) {
    initializeCosts()
  }

  // Load saved business data (once)
  useEffect(() => {
    if (!isPremium) {
      setIsLoaded(true)
      return
    }
    let ignore = false
    const load = async () => {
      try {
        const res = await fetch("/api/business", { method: "GET" })
        const data = await res.json()
        if (ignore || !data?.data) {
          setIsLoaded(true)
          return
        }
        const b = data.data
        if (b.businessName) setBusinessName(b.businessName)
        if (Array.isArray(b.items)) setItems(b.items)
        if (b.costs && typeof b.costs === "object") setCosts(b.costs)
        setIsLoaded(true)
      } catch {
        setIsLoaded(true)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [isPremium])

  // Auto-save changes (debounced)
  useEffect(() => {
    if (!isPremium) return
    if (!isLoaded) return
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current)
    }
    saveTimer.current = window.setTimeout(() => {
      fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          businessType,
          businessScale,
          financialStress,
          items,
          costs,
        }),
      }).catch(() => {})
    }, 600)
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [isPremium, isLoaded, businessName, businessType, businessScale, financialStress, items, costs])

  const startPaywayPayment = async () => {
    if (promoActive) {
      setShowUpgradeModal(true)
      setPaywayStatus("idle")
      return
    }
    setPaywayStatus("loading")
    setShowPaywayModal(true)
    try {
      const res = await fetch("/api/payway/qr", { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        setPaywayStatus("error")
        return
      }
      setPaywayQrImage(data?.qr_image ?? null)
      setPaywayQrString(data?.qr_string ?? null)
      setPaywayTranId(data?.tran_id ?? null)
      setPaywayStatus("pending")
    } catch {
      setPaywayStatus("error")
    }
  }

  useEffect(() => {
    if (!showPaywayModal || !paywayTranId) return
    let active = true
    const timer = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/payway/status?tran_id=${encodeURIComponent(paywayTranId)}`)
        const data = await res.json()
        if (!active) return
        if (data?.status === "APPROVED") {
          setIsPremium(true)
          setPaywayStatus("paid")
          setShowPaywayModal(false)
        }
      } catch {
        // ignore polling errors
      }
    }, 3000)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [showPaywayModal, paywayTranId])

  const updateCost = (catId: string, value: number) => {
    setCosts(prev => ({ ...prev, [catId]: value }))
  }

  const downloadBusinessData = async () => {
    try {
      const res = await fetch("/api/business", { method: "GET" })
      const data = await res.json()
      const payload = data?.data ?? {}
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "business-data.json"
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert("Unable to download data. Please try again.")
    }
  }

  const clearBusinessData = async () => {
    if (!confirm("Clear all business data? This cannot be undone.")) return
    try {
      await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: "",
          businessType,
          businessScale,
          financialStress,
          items: [],
          costs: {},
        }),
      })
      setBusinessName("")
      setItems([])
      setCosts({})
    } catch {
      alert("Unable to clear data. Please try again.")
    }
  }

  // =========================
  // CALCULATIONS
  // =========================
  const calculations = useMemo(() => {
    const dailyRevenue = items.reduce(
      (sum, i) => sum + (i.price * i.soldPerDay),
      0
    )

    const monthlyRevenue = dailyRevenue * 30

    const totalItemsPerDay = items.reduce(
      (sum, i) => sum + i.soldPerDay,
      0
    )

    // Calculate ingredient cost (labeled based on business type)
    const ingredientCostId = "ingredient"
    const monthlyIngredientCost =
      (costs[ingredientCostId] || 0) * totalItemsPerDay * 30

    // Calculate all other fixed costs
    const monthlyFixedCost = Object.entries(costs).reduce((sum, [catId, value]) => {
      if (catId !== ingredientCostId) {
        return sum + (value || 0)
      }
      return sum
    }, 0)

    const monthlyCost =
      monthlyIngredientCost + monthlyFixedCost

    const profit = monthlyRevenue - monthlyCost
    const profitMargin = monthlyRevenue > 0 ? (profit / monthlyRevenue) * 100 : 0

    const averagePricePerItem =
      totalItemsPerDay > 0
        ? dailyRevenue / totalItemsPerDay
        : 0

    const costPerItem =
      totalItemsPerDay > 0
        ? monthlyCost / (totalItemsPerDay * 30)
        : 0

    const breakEvenItemsPerDay =
      averagePricePerItem > costPerItem && averagePricePerItem > 0
        ? Math.ceil(monthlyFixedCost / (averagePricePerItem - costPerItem))
        : 0

    const futureValue = profit * 6
    const roi = monthlyCost > 0 ? (profit / monthlyCost) * 100 : 0

    return {
      dailyRevenue,
      monthlyRevenue,
      monthlyIngredientCost,
      monthlyFixedCost,
      monthlyCost,
      profit,
      profitMargin,
      averagePricePerItem,
      costPerItem,
      breakEvenItemsPerDay,
      futureValue,
      roi,
      totalItemsPerDay,
    }
  }, [items, costs])

  const revenueTrendData = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        revenue: calculations.dailyRevenue * (0.8 + Math.random() * 0.4),
      })),
    [calculations.dailyRevenue]
  )

  const profitCostTrendData = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        profit: calculations.profit * (0.7 + Math.random() * 0.5),
        cost: calculations.monthlyCost / 30,
      })),
    [calculations.profit, calculations.monthlyCost]
  )

  const premiumMetrics = useMemo(() => {
    const revenueAfterDiscount = calculations.monthlyRevenue * (1 - discountRate / 100)
    const taxAmount = revenueAfterDiscount * (taxRate / 100)
    const netProfit = revenueAfterDiscount - calculations.monthlyCost - taxAmount
    const grossMargin =
      calculations.monthlyRevenue > 0
        ? ((calculations.monthlyRevenue - calculations.monthlyIngredientCost) / calculations.monthlyRevenue) * 100
        : 0
    const contributionMargin =
      revenueAfterDiscount > 0
        ? ((revenueAfterDiscount - calculations.monthlyIngredientCost) / revenueAfterDiscount) * 100
        : 0
    const revenueAfterTax = revenueAfterDiscount - taxAmount
    const breakEvenRevenue =
      grossMargin > 0
        ? calculations.monthlyFixedCost / (grossMargin / 100)
        : 0
    const recommendedPricePerItem =
      calculations.costPerItem > 0 && targetMargin < 100
        ? calculations.costPerItem / (1 - targetMargin / 100)
        : 0

    const adjustedRevenue =
      calculations.monthlyRevenue *
      (1 + priceChange / 100) *
      (1 + volumeChange / 100)
    const adjustedCost = calculations.monthlyCost * (1 + costChange / 100)
    const adjustedRevenueAfterDiscount = adjustedRevenue * (1 - discountRate / 100)
    const adjustedTax = adjustedRevenueAfterDiscount * (taxRate / 100)
    const adjustedNetProfit = adjustedRevenueAfterDiscount - adjustedCost - adjustedTax

    const unitRevenue =
      calculations.totalItemsPerDay > 0
        ? calculations.dailyRevenue / calculations.totalItemsPerDay
        : 0
    const unitProfit = unitRevenue - calculations.costPerItem

    const reorderPoint =
      calculations.totalItemsPerDay > 0
        ? Math.ceil(calculations.totalItemsPerDay * (leadTimeDays + safetyStockDays))
        : 0
    const daysOfStock =
      calculations.totalItemsPerDay > 0
        ? inventoryUnits / calculations.totalItemsPerDay
        : 0

    const projectionCount = Math.max(3, Math.min(24, Math.round(projectionMonths)))
    const monthlyGrowth = 1 + growthRate / 100
    const cashflow = Array.from({ length: projectionCount }, (_, idx) => {
      const monthFactor = Math.pow(monthlyGrowth, idx)
      const projectedRevenue = adjustedRevenue * monthFactor
      const projectedDiscounted = projectedRevenue * (1 - discountRate / 100)
      const projectedTax = projectedDiscounted * (taxRate / 100)
      const projectedProfit = projectedDiscounted - adjustedCost - projectedTax
      return {
        month: idx + 1,
        revenue: projectedRevenue,
        profit: projectedProfit,
      }
    })

    const costMix = [
      { name: "Variable", value: calculations.monthlyIngredientCost },
      { name: "Fixed", value: calculations.monthlyFixedCost },
    ]

    const scenario = (multiplier: number) => {
      const scenarioRevenue = calculations.monthlyRevenue * multiplier
      const scenarioDiscounted = scenarioRevenue * (1 - discountRate / 100)
      const scenarioTax = scenarioDiscounted * (taxRate / 100)
      return scenarioDiscounted - calculations.monthlyCost - scenarioTax
    }

    return {
      revenueAfterDiscount,
      taxAmount,
      revenueAfterTax,
      netProfit,
      grossMargin,
      contributionMargin,
      breakEvenRevenue,
      recommendedPricePerItem,
      scenarioBest: scenario(1.15),
      scenarioBase: scenario(1),
      scenarioWorst: scenario(0.85),
      adjustedRevenue,
      adjustedNetProfit,
      unitRevenue,
      unitProfit,
      reorderPoint,
      daysOfStock,
      cashflow,
      costMix,
    }
  }, [
    calculations,
    taxRate,
    discountRate,
    targetMargin,
    priceChange,
    volumeChange,
    costChange,
    projectionMonths,
    growthRate,
    inventoryUnits,
    leadTimeDays,
    safetyStockDays,
  ])

  // =========================
  // HELPERS
  // =========================
  const updateItem = (
    id: string,
    field: keyof Item,
    value: string | number
  ) => {
    setItems(prev =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: field === "name" ? value : Number(value) } : item
      )
    )
  }

  const addItem = () => {
    const newId = String(Math.max(...items.map(i => Number(i.id)), 0) + 1)
    setItems(prev => [...prev, { id: newId, name: "", price: 0, soldPerDay: 0, profitMargin: 30 }])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter((item) => item.id !== id))
  }

  const exportData = () => {
    const data = {
      businessName,
      businessType,
      businessScale,
      items,
      costs,
      calculations,
      exportedAt: new Date().toLocaleString(),
    }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `business-calc-${Date.now()}.json`
    a.click()
  }

  const formatMoney = (value: number) => value.toFixed(2)
  const getExportItems = () => items.filter(item => item.name.trim())

  const renderReceiptHTML = () => {
    const exportItems = getExportItems()
    const itemRows = exportItems.length
      ? exportItems.map(item => `
          <tr>
            <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
            <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${formatMoney(item.price)}</td>
            <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.soldPerDay}</td>
            <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${formatMoney(item.price * item.soldPerDay)}</td>
          </tr>
        `).join("")
      : `
          <tr>
            <td colspan="4" style="padding: 14px 8px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">No products listed</td>
          </tr>
        `

    const costRows = config.costCategories.map(cat => `
        <tr>
          <td style="padding: 8px 0; color: #374151;">${cat.name}</td>
          <td style="padding: 8px 0; text-align: right;">$${formatMoney(costs[cat.id] || 0)}</td>
        </tr>
      `).join("")

    return `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; padding: 32px;">
        <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px;">
            <div>
              <div style="font-size: 20px; font-weight: 700;">Business Report</div>
              <div style="margin-top: 6px; font-size: 12px; color: #6b7280;">Generated ${new Date().toLocaleString()}</div>
            </div>
            <div style="text-align: right; font-size: 12px; color: #6b7280;">
              <div style="font-weight: 600; color: #111827;">${businessName || "Business Name"}</div>
              <div>${businessType}</div>
              <div>${businessScale}</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 18px 0 20px;">
            <div style="padding: 12px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
              <div style="font-size: 11px; color: #6b7280;">Monthly Revenue</div>
              <div style="font-size: 18px; font-weight: 700;">$${formatMoney(calculations.monthlyRevenue)}</div>
            </div>
            <div style="padding: 12px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
              <div style="font-size: 11px; color: #6b7280;">Monthly Cost</div>
              <div style="font-size: 18px; font-weight: 700;">$${formatMoney(calculations.monthlyCost)}</div>
            </div>
            <div style="padding: 12px; background: ${calculations.profit >= 0 ? "#ecfdf5" : "#fef2f2"}; border-radius: 12px; border: 1px solid ${calculations.profit >= 0 ? "#a7f3d0" : "#fecaca"};">
              <div style="font-size: 11px; color: #6b7280;">Monthly Profit</div>
              <div style="font-size: 18px; font-weight: 700; color: ${calculations.profit >= 0 ? "#047857" : "#b91c1c"};">$${formatMoney(calculations.profit)}</div>
            </div>
          </div>

          <div style="margin-top: 8px;">
            <div style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">Products</div>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="text-align: left; padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">Product</th>
                  <th style="text-align: right; padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">Price</th>
                  <th style="text-align: right; padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">Qty/Day</th>
                  <th style="text-align: right; padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">Daily Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>
          </div>

          <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 18px; margin-top: 20px;">
            <div>
              <div style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">Costs (Monthly)</div>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tbody>
                  ${costRows}
                </tbody>
              </table>
            </div>
            <div>
              <div style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">Summary</div>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tbody>
                  <tr><td style="padding: 8px 0; color: #374151;">Daily Revenue</td><td style="padding: 8px 0; text-align: right;">$${formatMoney(calculations.dailyRevenue)}</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151;">Monthly Revenue</td><td style="padding: 8px 0; text-align: right;">$${formatMoney(calculations.monthlyRevenue)}</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151;">Monthly Cost</td><td style="padding: 8px 0; text-align: right;">$${formatMoney(calculations.monthlyCost)}</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151;">Profit Margin</td><td style="padding: 8px 0; text-align: right;">${calculations.profitMargin.toFixed(2)}%</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151;">ROI</td><td style="padding: 8px 0; text-align: right;">${calculations.roi.toFixed(2)}%</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151;">6-Month Projection</td><td style="padding: 8px 0; text-align: right;">$${formatMoney(calculations.futureValue)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style="margin-top: 18px; border-top: 1px dashed #e5e7eb; padding-top: 10px; text-align: center; color: #9ca3af; font-size: 11px;">
            This report is generated by Business Calculator.
          </div>
        </div>
      </div>
    `
  }

  const exportAsCSV = () => {
    const escapeCSV = (str: string | number) => {
      const stringified = String(str)
      if (stringified.includes(",") || stringified.includes('"') || stringified.includes("\n")) {
        return `"${stringified.replace(/"/g, '""')}"`
      }
      return stringified
    }

    const costRows = config.costCategories.map(cat => [
      cat.name + ":",
      costs[cat.id] || 0,
      "",
      ""
    ])

    const data = [
      ["Business Report", "", "", ""],
      ["Business Name:", businessName, "", ""],
      ["Business Type:", businessType, "", ""],
      ["Business Scale:", businessScale, "", ""],
      ["Exported:", new Date().toLocaleString(), "", ""],
      ["Currency:", "USD", "", ""],
      ["", "", "", ""],
      ["Products", "", "", ""],
      ["Product Name", "Price", "Qty/Day", "Daily Revenue"],
      ...getExportItems().map(item => [
        item.name,
        formatMoney(item.price),
        item.soldPerDay,
        formatMoney(item.price * item.soldPerDay)
      ]),
      ["", "", "", ""],
      ["Costs (Monthly)", "", "", ""],
      ...costRows.map(row => [row[0], formatMoney(Number(row[1]) || 0), "", ""]),
      ["", "", "", ""],
      ["Summary", "", "", ""],
      ["Daily Revenue:", formatMoney(calculations.dailyRevenue), "", ""],
      ["Monthly Revenue:", formatMoney(calculations.monthlyRevenue), "", ""],
      ["Monthly Costs:", formatMoney(calculations.monthlyCost), "", ""],
      ["Monthly Profit:", formatMoney(calculations.profit), "", ""],
      ["Profit Margin:", calculations.profitMargin.toFixed(2) + "%", "", ""],
      ["ROI:", calculations.roi.toFixed(2) + "%", "", ""],
      ["6-Month Projection:", formatMoney(calculations.futureValue), "", ""],
    ]

    const csv = data.map(row => row.map(escapeCSV).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `business-calc-${Date.now()}.csv`
    link.click()
  }

  const exportAsExcel = async () => {
    const costRows = config.costCategories.map(cat => [
      cat.name + ":",
      costs[cat.id] || 0
    ])

    const summaryData = [
      ["Business Report"],
      ["Business Name:", businessName],
      ["Business Type:", businessType],
      ["Business Scale:", businessScale],
      ["Exported:", new Date().toLocaleString()],
      ["Currency:", "USD"],
      [],
      ["PRODUCTS"],
      ["Product Name", "Price", "Qty/Day", "Daily Revenue"],
      ...getExportItems().map(item => [
        item.name,
        Number(formatMoney(item.price)),
        item.soldPerDay,
        Number(formatMoney(item.price * item.soldPerDay))
      ]),
      [],
      ["COSTS (MONTHLY)"],
      ...costRows.map(row => [row[0], Number(formatMoney(Number(row[1]) || 0))]),
      [],
      ["SUMMARY"],
      ["Daily Revenue:", Number(formatMoney(calculations.dailyRevenue))],
      ["Monthly Revenue:", Number(formatMoney(calculations.monthlyRevenue))],
      ["Monthly Costs:", Number(formatMoney(calculations.monthlyCost))],
      ["Monthly Profit:", Number(formatMoney(calculations.profit))],
      ["Profit Margin %:", Number(calculations.profitMargin.toFixed(2))],
      ["ROI %:", Number(calculations.roi.toFixed(2))],
      ["6-Month Projection:", Number(formatMoney(calculations.futureValue))],
    ]

    const escapeXml = (value: string | number) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")

    const rowsXml = summaryData
      .map((row) => {
        const cellsXml = row
          .map((cell) => {
            const value = cell ?? ""
            const isNumber = typeof value === "number" && Number.isFinite(value)
            const type = isNumber ? "Number" : "String"
            return `<Cell><Data ss:Type="${type}">${escapeXml(value)}</Data></Cell>`
          })
          .join("")
        return `<Row>${cellsXml}</Row>`
      })
      .join("")

    const spreadsheetXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="Report">
  <Table>
   ${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`

    const blob = new Blob([spreadsheetXml], { type: "application/vnd.ms-excel;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `business-calc-${Date.now()}.xls`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const exportAsPDF = async () => {
    const { default: html2canvas } = await import("html2canvas")
    const { default: jsPDF } = await import("jspdf")
    const element = document.createElement("div")
    element.style.padding = "0"
    element.style.backgroundColor = "white"
    element.style.color = "#111827"
    element.style.width = "900px"
    element.style.boxSizing = "border-box"
    element.innerHTML = renderReceiptHTML()
    
    document.body.appendChild(element)
    const canvas = await html2canvas(element, { backgroundColor: "#ffffff", scale: 2 })
    document.body.removeChild(element)

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = 210
    const pageHeight = 297
    const margin = 10
    const imgWidth = pageWidth - margin * 2
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = margin

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight)
    heightLeft -= pageHeight - margin * 2

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin
      pdf.addPage()
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - margin * 2
    }
    pdf.save(`business-calc-${Date.now()}.pdf`)
  }

  const exportAsPNG = async () => {
    const { default: html2canvas } = await import("html2canvas")
    const element = document.createElement("div")
    element.style.padding = "0"
    element.style.backgroundColor = "white"
    element.style.color = "#111827"
    element.style.width = "1200px"
    element.style.boxSizing = "border-box"
    element.innerHTML = renderReceiptHTML()
    
    document.body.appendChild(element)
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2
    })
    document.body.removeChild(element)

    canvas.toBlob((blob: Blob | null) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `business-calc-${Date.now()}.png`
      a.click()
    })
  }

  const exportAsWord = async () => {
    const { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun } = await import("docx")
    const infoTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Business Name")] }),
            new TableCell({ children: [new Paragraph(businessName || "Business Name")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Business Type")] }),
            new TableCell({ children: [new Paragraph(businessType)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Business Scale")] }),
            new TableCell({ children: [new Paragraph(businessScale)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Exported")] }),
            new TableCell({ children: [new Paragraph(new Date().toLocaleString())] }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
    })

    const productHeader = new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("Product")] }),
        new TableCell({ children: [new Paragraph("Price")] }),
        new TableCell({ children: [new Paragraph("Qty/Day")] }),
        new TableCell({ children: [new Paragraph("Daily Revenue")] }),
      ],
    })

    const productRows = getExportItems().map(item =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(item.name)] }),
          new TableCell({ children: [new Paragraph(`$${formatMoney(item.price)}`)] }),
          new TableCell({ children: [new Paragraph(String(item.soldPerDay))] }),
          new TableCell({ children: [new Paragraph(`$${formatMoney(item.price * item.soldPerDay)}`)] }),
        ],
      })
    )

    const productsTable = new Table({
      rows: [productHeader, ...productRows],
      width: { size: 100, type: WidthType.PERCENTAGE },
    })

    const costsTable = new Table({
      rows: config.costCategories.map(cat =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(cat.name)] }),
            new TableCell({ children: [new Paragraph(`$${formatMoney(costs[cat.id] || 0)}`)] }),
          ],
        })
      ),
      width: { size: 100, type: WidthType.PERCENTAGE },
    })

    const summaryTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Daily Revenue")] }),
            new TableCell({ children: [new Paragraph(`$${formatMoney(calculations.dailyRevenue)}`)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Monthly Revenue")] }),
            new TableCell({ children: [new Paragraph(`$${formatMoney(calculations.monthlyRevenue)}`)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Monthly Costs")] }),
            new TableCell({ children: [new Paragraph(`$${formatMoney(calculations.monthlyCost)}`)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Monthly Profit", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${formatMoney(calculations.profit)}`, bold: true })] })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Profit Margin")] }),
            new TableCell({ children: [new Paragraph(`${calculations.profitMargin.toFixed(2)}%`)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("ROI")] }),
            new TableCell({ children: [new Paragraph(`${calculations.roi.toFixed(2)}%`)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("6-Month Projection")] }),
            new TableCell({ children: [new Paragraph(`$${formatMoney(calculations.futureValue)}`)] }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
    })

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Business Calculator Report", bold: true, size: 32 })],
          }),
          new Paragraph(""),
          infoTable,
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Products", bold: true })] }),
          productsTable,
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Costs (Monthly)", bold: true })] }),
          costsTable,
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Summary", bold: true })] }),
          summaryTable,
        ],
      }],
    })

    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `business-calc-${Date.now()}.docx`
    a.click()
  }

  const exportFormats = [
    { id: "json", name: "JSON", icon: <ExportIcon id="json" />, color: "from-blue-400 to-blue-600" },
    { id: "csv", name: "CSV", icon: <ExportIcon id="csv" />, color: "from-green-400 to-green-600" },
    { id: "pdf", name: "PDF", icon: <ExportIcon id="pdf" />, color: "from-red-400 to-red-600" },
    { id: "excel", name: "Excel", icon: <ExportIcon id="excel" />, color: "from-emerald-400 to-emerald-600" },
    { id: "image", name: "PNG Image", icon: <ExportIcon id="image" />, color: "from-purple-400 to-purple-600" },
    { id: "doc", name: "Word Doc", icon: <ExportIcon id="doc" />, color: "from-cyan-400 to-cyan-600" },
  ]

  const qrImageSrc = paywayQrImage
    ? paywayQrImage.startsWith("data:image")
      ? paywayQrImage
      : paywayQrImage.startsWith("http")
        ? paywayQrImage
        : `data:image/png;base64,${paywayQrImage}`
    : null

  const handleExport = async (format: string) => {
    const isLocked = !isPremium && format !== "image"
    if (isLocked) {
      setShowExportModal(false)
      setShowUpgradeModal(true)
      return
    }

    try {
      switch (format) {
        case "json":
          exportData()
          break
        case "csv":
          exportAsCSV()
          break
        case "pdf":
          await exportAsPDF()
          break
        case "excel":
          await exportAsExcel()
          break
        case "image":
          await exportAsPNG()
          break
        case "doc":
          await exportAsWord()
          break
        default:
          alert(`Export to ${format.toUpperCase()} not supported`)
      }
    } catch (error) {
      console.error("Export error:", error)
      alert("Error during export. Please try again.")
    }
    setShowExportModal(false)
  }

  const handleNavigation = (action: "queries" | "settings") => {
    if (action === "settings") {
      setShowSettingsModal(true)
      return
    }
    setConfirmAction(action)
    setShowConfirmModal(true)
  }

  const confirmNavigation = () => {
    setShowConfirmModal(false)
    if (confirmAction === "queries") {
      if (!isPremium) {
        setShowUpgradeModal(true)
      } else {
        // Navigate to queries (open onboarding for editing)
        window.location.href = "/Enterprise?edit=1"
      }
    } else if (confirmAction === "settings") {
      // Navigate to settings
      alert("Settings page coming soon!")
    }
    setConfirmAction(null)
  }

  // =========================
  // UI COMPONENT
  // =========================
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 font-[Gilroy-Medium] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-row flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-lg flex items-center justify-center text-white ">
              <img src="/image/Yuthasas.png" alt="Yuthasas Logo" className="w-full h-full object-cover" />
            </div>
            <div className="relative -left-4">
              <h1 className="text-xl  text-black">{businessName || scale.title}</h1>
              <p className="text-xs text-slate-500">{businessType} • {businessScale}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleNavigation("settings")}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-full transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/authentications/signup" })}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-full transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 17l5-5-5-5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H3" />
              </svg>
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto flex-nowrap no-scrollbar">
            {([
              { id: "calculator", label: "Calculator" },
              { id: "analysis", label: "Analysis" },
              { id: "reports", label: "Reports" },
              { id: "forecast", label: "Forecast" },
              { id: "inventory", label: "Inventory" },
              { id: "pricing", label: "Pricing Lab" },
            ] as { id: Tab; label: string }[]).map((tab) => {
              const isLocked =
                !isPremium &&
                (tab.id === "analysis" || tab.id === "reports" || tab.id === "forecast" || tab.id === "inventory" || tab.id === "pricing")
              return (
                <button
                  key={tab.id}
                  onClick={() => (isLocked ? setShowUpgradeModal(true) : setActiveTab(tab.id as Tab))}
                  className={`px-6 py-4 font-medium flex items-center gap-2 border-b-2 transition ${
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="text-slate-600">
                    <TabIcon id={tab.id} />
                  </span>
                  {tab.label}
                  {isLocked && <span className="text-xs text-yellow-600">Locked</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto flex-1 w-full ${settingsCompactMode ? "px-4 py-4" : "px-6 py-8"}`}>
        {activeTab === "calculator" && (
          <div className="space-y-10">
            {/* Business Info */}
            <section className="rounded-3xl p-6 border border-slate-200/70 bg-white/80 backdrop-blur shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Calculator</p>
                  <h2 className="text-xl text-black mt-2">Business Information</h2>
                </div>
                <div className="px-3 py-1 rounded-full text-xs text-slate-500 bg-slate-100">Auto‑saved</div>
              </div>
              <div className="mt-5">
                <label className="text-xs text-slate-500">Business name</label>
                <input
                  type="text"
                  placeholder="Business Name"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="mt-2 w-full px-4 py-3 bg-white/90 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/15 focus:border-black"
                />
              </div>
            </section>

            {/* Products Section */}
            <section className="rounded-3xl overflow-hidden border border-slate-200/70 bg-white/80 backdrop-blur shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
              <div className="px-6 py-5 flex justify-between items-center flex-wrap gap-4 bg-transparent">
                <div>
                  <h2 className="text-xl text-black">Top Selling Products</h2>
                  <p className="text-sm text-slate-500 mt-1">Track daily performance by item.</p>
                </div>
                <button
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-2xl hover:bg-slate-800 transition"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Product
                </button>
              </div>

              <div className="px-6 pb-5">
                <div className="hidden md:grid grid-cols-[1.6fr_0.7fr_0.7fr_0.8fr_40px] gap-3 text-[11px] uppercase tracking-[0.22em] text-slate-400 pb-3">
                  <div>Product</div>
                  <div>Price</div>
                  <div>Qty / Day</div>
                  <div className="text-right">Revenue</div>
                  <div></div>
                </div>
                <div className="divide-y divide-slate-200/50">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1.6fr_0.7fr_0.7fr_0.8fr_40px] gap-3 items-center py-4">
                      <input
                        type="text"
                        placeholder="Product name"
                        value={item.name}
                        onChange={e => updateItem(item.id, "name", e.target.value)}
                        className="w-full px-3 py-2 bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/15 text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">$</span>
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.price || ""}
                          onChange={e => updateItem(item.id, "price", e.target.value)}
                          className="w-full px-3 py-2 bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/15 text-sm"
                        />
                      </div>
                      <input
                        type="number"
                        placeholder="Qty/day"
                        value={item.soldPerDay || ""}
                        onChange={e => updateItem(item.id, "soldPerDay", e.target.value)}
                        className="w-full px-3 py-2 bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/15 text-sm"
                      />
                      <div className="text-sm font-semibold text-slate-800 md:text-right">
                        ${(item.price * item.soldPerDay).toFixed(2)}/day
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Costs Section */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl text-black">Monthly Costs</h2>
                <p className="text-sm text-slate-500 mt-1">Capture both fixed and variable expenses.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {config.costCategories.map((cat, idx) => (
                  <div key={cat.id} className={idx === 0 ? "md:col-span-2" : ""}>
                    <div className="rounded-3xl p-6 border border-slate-200/70 bg-white/80 backdrop-blur shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-slate-700">
                          <CostIcon id={cat.id} />
                        </span>
                        <div>
                          <h3 className="text-black">{cat.name}</h3>
                          <p className="text-xs text-slate-400">{cat.placeholder}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">$</span>
                        <input
                          type="number"
                          placeholder={cat.placeholder}
                          value={costs[cat.id] || ""}
                          onChange={e => updateCost(cat.id, Number(e.target.value))}
                          className="w-full px-4 py-2 bg-white/90 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/15"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6">
            {/* Key Metrics Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Daily Revenue */}
              <div className="bg-linear-to-br from-black to-slate-900 rounded-2xl p-6 border border-slate-800">
                <p className="text-slate-400 text-sm font-medium mb-2">Daily Revenue</p>
                <p className="text-4xl font-bold text-white">${calculations.dailyRevenue.toFixed(2)}</p>
                <div className="flex items-center mt-3">
                  <div className="h-1 flex-1 bg-lime-400 rounded-full"></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Monthly: ${calculations.monthlyRevenue.toFixed(2)}</p>
              </div>

              {/* Monthly Costs */}
              <div className="bg-linear-to-br from-black to-slate-900 rounded-2xl p-6 border border-slate-800">
                <p className="text-slate-400 text-sm font-medium mb-2">Monthly Costs</p>
                <p className="text-4xl font-bold text-white">${calculations.monthlyCost.toFixed(2)}</p>
                <div className="flex items-center mt-3">
                  <div className="h-1 flex-1 bg-slate-600 rounded-full"></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Total operating expenses</p>
              </div>

              {/* Monthly Profit */}
              <div className={`bg-linear-to-br rounded-2xl p-6 border ${calculations.profit > 0 ? 'from-lime-900 to-lime-950 border-lime-700' : 'from-red-900 to-red-950 border-red-700'}`}>
                <p className="text-slate-300 text-sm font-medium mb-2">Monthly Profit</p>
                <p className={`text-4xl font-bold ${calculations.profit > 0 ? 'text-lime-400' : 'text-red-400'}`}>
                  ${calculations.profit.toFixed(2)}
                </p>
                <div className="flex items-center mt-3">
                  <div className={`h-1 flex-1 rounded-full ${calculations.profit > 0 ? 'bg-lime-400' : 'bg-red-400'}`}></div>
                </div>
                <p className={`text-xs mt-2 ${calculations.profit > 0 ? 'text-lime-300' : 'text-red-300'}`}>
                  Margin: {calculations.profitMargin.toFixed(1)}%
                </p>
              </div>

              {/* ROI */}
              <div className="bg-linear-to-br from-black to-slate-900 rounded-2xl p-6 border border-slate-800">
                <p className="text-slate-400 text-sm font-medium mb-2">Return on Investment</p>
                <p className="text-4xl font-bold text-lime-400">{calculations.roi.toFixed(1)}%</p>
                <div className="flex items-center mt-3">
                  <div className="h-1 flex-1 bg-lime-400 rounded-full"></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Per month on costs</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend Chart */}
              <div className="bg-linear-to-br from-black to-slate-900 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-white font-semibold mb-4">Revenue Trend (30 Days)</h3>
                <RevenueTrendChart data={revenueTrendData} />
              </div>

              {/* Profit vs Cost Chart */}
              <div className="bg-linear-to-br from-black to-slate-900 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-white font-semibold mb-4">Profit vs Cost (30 Days)</h3>
                <ProfitCostChart data={profitCostTrendData} />
              </div>
            </div>

            {/* Bottom Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Break-even Point */}
              <div className="bg-linear-to-br from-black to-slate-900 rounded-2xl p-6 border border-slate-800">
                <p className="text-slate-400 text-sm font-medium mb-2">Break-even Point</p>
                <p className="text-3xl font-bold text-white">{calculations.breakEvenItemsPerDay}</p>
                <p className="text-xs text-slate-500 mt-3">Items/day to break even</p>
              </div>

              {/* Daily Sales Volume */}
              <div className="bg-linear-to-br from-black to-slate-900 rounded-2xl p-6 border border-slate-800">
                <p className="text-slate-400 text-sm font-medium mb-2">Daily Sales Volume</p>
                <p className="text-3xl font-bold text-lime-400">{calculations.totalItemsPerDay}</p>
                <p className="text-xs text-slate-500 mt-3">Items sold per day</p>
              </div>

              {/* 6-Month Projection */}
              <div className="bg-linear-to-br from-lime-900 to-lime-950 rounded-2xl p-6 border border-lime-700">
                <p className="text-slate-300 text-sm font-medium mb-2">6-Month Projection</p>
                <p className="text-3xl font-bold text-lime-400">${calculations.futureValue.toFixed(2)}</p>
                <p className="text-xs text-lime-300 mt-3">Cumulative profit forecast</p>
              </div>
            </div>

            {/* Premium Insights */}
            <div className="bg-linear-to-br from-black to-slate-950 rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white text-lg font-semibold">Premium Insights</h3>
                  <p className="text-slate-400 text-sm">Advanced metrics, pricing guidance, and tax impact.</p>
                </div>
                {!isPremium && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-4 py-2 text-xs font-semibold bg-lime-400 text-black rounded-full"
                  >
                    Unlock Premium
                  </button>
                )}
              </div>

              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 ${!isPremium ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-2">Tax Rate (%)</p>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full bg-transparent border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                  />
                  <p className="text-xs text-slate-500 mt-3">Tax amount: ${premiumMetrics.taxAmount.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-2">Discount Rate (%)</p>
                  <input
                    type="number"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    className="w-full bg-transparent border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                  />
                  <p className="text-xs text-slate-500 mt-3">Revenue after discount: ${premiumMetrics.revenueAfterDiscount.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-2">Target Margin (%)</p>
                  <input
                    type="number"
                    value={targetMargin}
                    onChange={(e) => setTargetMargin(Number(e.target.value))}
                    className="w-full bg-transparent border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                  />
                  <p className="text-xs text-slate-500 mt-3">Recommended price/item: ${premiumMetrics.recommendedPricePerItem.toFixed(2)}</p>
                </div>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 ${!isPremium ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400">Net Profit (after tax)</p>
                  <p className="text-2xl font-semibold text-white">${premiumMetrics.netProfit.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-2">Revenue after tax: ${premiumMetrics.revenueAfterTax.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400">Contribution Margin</p>
                  <p className="text-2xl font-semibold text-lime-400">{premiumMetrics.contributionMargin.toFixed(1)}%</p>
                  <p className="text-xs text-slate-500 mt-2">Gross margin: {premiumMetrics.grossMargin.toFixed(1)}%</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400">Break-even Revenue</p>
                  <p className="text-2xl font-semibold text-white">${premiumMetrics.breakEvenRevenue.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-2">Based on fixed costs</p>
                </div>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 ${!isPremium ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400">Best Case (+15%)</p>
                  <p className="text-2xl font-semibold text-lime-400">${premiumMetrics.scenarioBest.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400">Base Case</p>
                  <p className="text-2xl font-semibold text-white">${premiumMetrics.scenarioBase.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400">Worst Case (-15%)</p>
                  <p className={`text-2xl font-semibold ${premiumMetrics.scenarioWorst >= 0 ? "text-white" : "text-red-400"}`}>
                    ${premiumMetrics.scenarioWorst.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className={`grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6 ${!isPremium ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-2">Price Change (%)</p>
                  <input
                    type="number"
                    value={priceChange}
                    onChange={(e) => setPriceChange(Number(e.target.value))}
                    className="w-full bg-transparent border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                  />
                  <p className="text-xs text-slate-500 mt-2">Adjusted revenue: ${premiumMetrics.adjustedRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-2">Volume Change (%)</p>
                  <input
                    type="number"
                    value={volumeChange}
                    onChange={(e) => setVolumeChange(Number(e.target.value))}
                    className="w-full bg-transparent border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                  />
                  <p className="text-xs text-slate-500 mt-2">Adjusted net profit: ${premiumMetrics.adjustedNetProfit.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-2">Cost Change (%)</p>
                  <input
                    type="number"
                    value={costChange}
                    onChange={(e) => setCostChange(Number(e.target.value))}
                    className="w-full bg-transparent border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                  />
                  <p className="text-xs text-slate-500 mt-2">Unit profit: ${premiumMetrics.unitProfit.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400">Unit Revenue</p>
                  <p className="text-2xl font-semibold text-white">${premiumMetrics.unitRevenue.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-2">Per item average</p>
                </div>
              </div>

              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6 ${!isPremium ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-2">Inventory On Hand (units)</p>
                  <input
                    type="number"
                    value={inventoryUnits}
                    onChange={(e) => setInventoryUnits(Number(e.target.value))}
                    className="w-full bg-transparent border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                  />
                  <p className="text-xs text-slate-500 mt-2">Days of stock: {premiumMetrics.daysOfStock.toFixed(1)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-2">Lead Time (days)</p>
                  <input
                    type="number"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                    className="w-full bg-transparent border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                  />
                  <p className="text-xs text-slate-500 mt-2">Reorder point: {premiumMetrics.reorderPoint}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-2">Safety Stock (days)</p>
                  <input
                    type="number"
                    value={safetyStockDays}
                    onChange={(e) => setSafetyStockDays(Number(e.target.value))}
                    className="w-full bg-transparent border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                  />
                  <p className="text-xs text-slate-500 mt-2">Buffer for supply risk</p>
                </div>
              </div>

              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 ${!isPremium ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <CashflowChart
                    data={premiumMetrics.cashflow}
                    projectionMonths={projectionMonths}
                    onProjectionChange={setProjectionMonths}
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <CostStructureChart data={premiumMetrics.costMix} />
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === "forecast" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg text-black">Forecast</h3>
                  <p className="text-sm text-slate-500">Next 3 months outlook</p>
                </div>
                <div className="text-xs text-slate-400">Auto model</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Expected Revenue</p>
                  <p className="text-xl text-black mt-2">${(calculations.monthlyRevenue * 1.05).toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Expected Profit</p>
                  <p className="text-xl text-black mt-2">${(calculations.profit * 1.04).toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Risk Level</p>
                  <p className="text-xl text-black mt-2">{calculations.profit > 0 ? "Stable" : "At Risk"}</p>
                </div>
              </div>
            </div>
          </div>
        )}


        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg text-black">Inventory</h3>
                  <p className="text-sm text-slate-500">Stock health</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Days of Stock</p>
                  <p className="text-xl text-black mt-2">{premiumMetrics.daysOfStock.toFixed(1)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Reorder Point</p>
                  <p className="text-xl text-black mt-2">{premiumMetrics.reorderPoint}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Safety Stock</p>
                  <p className="text-xl text-black mt-2">{safetyStockDays} days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg text-black">Pricing Lab</h3>
                  <p className="text-sm text-slate-500">Margin-based recommendations</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
                <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/40">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Controls</p>
                    <div className="text-xs text-slate-400">Auto‑recalc</div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white border border-slate-200 p-4">
                      <p className="text-xs text-slate-500">Target Margin (%)</p>
                      <input
                        type="number"
                        value={targetMargin}
                        onChange={(e) => setTargetMargin(Number(e.target.value))}
                        className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 p-4">
                      <p className="text-xs text-slate-500">Avg. Price</p>
                      <p className="text-2xl text-black mt-2">${calculations.averagePricePerItem.toFixed(2)}</p>
                      <p className="text-xs text-slate-400 mt-1">Current average</p>
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 p-4">
                      <p className="text-xs text-slate-500">Cost per Item</p>
                      <p className="text-2xl text-black mt-2">${calculations.costPerItem.toFixed(2)}</p>
                      <p className="text-xs text-slate-400 mt-1">Unit cost</p>
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 p-4">
                      <p className="text-xs text-slate-500">Suggested Price</p>
                      <p className="text-2xl text-black mt-2">${premiumMetrics.recommendedPricePerItem.toFixed(2)}</p>
                      <p className="text-xs text-slate-400 mt-1">For target margin</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5 bg-linear-to-br from-black to-slate-900 text-white flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Recommendation</p>
                    <p className="text-3xl font-semibold mt-3">${premiumMetrics.recommendedPricePerItem.toFixed(2)}</p>
                    <p className="text-sm text-slate-400 mt-2">Suggested selling price per item</p>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>Delta vs current avg</span>
                      <span>
                        {(premiumMetrics.recommendedPricePerItem - calculations.averagePricePerItem).toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-3 h-1 bg-slate-700 rounded-full">
                      <div className="h-1 bg-lime-400 rounded-full w-[55%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg  mb-6 text-black">Business Summary Report</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">Business Name</p>
                    <p className=" text-black">{businessName || "Not set"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">Business Type</p>
                    <p className=" text-black">{businessType}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">Products Listed</p>
                    <p className=" text-black">{items.filter(i => i.name).length}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">Daily Sales Volume</p>
                    <p className=" text-black">{calculations.totalItemsPerDay}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">Monthly Revenue</p>
                    <p className=" text-black">${calculations.monthlyRevenue.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">Monthly Profit</p>
                    <p className={` ${calculations.profit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      ${calculations.profit.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className=" text-blue-900 mb-2">Recommendations</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {calculations.profit <= 0 && <li>• Consider reducing costs or increasing prices to achieve profitability</li>}
                  {calculations.profitMargin < 20 && calculations.profit > 0 && <li>• Your profit margin is below average. Look for operational efficiencies</li>}
                  {calculations.roi < 10 && calculations.profit > 0 && <li>• ROI is moderate. Consider scaling or optimizing product mix</li>}
                  {calculations.roi > 50 && <li>• Excellent ROI! Consider reinvesting in growth</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Export Modal with Glassmorphism */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowExportModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white border border-slate-200 rounded-2xl p-0 max-w-2xl w-full shadow-xl overflow-hidden">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl text-black">Export Report</h2>
                  <p className="text-sm text-slate-600">Select a format to download</p>
                </div>
                <div className="text-xs text-slate-400">Receipt Style</div>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden bg-white">
                {exportFormats.map((format) => {
                  const isLocked = !isPremium && format.id !== "image"
                  return (
                    <button
                      key={format.id}
                      onClick={() => handleExport(format.id)}
                      disabled={isLocked}
                      className={`w-full px-4 py-4 flex items-center gap-4 text-left transition ${
                        isLocked ? "cursor-not-allowed opacity-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700">
                        {format.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">{format.name}</div>
                        <div className="text-xs text-slate-500">High‑quality export</div>
                      </div>
                      <div className="text-xs text-slate-400">
                        {isLocked ? "Premium" : "Ready"}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 text-xs text-slate-500 border-t border-dashed border-slate-300 pt-4">
                Tip: JSON keeps full data for safekeeping. Other formats are optimized for sharing.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white/80 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-2v-2m0-4v2m0 4l-5-5m10 10l-5-5m5 5l5 5m-5-5l-5-5" />
                </svg>
              </div>
              <h2 className="text-xl  text-black mb-2">Are you sure?</h2>
              <p className="text-slate-600">
                {confirmAction === "queries"
                  ? "You'll be taken to Enterprise. Any unsaved changes will be lost."
                  : "You'll be taken to Settings. Any unsaved changes will be lost."}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmNavigation}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition"
              >
                {confirmAction === "queries" ? "Go to Enterprise" : "Go to Settings"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowUpgradeModal(false)}
          />
          
          {/* Modal */}
      <div className="relative bg-linear-to-br from-black to-slate-900 border border-lime-400/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <div className="w-16 h-16 bg-lime-400/20 border border-lime-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                <ExportIcon id="image" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Unlock Premium Features</h2>
              <p className="text-slate-400 text-center">
                {promoActive
                  ? "Premium is free during countdown. Complete onboarding and choose Premium to unlock now."
                  : "Upgrade to Premium to unlock analysis, reports, and all export formats."}
              </p>
            </div>

            <div className="bg-white/5 border border-lime-400/20 rounded-xl p-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Analysis & Reports</p>
                    <p className="text-slate-400 text-xs">Full insights and reporting</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">All Export Formats</p>
                    <p className="text-slate-400 text-xs">CSV, JSON, PDF, Excel & Docs</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  if (promoActive) return
                  setShowUpgradeModal(false)
                  startPaywayPayment()
                }}
                className={`px-4 py-3 rounded-lg font-bold transition ${
                  promoActive
                    ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                    : "bg-linear-to-r from-lime-400 to-lime-500 text-black hover:shadow-lg hover:shadow-lime-400/50"
                }`}
                disabled={promoActive}
              >
                {promoActive ? "Free During Countdown" : "Show QR to Pay"}
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center mt-4">
              Limited time offer - just for you!
            </p>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowSettingsModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl border border-slate-200 max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg text-black mb-2">Settings</h2>
            <p className="text-sm text-slate-500 mb-6">Manage your business workspace.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-3">Profile & Business</p>
                <label className="text-xs text-slate-500">Business name</label>
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
                <label className="text-xs text-slate-500 mt-4 block">Currency</label>
                <select
                  value={settingsCurrency}
                  onChange={(e) => setSettingsCurrency(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="USD">USD</option>
                  <option value="KHR">KHR</option>
                  <option value="THB">THB</option>
                </select>
                <label className="text-xs text-slate-500 mt-4 block">Timezone</label>
                <select
                  value={settingsTimezone}
                  onChange={(e) => setSettingsTimezone(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Asia/Phnom_Penh">Asia/Phnom_Penh</option>
                  <option value="Asia/Bangkok">Asia/Bangkok</option>
                  <option value="Asia/Singapore">Asia/Singapore</option>
                </select>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-3">Export & Reports</p>
                <label className="text-xs text-slate-500">Default export</label>
                <select
                  value={settingsDefaultExport}
                  onChange={(e) => setSettingsDefaultExport(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="excel">Excel</option>
                </select>
                <label className="text-xs text-slate-500 mt-4 block">Include logo</label>
                <button
                  onClick={() => setSettingsIncludeLogo((v) => !v)}
                  className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-lg text-left"
                >
                  {settingsIncludeLogo ? "Enabled" : "Disabled"}
                </button>
                <button
                  onClick={() => {
                    setShowSettingsModal(false)
                    setShowExportModal(true)
                  }}
                  className="mt-4 w-full flex items-center justify-between px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  <span className="text-slate-700">Export Data</span>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-3">Notifications</p>
                <button
                  onClick={() => setSettingsEmailSummary((v) => !v)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-left"
                >
                  Email summary: {settingsEmailSummary ? "On" : "Off"}
                </button>
                <button
                  onClick={() => setSettingsWeeklySummary((v) => !v)}
                  className="mt-3 w-full px-3 py-2 border border-slate-200 rounded-lg text-left"
                >
                  Weekly summary: {settingsWeeklySummary ? "On" : "Off"}
                </button>
                <button
                  onClick={() => setSettingsLowMarginAlert((v) => !v)}
                  className="mt-3 w-full px-3 py-2 border border-slate-200 rounded-lg text-left"
                >
                  Low margin alerts: {settingsLowMarginAlert ? "On" : "Off"}
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-3">Data & Privacy</p>
                <button
                  onClick={downloadBusinessData}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-left hover:bg-slate-50"
                >
                  Download data (JSON)
                </button>
                <button
                  onClick={() => {
                    setShowSettingsModal(false)
                    handleNavigation("queries")
                  }}
                  className="mt-3 w-full px-3 py-2 border border-slate-200 rounded-lg text-left hover:bg-slate-50"
                >
                  Enterprise (Edit onboarding)
                </button>
                <button
                  onClick={clearBusinessData}
                  className="mt-3 w-full px-3 py-2 border border-red-200 text-red-600 rounded-lg text-left hover:bg-red-50"
                >
                  Clear business data
                </button>
                <button
                  onClick={() => (window.location.href = "/Enterprise?edit=1")}
                  className="mt-3 w-full px-3 py-2 border border-slate-200 rounded-lg text-left hover:bg-slate-50"
                >
                  Re-open onboarding
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-3">Billing</p>
                <div className="text-sm text-slate-700">Plan: {isPremium ? "Premium" : "Free"}</div>
                <button
                  onClick={() => {
                    setShowSettingsModal(false)
                    startPaywayPayment()
                  }}
                  className="mt-3 w-full px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  {isPremium ? "Manage subscription" : "Upgrade to Premium"}
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-3">Appearance</p>
                <button
                  onClick={() => setSettingsCompactMode((v) => !v)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-left"
                >
                  Compact mode: {settingsCompactMode ? "On" : "Off"}
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-3">Security</p>
                <button
                  onClick={() => signOut({ callbackUrl: "/authentications/signup" })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-left hover:bg-slate-50"
                >
                  Sign out
                </button>
                <button
                  onClick={() => alert("Password reset coming soon.")}
                  className="mt-3 w-full px-3 py-2 border border-slate-200 rounded-lg text-left hover:bg-slate-50"
                >
                  Change password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PayWay QR Modal */}
      {showPaywayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowPaywayModal(false)}
          />

          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <button
              onClick={() => setShowPaywayModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl text-black mb-2">Scan to Pay</h2>
            <p className="text-sm text-slate-600 mb-6">Use ABA or KHQR-supported apps to complete the payment.</p>

            {paywayStatus === "loading" && (
              <div className="py-12 text-center text-slate-500">Generating QR...</div>
            )}

            {paywayStatus === "error" && (
              <div className="py-12 text-center text-red-600">Unable to create QR. Try again.</div>
            )}

            {paywayStatus === "pending" && (
              <div className="flex flex-col items-center gap-4">
                {qrImageSrc ? (
                  <img src={qrImageSrc} alt="PayWay QR" className="w-60 h-60 border rounded-xl" />
                ) : (
                  <div className="w-60 h-60 border rounded-xl flex items-center justify-center text-xs text-slate-400">
                    QR not available
                  </div>
                )}
                <div className="text-xs text-slate-500">Waiting for payment confirmation...</div>
              </div>
            )}

            {paywayStatus === "paid" && (
              <div className="py-10 text-center text-emerald-600">Payment confirmed. Premium unlocked.</div>
            )}

            {paywayTranId && (
              <div className="mt-6 text-xs text-slate-400 text-center">Transaction: {paywayTranId}</div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500">
          <p>© 2024 Business Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Biz
