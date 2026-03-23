import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img src={`${process.env.PUBLIC_URL}/Logo-black.png`} alt="Abricot" className="footer-logo" />
        <div className="footer-text">Abricot 2025</div>
      </div>
    </footer>
  );
}

export default Footer;
