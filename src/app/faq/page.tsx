'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { q: 'What is MedSpaces?', a: 'MedSpaces is a digital marketplace that connects doctors seeking consultation spaces with clinics, hospitals, and diagnostic centers that have available OPD rooms.' },
  { q: 'How do I list my consultation space?', a: 'Click "List Your Space" and fill in your facility details including room information, pricing, availability, and photos. Our team will review and approve your listing within 24-48 hours.' },
  { q: 'Is there a fee to list on MedSpaces?', a: 'Listing on MedSpaces is currently free during our launch phase. We may introduce premium listing features in the future.' },
  { q: 'How do I register as a doctor?', a: 'Click "Register as Doctor" and fill in your professional details including qualification, specialty, and preferred locations. Once registered, you can browse and inquire about listings.' },
  { q: 'How does the inquiry system work?', a: 'You can contact clinics directly via call or WhatsApp, or submit an inquiry form. You can also request an introduction through MedSpaces where our team facilitates the connection.' },
  { q: 'Are listings verified?', a: 'Yes, our admin team reviews every listing before it goes live. Verified listings display a blue badge indicating they have been confirmed by our team.' },
  { q: 'What cities are you available in?', a: 'We are currently available in Hyderabad, Bangalore, Mumbai, Delhi, Chennai, and Pune. We are rapidly expanding to more cities.' },
  { q: 'What types of spaces are available?', a: 'You can find consultation rooms in clinics, hospitals, diagnostic centers, and polyclinics. Spaces range from basic consultation rooms to fully-equipped specialist chambers.' },
  { q: 'Can I practice at multiple locations?', a: 'Absolutely! MedSpaces is designed for doctors who want to consult at multiple locations. You can inquire about as many listings as you like.' },
  { q: 'What are the typical costs?', a: 'Costs vary by city and facility type. Monthly fees typically range from ₹15,000 to ₹55,000. Some facilities also offer per-slot pricing starting from ₹500 per slot.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="section-padding py-16">
          <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="mt-3 text-primary-100 text-lg">Everything you need to know about MedSpaces</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-primary-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-600">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
