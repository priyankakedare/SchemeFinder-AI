'use client';

export default function Contact() {
  return (
    <div className="container animate-fade-in" style={{ padding: '60px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '24px', fontSize: '2.5rem' }}>Contact Official Support</h1>
      
      <div style={{ backgroundColor: 'var(--surface)', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '32px' }}>
          For inquiries related to scheme discovery, data ingestion pipelines, or deployment feedback, please reach out to the development team. 
        </p>
        
        <form style={{ display: 'grid', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
           <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-main)' }}>Name</label>
              <input type="text" placeholder="Your full name" style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: '1px solid #CACFD2', fontSize: '1rem' }} />
           </div>
           
           <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-main)' }}>Email Address</label>
              <input type="email" placeholder="Your official email" style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: '1px solid #CACFD2', fontSize: '1rem' }} />
           </div>

           <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-main)' }}>Message or Query</label>
              <textarea placeholder="How can we assist you?" rows={5} style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: '1px solid #CACFD2', fontSize: '1rem', resize: 'vertical' }}></textarea>
           </div>
           
           <button type="submit" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '14px 24px', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
             Submit Inquiry
           </button>
        </form>
      </div>
    </div>
  );
}
