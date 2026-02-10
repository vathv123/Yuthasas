import Nav from "../components/nav"
import Footer from "../components/footer"

const GUIDES = [
  {
    title: "Start in 10 minutes",
    description: "Set up your first business and record costs fast.",
  },
  {
    title: "Break-even basics",
    description: "Know how many sales you need to cover expenses.",
  },
  {
    title: "Inventory planning",
    description: "Plan stock and avoid overbuying.",
  },
]

export default function GuidePage() {
  return (
    <div className="w-full max-w-[90vw] m-auto font-[Gilroy-Medium]">
      <Nav />
      <div className="pt-32 pb-16">
        <div className="max-w-[720px]">
          <p className="text-sm uppercase tracking-[0.2em] text-black/40">Guide</p>
          <h1 className="text-[42px] mt-3">Step-by-step workflows</h1>
          <p className="text-black/60 mt-4">
            Learn the core workflows to get clean data and reliable results.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <div key={guide.title} className="border border-black/10 rounded-2xl p-6 bg-white">
              <p className="text-lg">{guide.title}</p>
              <p className="text-black/60 mt-2">{guide.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
