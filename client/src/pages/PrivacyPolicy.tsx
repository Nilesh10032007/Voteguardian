import React, { useEffect } from 'react';

const PrivacyPolicy: React.FC = () => {
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
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>Privacy Policy</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Last updated: August 2026</p>
      
      <p style={{ marginBottom: '1.5rem' }}>
        Welcome to Eventum. We respect your privacy and are committed to protecting your personal data. 
        This privacy policy will inform you as to how we look after your personal data when you visit our website 
        and tell you about your privacy rights.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
      </p>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Contact Data</strong> includes email address, and optionally telephone numbers.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Academic Data</strong> includes your department, year of study, and college affiliation (if applicable) for event eligibility.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Profile Data</strong> includes your interests, preferences, and events you have registered for.</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>2. How We Use Your Data</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
      </p>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}>To register you as a new user or event attendee.</li>
        <li style={{ marginBottom: '0.5rem' }}>To process and deliver your event registrations and tickets.</li>
        <li style={{ marginBottom: '0.5rem' }}>To manage our relationship with you, including notifying you about changes to events.</li>
        <li style={{ marginBottom: '0.5rem' }}>To enable event organizers to manage their attendees and communicate important updates.</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>3. Data Sharing with Organizers</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        When you register for an event, we share your necessary Identity, Contact, and Academic data with the specific Club, Initiative, or Organization hosting that event. 
        Organizers are required to use this data solely for the purpose of managing the event and are prohibited from sharing it with third parties.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>4. Third-Party Services & Payment Processing</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        When you initiate a payment for an event, we utilize Razorpay as our third-party payment processor. The Razorpay SDK is loaded only on payment pages and may collect device information (such as browser type, operating system, and IP address) strictly for payment security, fraud prevention, and processing your transaction. We do not store your payment credentials on our servers.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>5. Data Security</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.
        We authenticate users securely (e.g., via Google OAuth) and do not store raw passwords on our servers.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>6. Your Legal Rights</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, deletion (including third-party fingerprints), or erasure of your personal data. 
        To exercise these rights, please contact us through the platform.
      </p>

      <p style={{ marginTop: '4rem', fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>
        © {new Date().getFullYear()} Eventum. All rights reserved.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
