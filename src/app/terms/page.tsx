export default function TermsPage() {
  return (
    <div className="section-padding max-w-3xl mx-auto prose prose-gray">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-gray-500 mt-2">Last updated: January 2024</p>

      <div className="mt-8 space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
          <p>By accessing and using MedSpaces, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. Platform Services</h2>
          <p>MedSpaces provides a marketplace platform connecting healthcare facilities with consultation space availability to medical practitioners seeking such spaces.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. User Responsibilities</h2>
          <p>Users must provide accurate information. Clinics must ensure listed spaces are available as described. Doctors must provide valid registration credentials.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Listing Guidelines</h2>
          <p>All listings are subject to admin approval. MedSpaces reserves the right to remove listings that do not meet quality standards or contain inaccurate information.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Disclaimer</h2>
          <p>MedSpaces acts as a platform to connect parties. We do not guarantee any specific outcome from connections made through the platform.</p>
        </section>
      </div>
    </div>
  );
}
