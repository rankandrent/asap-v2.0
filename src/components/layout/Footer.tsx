import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">ASAPAmatom.com</h3>
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
              <li>Website: asapamatom.netlify.app</li>
              <li>For inquiries, please contact us</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ASAPAmatom.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

