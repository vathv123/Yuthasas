import Nav from "../components/nav"
import Footer from "../components/footer"

const POSTS = [
  {
    title: "Pricing with confidence",
    description: "Set prices that protect your margin without guesswork.",
  },
  {
    title: "Cashflow made simple",
    description: "Keep track of money in and out with less stress.",
  },
  {
    title: "Hidden costs",
    description: "Find cost leaks that hurt profit without you noticing.",
  },
]

export default function BlogPage() {
  return (
    <div className="w-full max-w-[90vw] m-auto font-[Gilroy-Medium]">
      <Nav />
      <div className="pt-32 pb-16">
        <div className="max-w-[720px]">
          <p className="text-sm uppercase tracking-[0.2em] text-black/40">Blog</p>
          <h1 className="text-[42px] mt-3">Short reads, clear decisions</h1>
          <p className="text-black/60 mt-4">
            Practical tips to help you price better and run your business smarter.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <div key={post.title} className="border border-black/10 rounded-2xl p-6 bg-white">
              <p className="text-lg">{post.title}</p>
              <p className="text-black/60 mt-2">{post.description}</p>
              <p className="text-xs text-black/40 mt-4">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
