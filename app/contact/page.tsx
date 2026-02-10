import Nav from "../components/nav"
import Footer from "../components/footer"

export default function ContactPage() {
  return (
    <div className="w-full max-w-[90vw] m-auto font-[Gilroy-Medium]">
      <Nav />
      <div className="pt-32 pb-16">
        <div className="max-w-[720px]">
          <p className="text-sm uppercase tracking-[0.2em] text-black/40">Contact</p>
          <h1 className="text-[42px] mt-3">Let’s talk about your business</h1>
          <p className="text-black/60 mt-4">
            Share what you’re working on and we will get back to you quickly.
          </p>
        </div>
        <div className="mt-10 max-w-[720px] border border-black/10 rounded-2xl p-6 bg-white">
          <form action="mailto:imborvath@gmail.com" method="post" encType="text/plain" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="firstName" placeholder="First name" className="border border-black/20 rounded-lg px-3 py-2 focus:outline-none" />
              <input name="lastName" placeholder="Last name" className="border border-black/20 rounded-lg px-3 py-2 focus:outline-none" />
            </div>
            <input name="email" type="email" placeholder="Email (required)" className="w-full border border-black/20 rounded-lg px-3 py-2 focus:outline-none" />
            <textarea name="message" placeholder="How can we help?" className="w-full border border-black/20 rounded-lg p-3 h-[140px] resize-y focus:outline-none"></textarea>
            <button type="submit" className="w-full bg-black text-white rounded-lg py-2">Send Message</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
