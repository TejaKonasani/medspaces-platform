import Link from 'next/link';
import { Stethoscope } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Stethoscope className="h-7 w-7 text-primary-400" />
              <span className="text-xl font-bold text-white">MedSpaces</span>
            </div>
            <p className="text-sm text-gray-400">
              India&apos;s largest marketplace for consultation spaces. Connecting doctors with available practice spaces.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Doctors</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/browse" className="hover:text-white transition-colors">Browse Spaces</Link></li>
              <li><Link href="/register/doctor" className="hover:text-white transition-colors">Register as Doctor</Link></li>
              <li><Link href="/for-doctors" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Clinics</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/add-space" className="hover:text-white transition-colors">List Your Space</Link></li>
              <li><Link href="/for-clinics" className="hover:text-white transition-colors">Why MedSpaces</Link></li>
              <li><Link href="/branding" className="hover:text-white transition-colors">Branding Services</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About MedSpaces</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} MedSpaces. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
