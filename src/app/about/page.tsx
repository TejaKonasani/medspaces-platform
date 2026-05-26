import { Target, Heart, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="section-padding py-20">
          <h1 className="text-4xl md:text-5xl font-bold">About MedSpaces</h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl">
            Building India&apos;s largest marketplace for consultation spaces, connecting healthcare talent with infrastructure.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600">
            MedSpaces exists to bridge the gap between unused healthcare infrastructure and medical professionals seeking practice spaces. We believe every doctor should have access to quality consultation spaces without the burden of setting up independent clinics.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Our Vision</h3>
              <p className="mt-2 text-gray-600">To become India&apos;s largest marketplace for consultation spaces</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Our Purpose</h3>
              <p className="mt-2 text-gray-600">Enabling doctors to build flexible practices without heavy investment</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <Globe className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Our Reach</h3>
              <p className="mt-2 text-gray-600">Operating across multiple cities with plans for nationwide expansion</p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold">The Problem We Solve</h2>
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <h3 className="font-semibold text-red-800">For Doctors</h3>
                <p className="text-red-700 mt-1">High clinic setup costs, difficulty finding locations, and lack of visibility into available spaces create barriers to starting independent practice.</p>
              </div>
              <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                <h3 className="font-semibold text-orange-800">For Clinics</h3>
                <p className="text-orange-700 mt-1">Many healthcare facilities have idle consultation rooms due to lack of marketing, difficulty reaching doctors, and inefficient infrastructure utilization.</p>
              </div>
              <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                <h3 className="font-semibold text-green-800">Our Solution</h3>
                <p className="text-green-700 mt-1">MedSpaces creates a centralized discovery platform that connects medical talent with available healthcare infrastructure, solving both sides of the marketplace.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
