import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10" aria-label="Site footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">FROZEN THREAD</h3>
            <p className="text-gray-400 mb-4">
              Premium streetwear for the bold. Authentic style meets quality craftsmanship.
            </p>
            <p className="text-sm text-gray-500">Made with passion 🖤</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Shop</h4>
            <nav aria-label="Shop navigation">
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/?category=Cartoon Caus MERCH" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    Cartoon Caus
                  </Link>
                </li>
                <li>
                  <Link href="/?category=Harry Potter MERCH" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    Harry Potter
                  </Link>
                </li>
                <li>
                  <Link href="/?category=Spooky MERCH" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    Spooky Merch
                  </Link>
                </li>
                <li>
                  <Link href="/?category=Anime MERCH" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    Anime Merch
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <nav aria-label="Support navigation">
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                    FAQ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Connect</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📧 hello@frozenthread.com</p>
              <p>📱 @thefrozenthread</p>
              <p>🚚 Free shipping on ₹2000+</p>
              <p>💳 Secure payments</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; 2024 FROZEN THREAD. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-gray-400">🔒 SSL Secured</span>
            <span className="text-sm text-gray-400">🇮🇳 Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
