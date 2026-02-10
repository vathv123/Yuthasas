import Nav from "../components/nav"
import Footer from "../components/footer"

const BUSINESS_TYPES = [
  {
    title: "Street Food Stall",
    description: "Quick margin tracking, daily profits, and ingredient cost control.",
  },
  {
    title: "Small Company",
    description: "Cashflow planning and pricing clarity for steady growth.",
  },
  {
    title: "Medium Company",
    description: "Scenario planning and cost visibility across products.",
  },
  {
    title: "Big Company",
    description: "Advanced tracking, audits, and multi-team performance.",
  },
]

export default function BusinessesPage() {
  return (
    <div className="w-full max-w-[90vw] m-auto font-[Gilroy-Medium]">
      <Nav />
      <div className="pt-32 pb-16">
        <div className="max-w-[720px]">
          <p className="text-sm uppercase tracking-[0.2em] text-black/40">Businesses</p>
          <h1 className="text-[42px] mt-3">Built for every business size</h1>
          <p className="text-black/60 mt-4">
            Choose the business type closest to you and see how Yuthasas supports your workflow.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {BUSINESS_TYPES.map((item) => (
            <div key={item.title} className="border border-black/10 rounded-2xl p-6 bg-white">
              <p className="text-lg">{item.title}</p>
              <p className="text-black/60 mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
