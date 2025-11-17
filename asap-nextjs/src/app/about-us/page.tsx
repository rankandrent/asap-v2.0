import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - ASAP-Amatom.com | Official Amatom Parts Distributor',
  description: 'ASAP Semiconductor is a solution-based system integrator offering custom-procurement, distribution, logistics, and project management solutions for aerospace and industrial parts. Official Amatom parts distributor with 500,000+ parts in stock.',
  keywords: 'about ASAP Semiconductor, Amatom distributor, aerospace parts distributor, defense contractor, logistics solutions, parts procurement, ASAP-Amatom about',
  alternates: {
    canonical: 'https://asap-amatom.com/about-us',
  },
  openGraph: {
    title: 'About Us - ASAP-Amatom.com | Official Amatom Parts Distributor',
    description: 'ASAP Semiconductor - Official Amatom parts distributor with 500,000+ parts in stock. Custom procurement, distribution, and logistics solutions.',
    url: 'https://asap-amatom.com/about-us',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - ASAP-Amatom.com',
    description: 'Official Amatom parts distributor with 500,000+ parts in stock',
  },
}

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About ASAP-Amatom.com</h1>
      
      <div className="prose max-w-4xl">
        <p className="text-lg text-gray-700 mb-6">
          ASAP Semiconductor is a solution-based system integrator offering custom-procurement, 
          distribution, logistics, and project management solutions for aerospace and industrial parts.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          We provide access to over 500,000 Amatom parts with fast, reliable service and 
          comprehensive support for aerospace and industrial applications.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
        <p className="text-gray-700">
          Phone: <a href="tel:+17147054780" className="text-blue-600 hover:underline">+1 (714) 705-4780</a>
          <br />
          Email: <a href="mailto:quotes@asap-amatom.com" className="text-blue-600 hover:underline">quotes@asap-amatom.com</a>
        </p>
      </div>
    </div>
  )
}

