import Nav from "../components/nav"
import Footer from "../components/footer"

const SERVICES = [
  {
    title: "Business setup",
    description: "Structure costs, pricing, and reporting from day one.",
  },
  {
    title: "Data cleanup",
    description: "Turn messy numbers into clear insights you can trust.",
  },
  {
    title: "Growth planning",
    description: "Model scenarios to scale without surprises.",
  },
]

export default function ServicesPage() {
  return (
    <div className="w-full max-w-[90vw] m-auto font-[Gilroy-Medium]">
      <Nav />
      <div className="pt-32 pb-16">
        <div className="max-w-[720px]">
          <p className="text-sm uppercase tracking-[0.2em] text-black/40">Services</p>
          <h1 className="text-[42px] mt-3">Support beyond the calculator</h1>
          <p className="text-black/60 mt-4">
            When you need tailored guidance, we help you structure and scale.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div key={service.title} className="border border-black/10 rounded-2xl p-6 bg-white">
              <p className="text-lg">{service.title}</p>
              <p className="text-black/60 mt-2">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
