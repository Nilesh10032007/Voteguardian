import React, { useEffect } from 'react';

const CookiePolicy: React.FC = () => {
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
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>Cookie Policy</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Last updated: August 2026</p>
      
      <p style={{ marginBottom: '1.5rem' }}>
        This Cookie Policy explains how Eventum uses cookies and similar technologies to recognize you when you visit our website. 
        It explains what these technologies are and why we use them, as well as your rights to control our use of them.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>1. What are cookies?</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
        Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>2. Why do we use cookies?</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        We use first-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. 
        Specifically, we use cookies and local storage to:
      </p>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}><strong>Authentication:</strong> Maintain your login session securely using JWT tokens and authenticate you with Google OAuth.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Preferences:</strong> Remember your user preferences and UI state (e.g., keeping track of forms you are filling out).</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>3. Local Storage & Session Storage</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        In addition to traditional cookies, we heavily rely on HTML5 Local Storage and Session Storage. These technologies serve similar purposes to cookies but can store larger amounts of data locally on your device.
        We use these to store your authentication tokens (`token`), user metadata, and temporary application states (like `loggingIn` flags) to ensure the platform functions smoothly without constantly querying our servers.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>4. Third-Party Cookies</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        We may use third-party services, such as analytics providers, which may set their own cookies on your device. These third parties use cookies to compile statistical reports on website activity. 
        We do not control the dissemination of these cookies, and you should check the relevant third-party website for more information about these.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem' }}>5. How can you control cookies?</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. 
        If you choose to reject cookies or clear your local storage, you may still use our website, but your access to some functionality and areas of our website (such as logging in or registering for events) will be restricted.
      </p>

      <p style={{ marginTop: '4rem', fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>
        © {new Date().getFullYear()} Eventum. All rights reserved.
      </p>
    </div>
  );
};

export default CookiePolicy;
