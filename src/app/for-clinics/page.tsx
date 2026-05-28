import Link from 'next/link';
import { TrendingUp, Eye, Users, Shield, BarChart3, Megaphone } from 'lucide-react';

export default function ForClinicsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-secondary-600 to-secondary-800 text-white">
        <div className="section-padding py-20">
          <h1 className="text-4xl md:text-5xl font-bold">For Clinics & Hospitals</h1>
          <p className="mt-4 text-xl text-secondary-100 max-w-2xl">
            Monetize your idle consultation rooms. Connect with verified doctors looking for practice spaces.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/login?redirect=/add-space" className="btn-primary bg-white text-secondary-700 hover:bg-gray-100">
              Sign in to list
            </Link>
            <Link href="/register?role=CLINIC_OWNER" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white bg-secondary-600 px-6 py-3 font-semibold text-white shadow-sm shadow-secondary-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary-700 hover:shadow-md hover:shadow-secondary-600/25 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-700">
              Register
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <h2 className="text-3xl font-bold text-center">Benefits of Listing on MedSpaces</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            { icon: TrendingUp, title: 'Revenue from Idle Rooms', desc: 'Turn unused consultation rooms into a steady income stream.' },
            { icon: Eye, title: 'Visibility to Doctors', desc: 'Get discovered by hundreds of doctors actively searching for spaces.' },
            { icon: Users, title: 'Quality Doctors', desc: 'Connect with verified specialists who bring their patient base.' },
            { icon: Shield, title: 'Admin Verified', desc: 'Our team helps maintain quality with listing moderation and verification.' },
            { icon: BarChart3, title: 'Lead Management', desc: 'Receive and track inquiries from interested doctors seamlessly.' },
            { icon: Megaphone, title: 'Branding Services', desc: 'Optional marketing and branding support to boost your facility.' },
          ].map((item) => (
            <div key={item.title} className="p-6 border border-gray-200 rounded-xl">
              <item.icon className="h-10 w-10 text-secondary-600" />
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="section-padding">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>
          <div className="mt-12 max-w-2xl mx-auto space-y-6">
            {[
              { step: '1', title: 'Submit Your Listing', desc: 'Fill in your facility details, room info, pricing, and upload photos.' },
              { step: '2', title: 'Admin Review', desc: 'Our team reviews and verifies your listing for quality assurance.' },
              { step: '3', title: 'Go Live', desc: 'Your listing is published and visible to hundreds of doctors.' },
              { step: '4', title: 'Receive Inquiries', desc: 'Get calls, WhatsApp messages, and inquiry forms from interested doctors.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-secondary-100 text-secondary-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary-700 text-white">
        <div className="section-padding text-center">
          <h2 className="text-3xl font-bold">Start Earning from Your Space</h2>
          <p className="mt-4 text-secondary-100">Sign in to list your consultation rooms, or register if you do not have a clinic account yet.</p>
          <Link href="/login?redirect=/add-space" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-white bg-secondary-600 px-6 py-3 font-semibold text-white shadow-sm shadow-secondary-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary-700 hover:shadow-md hover:shadow-secondary-600/25 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-700">
            Sign in to list
          </Link>
        </div>
      </section>
    </>
  );
}
