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

          <div className="mt-16 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm shadow-slate-900/5">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-100">The problem we solve</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">Making practice space discovery feel modern, not manual.</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-primary-100">
                  MedSpaces connects two sides of the healthcare market that usually struggle to find each other. The result is less friction for doctors and better utilization for clinics.
                </p>
              </div>

              <div className="grid gap-4 bg-slate-50 px-6 py-6 sm:px-8 sm:py-8">
                <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                      <Target className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">For doctors</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    High setup costs, scattered availability, and low market visibility make it hard to start or expand a practice quickly.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                      <Heart className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">For clinics</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Idle consultation rooms stay underused when there is no reliable way to reach the right doctors at the right time.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <Globe className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Our solution</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    A centralized marketplace makes discovery, review, and inquiry management feel consistent, trustworthy, and ready for real usage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
