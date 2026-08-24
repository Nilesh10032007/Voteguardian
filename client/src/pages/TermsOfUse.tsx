import React, { useEffect } from 'react';

const TermsOfUse: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '120px 2rem 4rem 2rem',
      color: '#1e293b',
      lineHeight: '1.7',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>Terms of Use</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Last updated: August 2026</p>
      
      <p style={{ marginBottom: '1.5rem' }}>
        These Terms of Use govern your access to and use of Eventum. By accessing or using our platform, 
        you agree to be bound by these terms. If you do not agree to these terms, please do not use our services.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>1. Platform Purpose</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Eventum is a platform designed to connect students with events, clubs, and organizations. We provide a space for 
        organizers to list and manage events, and for students to discover and register for them. We do not independently verify 
        every event and are not responsible for the execution of the events listed.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>2. User Accounts</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        To register for events or access certain features, you must create an account via Google OAuth. 
        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. 
        You must ensure that the information you provide (such as your department and academic details) is accurate and up to date.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>3. Organizer Responsibilities</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        If you operate an Organizer Account, you agree to:
      </p>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}>Provide accurate information about your club and events.</li>
        <li style={{ marginBottom: '0.5rem' }}>Protect the personal data of users who register for your events and use it solely for event management purposes.</li>
        <li style={{ marginBottom: '0.5rem' }}>Comply with all applicable institution guidelines and laws when hosting events.</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>4. Acceptable Use</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        You agree not to misuse our platform. This includes, but is not limited to:
      </p>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the platform.</li>
        <li style={{ marginBottom: '0.5rem' }}>Taking any action that imposes an unreasonable or disproportionately large load on our infrastructure.</li>
        <li style={{ marginBottom: '0.5rem' }}>Impersonating another person or misrepresenting your affiliation with a person or entity.</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>5. Limitation of Liability</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Eventum provides the platform on an "as is" and "as available" basis. We shall not be liable for any indirect, incidental, 
        special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
        resulting from your access to or use of or inability to access or use the platform.
      </p>

      <p style={{ marginTop: '4rem', fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>
        © {new Date().getFullYear()} Eventum. All rights reserved.
      </p>
    </div>
  );
};

export default TermsOfUse;
