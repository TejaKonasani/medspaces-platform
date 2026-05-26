import Link from 'next/link';
import { Search, MapPin, Calendar, ShieldCheck, IndianRupee, Users } from 'lucide-react';

export default function ForDoctorsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="section-padding py-20">
          <h1 className="text-4xl md:text-5xl font-bold">For Doctors</h1>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl">
            Start or expand your practice without the hassle of setting up an independent clinic. Find ready-to-use consultation spaces near you.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/browse" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Browse Spaces
            </Link>
            <Link href="/register/doctor" className="btn-outline border-white text-white hover:bg-white/10">
              Register Now
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <h2 className="text-3xl font-bold text-center">Why Doctors Choose MedSpaces</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            { icon: IndianRupee, title: 'Save on Setup Costs', desc: 'No need to invest lakhs in clinic infrastructure. Pay only for the space you need.' },
            { icon: MapPin, title: 'Multiple Locations', desc: 'Practice in different localities to reach more patients without multiple clinic investments.' },
            { icon: Calendar, title: 'Flexible Scheduling', desc: 'Choose your consulting days and hours. Work at times that suit your schedule.' },
            { icon: ShieldCheck, title: 'Verified Facilities', desc: 'All facilities are verified for quality, equipment, and infrastructure by our team.' },
            { icon: Search, title: 'Easy Discovery', desc: 'Search and filter by specialty, location, budget, and availability in seconds.' },
            { icon: Users, title: 'Patient Footfall', desc: 'Benefit from existing patient traffic at established clinics and hospitals.' },
          ].map((item) => (
            <div key={item.title} className="p-6 border border-gray-200 rounded-xl">
              <item.icon className="h-10 w-10 text-primary-600" />
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="section-padding">
          <h2 className="text-3xl font-bold text-center">Who Is This For?</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {['Young specialists starting independent practice', 'Doctors expanding to new localities', 'Visiting consultants needing temporary spaces', 'Specialists like Dermatologists, Psychiatrists, Endocrinologists', 'Doctors seeking flexible part-time consulting arrangements'].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-700 text-white">
        <div className="section-padding text-center">
          <h2 className="text-3xl font-bold">Ready to Find Your Space?</h2>
          <p className="mt-4 text-primary-100">Register now and start browsing verified consultation spaces</p>
          <Link href="/register/doctor" className="mt-6 inline-block btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Register as Doctor
          </Link>
        </div>
      </section>
    </>
  );
}
