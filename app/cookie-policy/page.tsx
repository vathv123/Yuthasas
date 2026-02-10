import Nav from "../components/nav"
import Footer from "../components/footer"

export default function CookiePolicyPage() {
  return (
    <div className="w-full max-w-[90vw] m-auto font-[Gilroy-Medium]">
      <Nav />
      <div className="pt-32 pb-16 max-w-[920px]">
        <p className="text-sm uppercase tracking-[0.2em] text-black/40">Cookies Policy</p>
        <h1 className="text-[38px] mt-3">How we use cookies</h1>
        <p className="text-black/60 mt-4">
          This Cookies Policy explains what cookies are, how Yuthasas uses them, and the
          choices you have. We use cookies and similar technologies to keep sessions secure,
          remember your preferences, and improve how the product performs.
        </p>

        <div className="mt-10 space-y-10 text-black/70">
          <div>
            <p className="text-black text-xl">What are cookies?</p>
            <p className="mt-4">
              Cookies are small text files stored on your device by your browser. They allow a website to
              remember actions and preferences, such as login state, language, and display settings, over
              a period of time so you do not have to re-enter them whenever you return or navigate between pages.
            </p>
            <p className="mt-4">
              Cookies do not typically contain information that personally identifies you, but information
              that we store about you may be linked to the data stored in and obtained from cookies. We
              handle all cookie-derived data in accordance with this policy and our Privacy Policy.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">How Yuthasas uses cookies</p>
            <p className="mt-4">
              We use cookies to keep you signed in, protect your account, maintain reliable platform
              performance, and understand which parts of the product are most useful. This helps us
              improve speed, reduce errors, and deliver a smoother experience across devices.
            </p>
            <p className="mt-4">
              Cookies allow us to remember the choices you make, such as business preferences, layout
              options, and recent activity, so your experience feels consistent and efficient each time
              you return. They also help us troubleshoot issues by understanding how the service behaves
              under different usage patterns.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Types of cookies we use</p>
            <p className="mt-4">
              We use essential cookies for core functionality, preference cookies to remember settings,
              and performance cookies to measure product quality. Some third‑party services used for
              authentication or analytics may set their own cookies, and those providers maintain their
              own policies and controls.
            </p>
            <p className="mt-4">
              Essential cookies are required for session security and user authentication. Preference
              cookies remember your selections to improve usability. Performance cookies allow us to
              understand trends and optimize load time, while keeping data aggregated where possible.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Managing your cookies</p>
            <p className="mt-4">
              You can control or delete cookies in your browser settings. Most browsers allow you to refuse
              cookies or alert you when a cookie is being sent. If you disable cookies, some features of the
              platform may not work correctly.
            </p>
            <p className="mt-4">
              Each browser manages cookies differently, so we encourage you to review your browser’s help
              pages for specific instructions. You can also clear stored cookies to reset your preferences
              and sign-in state if needed.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Retention</p>
            <p className="mt-4">
              Cookies may be session-based (deleted when you close your browser) or persistent (remain on
              your device until they expire or are deleted). We retain cookies only as long as necessary for
              the purposes described.
            </p>
            <p className="mt-4">
              We periodically review and remove cookies that are no longer needed, and we minimize the
              retention period wherever possible without reducing the functionality or security of the service.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Updates to this policy</p>
            <p className="mt-4">
              We may update this policy to reflect changes in technology, regulations, or our services.
              When we do, we will update the content on this page and adjust the date of the policy.
            </p>
            <p className="mt-4">
              We encourage you to review this page periodically so you can stay informed about how we use
              cookies and how you can manage your preferences.
            </p>
          </div>
          <div>
            <p className="text-black text-xl">Contact</p>
            <p className="mt-4">
              If you have any questions about this Cookies Policy or our use of cookies, please contact us
              using the information listed on the Contact page. We are happy to clarify any part of this policy.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
