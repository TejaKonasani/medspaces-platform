'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, ChevronDown, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="section-padding py-16">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-3 text-primary-100 text-lg">Have questions? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Mail className="h-8 w-8 text-primary-600" />
              <h3 className="mt-3 font-semibold text-lg">Email</h3>
              <a className="mt-1 block text-gray-600 transition-colors hover:text-primary-700" href="mailto:2200080216@kluniversity.in">2200080216@kluniversity.in</a>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Phone className="h-8 w-8 text-primary-600" />
              <h3 className="mt-3 font-semibold text-lg">Phone</h3>
              <a className="mt-1 block text-gray-600 transition-colors hover:text-primary-700" href="tel:9059503227">9059503227</a>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <MapPin className="h-8 w-8 text-primary-600" />
              <h3 className="mt-3 font-semibold text-lg">Office</h3>
              <p className="mt-1 text-gray-600">Hyderabad, Telangana, India</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto">
                    <Send className="h-8 w-8 text-secondary-600" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">Message Sent!</h3>
                  <p className="mt-2 text-gray-600">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                      <input type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <button type="submit" className="btn-primary w-full">Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">FAQ</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">Frequently asked questions</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {[
              { q: 'How do doctors book spaces?', a: 'Doctors browse the marketplace, open a listing, and submit an inquiry. Clinics can then respond and move the request through the workflow.' },
              { q: 'How do clinics list consultation rooms?', a: 'Clinics use the List Your Space flow to submit facility details, pricing, city, and room information for review.' },
              { q: 'What is the verification process?', a: 'Listings are reviewed for completeness and quality before they are marked verified and promoted more prominently.' },
              { q: 'How does pricing work?', a: 'Pricing can be monthly, per slot, or a combination depending on the clinic setup and the room owner preferences.' },
              { q: 'What happens after an inquiry is submitted?', a: 'The inquiry enters the workflow, is reviewed by the relevant clinic or admin team, and then progresses through contact, discussion, matching, or closure.' },
              { q: 'How fast do responses usually happen?', a: 'Response timelines vary by clinic, but the workflow is designed so follow-up can happen as quickly as possible after the inquiry arrives.' },
              { q: 'How is safety and trust handled?', a: 'Verified listings, role-aware access, and structured workflow handling help keep the platform organized and trustworthy.' },
            ].map((item) => (
              <details key={item.q} className="group rounded-2xl border border-gray-200 bg-slate-50 px-5 py-4 open:bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <span className="text-base font-semibold text-gray-900">{item.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 pr-6 text-sm leading-6 text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
