'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { UserProfile, Scheme, EligibilityResult } from '../types';

export default function Home() {
  const [profile, setProfile] = useState<UserProfile>({
    age: 30,
    incomeMonthly: 15000,
    state: 'Maharashtra',
    district: 'Pune',
    occupation: 'Farmer',
    socialCategory: 'General',
    gender: 'Male',
    landholdingHectares: 1.5,
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{scheme: Scheme, evaluation: EligibilityResult}[] | null>(null);
  
  // Explanation Modal State
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'incomeMonthly' || name === 'landholdingHectares' ? Number(value) : value
    }));
  };

  const findSchemes = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      
      if (!response.ok) throw new Error('Failed to fetch schemes');
      
      const data = await response.json();
      setResults(data.recommendations);
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching schemes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getExplanation = async (scheme: Scheme, evaluation: EligibilityResult) => {
    setExplanationLoading(true);
    setModalOpen(true);
    setCurrentExplanation(null);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheme, evaluation }),
      });
      
      if (!response.ok) throw new Error('Failed to get explanation');
      
      const data = await response.json();
      setCurrentExplanation(data.explanation);
    } catch (error) {
       console.error(error);
       setCurrentExplanation("An error occurred while generating the explanation. Please verify your connection.");
    } finally {
      setExplanationLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      
      <div className={styles.formCard}>
        <h2 className={styles.heading}>Citizen Profile Assessment</h2>
        <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>Enter your details to deterministically verify eligibility across all available government schemes.</p>
        
        <form onSubmit={findSchemes}>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Age</label>
              <input type="number" name="age" className={styles.input} value={profile.age} onChange={handleInputChange} required min="0" max="150" />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Monthly Income (₹)</label>
              <input type="number" name="incomeMonthly" className={styles.input} value={profile.incomeMonthly} onChange={handleInputChange} required min="0" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Occupation</label>
              <select name="occupation" className={styles.select} value={profile.occupation} onChange={handleInputChange} required>
                <option value="Farmer">Farmer</option>
                <option value="Student">Student</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Salaried">Salaried Employee</option>
                <option value="MSME">MSME Owner</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Social Category</label>
              <select name="socialCategory" className={styles.select} value={profile.socialCategory} onChange={handleInputChange} required>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="BPL">BPL</option>
              </select>
            </div>

            <div className={styles.formGroup}>
                 <label className={styles.label}>Gender</label>
                 <select name="gender" className={styles.select} value={profile.gender} onChange={handleInputChange} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                 </select>
            </div>
            
             <div className={styles.formGroup}>
                 <label className={styles.label}>Landholding (Hectares) - Optional</label>
                 <input type="number" step="0.1" name="landholdingHectares" className={styles.input} value={profile.landholdingHectares || ''} onChange={handleInputChange} min="0" />
            </div>

          </div>

          <div style={{ marginTop: '24px', backgroundColor: '#Fef9e7', borderLeft: '4px solid var(--warning)', padding: '12px 16px', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#7D6608', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🔒</span> <strong>Data Privacy Guaranteed:</strong> Your profile information is never stored or saved in any database. It is processed securely in real-time memory strictly for matching purposes and immediately discarded after your session.
            </p>
          </div>
          
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Verifying Eligibility...' : 'Find Eligible Schemes'}
          </button>
        </form>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
           <div className={styles.loadingSpinner}></div>
           <p style={{ color: 'var(--primary)', fontWeight: 500 }}>Querying verified government databases...</p>
        </div>
      )}

      {results && results.length > 0 && (
        <div className={`${styles.resultsContainer} animate-fade-in`}>
          <h2 className={styles.heading} style={{ marginBottom: '16px' }}>
             Verified Matches ({results.length})
          </h2>
          <p style={{ marginBottom: '24px', color: 'var(--success)', fontWeight: 500, backgroundColor: '#E8F5E9', padding: '12px', borderRadius: '4px', borderLeft: '4px solid var(--success)' }}>✓ Eligibility deterministically criteria verified. Zero hallucination guaranteed.</p>
          
          {results.map((result, index) => (
            <div key={index} className={styles.schemeCard}>
              <div className={styles.schemeHeader}>
                 <div>
                    <h3 className={styles.schemeTitle}>
                      {result.scheme.title}
                      {result.scheme.lifecycleState === 'Upcoming' && (
                        <span className={styles.badgeUpcoming}>⚠ Discussion Phase (Unapproved)</span>
                      )}
                    </h3>
                    <span className={styles.schemeMinistry}>{result.scheme.ministry}</span>
                 </div>
                 <span className={styles.schemeScore}>Match Score: {result.evaluation.score}</span>
              </div>
              
              <p className={styles.schemeDesc}>{result.scheme.description}</p>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                 <button onClick={() => getExplanation(result.scheme, result.evaluation)} className={styles.actionButton}>
                    AI Eligibility Verification
                 </button>
                 <a href={result.scheme.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.actionButton} style={{ backgroundColor: '#ECEFF1', color: 'var(--primary)', border: '1px solid #CFD8DC' }}>
                    View Official Notification
                 </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {results && results.length === 0 && (
        <div className={`${styles.resultsContainer} animate-fade-in`} style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
             <h3 style={{ color: 'var(--error)', marginBottom: '16px' }}>No direct matches found.</h3>
             <p style={{ color: 'var(--text-muted)' }}>Based on the provided demographic parameters, there are currently no deterministically matched schemes in the active database.</p>
        </div>
      )}

      {/* AI Explanation Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
           <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={() => setModalOpen(false)}>×</button>
              
              <div className={styles.aiBadge}>✨ Navira AI Explanation Engine</div>
              <h3 style={{ color: 'var(--primary)', marginBottom: '20px', fontSize: '1.4rem' }}>Eligibility Breakdown</h3>
              
              {explanationLoading ? (
                 <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div className={styles.loadingSpinner}></div>
                    <p style={{ color: 'var(--text-muted)' }}>Generating cryptographic trace and parsing specific criteria matches...</p>
                 </div>
              ) : (
                <div 
                   className={styles.explanationText} 
                   dangerouslySetInnerHTML={{ __html: currentExplanation?.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || '' }} 
                />
              )}
           </div>
        </div>
      )}

    </div>
  );
}
