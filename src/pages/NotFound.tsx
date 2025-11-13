import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import SEO from "../components/common/SEO"

export default function NotFound() {
  return (
    <>
      <SEO
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Browse our catalog of 500,000+ Amatom aerospace and industrial parts."
        canonical="https://asap-amatom.com/404"
        noIndex={true}
      />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>Go to Homepage</Button>
        </Link>
      </div>
    </>
  )
}

