import Nav from "../components/nav"
import Footer from "../components/footer"

export default function LegalTermsPage() {
  return (
    <div className="w-full max-w-[90vw] m-auto font-[Gilroy-Medium]">
      <Nav />
      <div className="pt-32 pb-16 max-w-[920px]">
        <p className="text-sm uppercase tracking-[0.2em] text-black/40">Legal Terms</p>
        <h1 className="text-[38px] mt-3">Terms of use</h1>
        <p className="text-black/60 mt-4">
          These Terms of Use govern access to and use of Yuthasas. By accessing or using
          the service, you agree to these terms. If you do not agree, do not use the service.
        </p>

        <div className="mt-10 space-y-10 text-black/70">
          <div>
            <p className="text-black text-xl">Eligibility</p>
            <p className="mt-4">
              You must be at least 18 years old, or the age of majority in your jurisdiction, to use
              Yuthasas. You are responsible for ensuring that your use of the service complies with
              local laws and regulations.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Account registration</p>
            <p className="mt-4">
              You agree to provide accurate, current, and complete information when creating an account,
              and to keep your information up to date. You are responsible for all activity that occurs
              under your account.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Use of the service</p>
            <p className="mt-4">
              You may use the service only for lawful business purposes. You agree not to misuse the
              service, attempt to gain unauthorized access, interfere with availability, or use the
              service to transmit harmful content.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Subscription and billing</p>
            <p className="mt-4">
              Certain features may require a paid subscription. Pricing, billing cycles, and renewal
              terms are presented at the time of purchase. You agree to pay all applicable fees and
              taxes in accordance with the selected plan.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Data accuracy</p>
            <p className="mt-4">
              Yuthasas provides tools to calculate and summarize business information, but accuracy
              depends on the data you input. You are responsible for verifying the accuracy of your
              data and decisions made based on the service.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Intellectual property</p>
            <p className="mt-4">
              The service, including software, design, logos, and content, is owned by Yuthasas and
              protected by applicable laws. You may not copy, modify, distribute, or create derivative
              works without permission.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Availability</p>
            <p className="mt-4">
              We strive to keep the service available and reliable. However, we do not guarantee that
              the service will be uninterrupted, timely, or error-free. Maintenance or updates may result
              in temporary downtime.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Termination</p>
            <p className="mt-4">
              We may suspend or terminate your access if you violate these terms or use the service in
              a way that could cause harm. You may stop using the service at any time.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Limitation of liability</p>
            <p className="mt-4">
              To the fullest extent permitted by law, Yuthasas is not liable for any indirect, incidental,
              or consequential damages, including lost profits or lost data arising from your use of the
              service.
            </p>
          </div>

          <div>
            <p className="text-black text-xl">Changes to terms</p>
            <p className="mt-4">
              We may update these terms from time to time. Continued use of the service after updates
              indicates acceptance of the revised terms.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
