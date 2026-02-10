import Nav from "../components/nav"
import Footer from "../components/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full max-w-[90vw] m-auto font-[Gilroy-Medium]">
      <Nav />
      <div className="pt-32 pb-16 max-w-[920px]">
        <p className="text-sm uppercase tracking-[0.2em] text-black/40">Privacy Policy</p>
        <h1 className="text-[38px] mt-3">Your data, protected</h1>
        <p className="text-black/60 mt-4">
          This Privacy Policy describes how Yuthasas collects, uses, and protects your
          information. We only collect the data needed to provide the service, and we do
          not sell your personal information.
        </p>

        <div className="mt-10 space-y-10 text-black/70">
          <div>
            <p className="text-black text-xl">Information we collect</p>
            <p className="mt-4">
              We collect information you provide directly, such as your name, email address,
              business details, and data you input into the calculator. We may also collect
              technical data such as device type, browser, and usage patterns to improve performance.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">How we use information</p>
            <p className="mt-4">
              We use your information to authenticate accounts, provide calculations and reports,
              save your business data, and improve the product. We may also use aggregated usage data
              to understand feature adoption and optimize performance.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Data storage and security</p>
            <p className="mt-4">
              Business data is stored securely in our database. We implement safeguards such as access
              controls and secure transport. No system is 100% secure, but we continually improve our
              security practices.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Sharing of information</p>
            <p className="mt-4">
              We do not sell your data. We may share information with service providers that help us run
              the platform (e.g., authentication, analytics, or payment processing) under strict confidentiality.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Data retention</p>
            <p className="mt-4">
              We retain data for as long as your account is active or as needed to provide the service.
              You may request deletion of your data, subject to legal or operational requirements.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Your rights</p>
            <p className="mt-4">
              You may request access, correction, or deletion of your personal information. You may also
              request a copy of your stored data through the settings panel.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Third‑party services</p>
            <p className="mt-4">
              If you sign in with a third‑party provider (such as Google), their privacy policies also apply.
              We recommend reviewing their policies to understand how they handle your data.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Changes to this policy</p>
            <p className="mt-4">
              We may update this policy to reflect changes in law or product functionality. We will post
              updates on this page, and continued use indicates acceptance of the revised policy.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
