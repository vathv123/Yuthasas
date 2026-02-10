import Nav from "../components/nav"
import Footer from "../components/footer"

export default function AboutPage() {
  return (
    <div className="w-full max-w-[90vw] m-auto font-[Gilroy-Medium]">
      <Nav />
      <div className="pt-32 pb-16">
        <div className="max-w-[720px]">
          <p className="text-sm uppercase tracking-[0.2em] text-black/40">About Us</p>
          <h1 className="text-[42px] mt-3">We build clarity for growing businesses</h1>
          <p className="text-black/60 mt-4">
            Yuthasas helps owners understand the real numbers behind daily decisions.
            Clean design, practical workflows, and fast insights.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-black/10 rounded-2xl p-6 bg-white">
            <p className="text-lg">Our mission</p>
            <p className="text-black/60 mt-2">
              Make reliable pricing and profit tracking accessible to every business.
            </p>
          </div>
          <div className="border border-black/10 rounded-2xl p-6 bg-white">
            <p className="text-lg">Our promise</p>
            <p className="text-black/60 mt-2">
              Keep the product simple, fast, and professional for real-world use.
            </p>
          </div>
          <div className="border border-black/10 rounded-2xl p-6 bg-white">
            <p className="text-lg">Our approach</p>
            <p className="text-black/60 mt-2">
              We translate messy, real-world business data into clean, actionable insights.
            </p>
          </div>
          <div className="border border-black/10 rounded-2xl p-6 bg-white">
            <p className="text-lg">Built for teams</p>
            <p className="text-black/60 mt-2">
              From solo founders to growing teams, we focus on clarity and speed.
            </p>
          </div>
          <div className="border border-black/10 rounded-2xl p-6 bg-white">
            <p className="text-lg">Design first</p>
            <p className="text-black/60 mt-2">
              We believe dashboards should feel calm, focused, and easy to navigate.
            </p>
          </div>
          <div className="border border-black/10 rounded-2xl p-6 bg-white">
            <p className="text-lg">Continuous improvement</p>
            <p className="text-black/60 mt-2">
              We ship weekly enhancements based on real feedback from business owners.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
