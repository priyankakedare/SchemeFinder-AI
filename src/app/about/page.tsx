export default function About() {
  return (
    <div className="container animate-fade-in" style={{ padding: '60px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '24px', fontSize: '2.5rem' }}>About SchemeFinder AI</h1>
      
      <div style={{ backgroundColor: 'var(--surface)', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '20px', lineHeight: '1.8' }}>
          SchemeFinder AI is a government-grade platform designed to simplify the discovery and verification of eligibility for various government schemes. 
        </p>
        
        <h2 style={{ color: 'var(--primary)', marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>Our Mission</h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '20px', lineHeight: '1.7' }}>
          To ensure every eligible citizen, farmer, student, and MSME owner has transparent, deterministic, and frictionless access to government schemes without the risk of misinformation.
        </p>

        <h2 style={{ color: 'var(--primary)', marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>Zero Hallucination Guarantee</h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.7' }}>
          Our deterministic eligibility engine operates strictly on verified government parameters. We utilize Artificial Intelligence exclusively for discovery parsing and explanation formatting—never for mathematical qualification. 
        </p>
      </div>
    </div>
  );
}
