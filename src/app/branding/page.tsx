import Link from 'next/link';
import { Megaphone, Globe, Camera, TrendingUp, Palette, BarChart3 } from 'lucide-react';

export default function BrandingPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="section-padding py-20">
          <h1 className="text-4xl md:text-5xl font-bold">Branding & Growth Services</h1>
          <p className="mt-4 text-xl text-purple-100 max-w-2xl">
            Elevate your clinic&apos;s brand presence and attract more patients with our professional marketing services.
          </p>
          <Link href="/contact" className="mt-8 inline-block btn-primary bg-white text-purple-700 hover:bg-gray-100">
            Get a Quote
          </Link>
        </div>
      </section>

      <section className="section-padding">
        <h2 className="text-3xl font-bold text-center">Our Services</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            { icon: Globe, title: 'Digital Presence', desc: 'Website design, Google Business listing, and online directory placements.' },
            { icon: Camera, title: 'Professional Photography', desc: 'High-quality photos of your facility for listings and marketing materials.' },
            { icon: Palette, title: 'Brand Identity', desc: 'Logo design, color schemes, signage, and brand guidelines for your clinic.' },
            { icon: Megaphone, title: 'Social Media Marketing', desc: 'Instagram, Facebook, and LinkedIn marketing to reach doctors and patients.' },
            { icon: BarChart3, title: 'SEO & Local Search', desc: 'Optimize your online presence for local search to attract nearby patients.' },
            { icon: TrendingUp, title: 'Growth Consulting', desc: 'Strategic advice on expanding your practice and optimizing operations.' },
          ].map((item) => (
            <div key={item.title} className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors">
              <item.icon className="h-10 w-10 text-purple-600" />
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-purple-700 text-white">
        <div className="section-padding text-center">
          <h2 className="text-3xl font-bold">Ready to Grow Your Practice?</h2>
          <p className="mt-4 text-purple-100">Contact us for a free consultation on branding and growth services</p>
          <Link href="/contact" className="mt-6 inline-block btn-primary bg-white text-purple-700 hover:bg-gray-100">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
