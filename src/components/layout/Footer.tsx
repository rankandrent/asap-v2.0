import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">ASAP-Amatom.com</h3>
            <p className="text-sm text-muted-foreground">
              Official catalog for Amatom aerospace and industrial parts.
              500,000+ parts available.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-primary">
                  Search
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Manufacturer: Amatom</li>
              <li>Parts Catalog</li>
              <li>Industrial & Aerospace</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="tel:+17147054780" className="hover:text-primary transition-colors flex items-center gap-2">
                  <span>📞</span>
                  <span>+1 (714) 705-4780</span>
                </a>
              </li>
              <li>
                <a href="mailto:quotes@asap-amatom.com" className="hover:text-primary transition-colors">
                  quotes@asap-amatom.com
                </a>
              </li>
              <li>Website: asap-amatom.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ASAP-Amatom.com. All rights reserved.</p>
          <p className="mt-2">Powered by <span className="font-semibold text-primary">Umar</span></p>
        </div>
      </div>
    </footer>
  )
}

