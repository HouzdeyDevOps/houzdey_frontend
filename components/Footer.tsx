import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/assets/images/houzdey-logo.png"
                alt="Houzdey"
                width={220}
                height={132}
                className="h-20 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-4 max-w-sm">
              Nigeria&apos;s trusted platform for finding, renting, and buying
              properties across all 36 states and the FCT.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/people/Houzdey/61583662165446/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/houzdey/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/houzdey/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/support/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/state" className="hover:text-white transition-colors">States</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-400" />
                <span>Plot 519 Biejina Street by Splendour,<br />Airport Extension, Thinkers Corner,<br />Enugu, Enugu State</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                <a href="mailto:Houzdey@gmail.com" className="hover:text-white transition-colors">
                  Houzdey@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Houzdey. A product of{" "}
            <span className="text-gray-400 font-medium">Keleddy Innovations Limited</span>{" "}
            (RC No. 8989070). All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Plot 519 Biejina Street, Thinkers Corner, Enugu State
          </p>
        </div>
      </div>
    </footer>
  );
}
