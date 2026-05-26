export default function PrivacyPage() {
  return (
    <div className="section-padding max-w-3xl mx-auto prose prose-gray">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-gray-500 mt-2">Last updated: January 2024</p>

      <div className="mt-8 space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
          <p>We collect information you provide directly, including name, email, phone number, professional qualifications, and facility details when you register or list a space on MedSpaces.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
          <p>We use your information to operate the marketplace, connect doctors with clinics, send relevant notifications, and improve our services.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Information Sharing</h2>
          <p>We share contact information between doctors and clinics only when an inquiry is made. We do not sell your data to third parties.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Data Security</h2>
          <p>We implement industry-standard security measures including SSL encryption and secure form submission to protect your data.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Contact Us</h2>
          <p>For privacy-related questions, contact us at privacy@medspaces.com.</p>
        </section>
      </div>
    </div>
  );
}
