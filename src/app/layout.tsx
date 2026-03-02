import type { Metadata } from 'next'
import './globals.css'
import Chatbot from '../components/Chatbot'

export const metadata: Metadata = {
  title: 'SchemeFinder AI - Government Services Explorer',
  description: 'AI-assisted, hallucination-free government scheme discovery and deterministic eligibility verification.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
           <header style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '16px 0', borderBottom: '4px solid var(--secondary)' }}>
              <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <img src="/logo.png" alt="SchemeFinder AI Logo" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                     <div>
                        <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem', letterSpacing: '0.5px' }}>SchemeFinder AI</h1>
                        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Government of India Initiative</p>
                     </div>
                  </div>
                  <nav style={{ display: 'flex', gap: '24px' }}>
                      <a href="/" style={{ color: 'white', fontWeight: 500, opacity: 0.9 }}>Home</a>
                      <a href="/about" style={{ color: 'white', fontWeight: 500, opacity: 0.9 }}>About</a>
                      <a href="/contact" style={{ color: 'white', fontWeight: 500, opacity: 0.9 }}>Contact</a>
                  </nav>
              </div>
           </header>

           <main style={{ flex: 1, padding: '40px 0' }}>
               {children}
           </main>
           
           <footer style={{ backgroundColor: '#1C2833', color: 'white', padding: '40px 0 20px 0', marginTop: 'auto' }}>
               <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '30px' }}>
                   <div>
                       <h3 style={{ color: 'var(--secondary)', marginBottom: '16px', fontSize: '1.2rem' }}>SchemeFinder AI</h3>
                       <p style={{ fontSize: '0.9rem', color: '#AAB7B8', lineHeight: '1.6' }}>Government-grade platform ensuring accurate scheme discovery, definitive eligibility, and zero hallucinations.</p>
                   </div>
                   <div>
                       <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '1.1rem' }}>Important Links</h3>
                       <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                           <li><a href="https://india.gov.in/" target="_blank" rel="noopener noreferrer" style={{ color: '#AAB7B8', fontSize: '0.9rem' }}>National Portal of India</a></li>
                           <li><a href="https://www.mygov.in/" target="_blank" rel="noopener noreferrer" style={{ color: '#AAB7B8', fontSize: '0.9rem' }}>MyGov</a></li>
                           <li><a href="https://digitalindia.gov.in/" target="_blank" rel="noopener noreferrer" style={{ color: '#AAB7B8', fontSize: '0.9rem' }}>Digital India</a></li>
                       </ul>
                   </div>
               </div>
               <div className="container" style={{ borderTop: '1px solid #34495E', paddingTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#85929E' }}>
                   <p>© 2026 Navira AI. All Rights Reserved. Not for unauthorized distribution.</p>
               </div>
           </footer>
           <Chatbot />
        </div>
      </body>
    </html>
  )
}
