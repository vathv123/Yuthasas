import Nav from "../components/nav"
import Footer from "../components/footer"

const FEATURES = [
  "Smart pricing calculator",
  "Profit & loss tracking",
  "Break-even analysis",
  "Inventory planning",
  "Cashflow forecast",
  "Export-ready reports",
]

export default function FeaturesPage() {
  return (
    <div className="w-full max-w-[90vw] m-auto font-[Gilroy-Medium]">
      <Nav />
      <div className="pt-32 pb-16">
        <div className="max-w-[720px]">
          <p className="text-sm uppercase tracking-[0.2em] text-black/40">Features</p>
          <h1 className="text-[42px] mt-3">Everything you need, clean and fast</h1>
          <p className="text-black/60 mt-4">
            Practical tools designed for real business decisions.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature) => (
            <div key={feature} className="border border-black/10 rounded-2xl p-6 bg-white">
              <p className="text-lg">{feature}</p>
              <p className="text-black/60 mt-2">Clear, reliable, and easy to use.</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
