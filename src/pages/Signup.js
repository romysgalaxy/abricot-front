import React, { useState } from 'react';
import './Signup.css';

function Signup({ onSignup, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSignup) {
      onSignup({ email, password });
    }
  };

  return (
    <div className="signup">
      <div className="signup-left">
        <div className="signup-logo">
          <img src="/Logo.png" alt="Abricot" />
        </div>

        <div className="signup-form-container">
          <h1 className="signup-title">Créer un compte</h1>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-field">
              <label className="signup-label" htmlFor="signup-email">Email</label>
              <input
                className="signup-input"
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="signup-field">
              <label className="signup-label" htmlFor="signup-password">Mot de passe</label>
              <input
                className="signup-input"
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="signup-submit" type="submit">S'inscrire</button>
          </form>
        </div>

        <div className="signup-footer">
          <span>Déjà un compte ?</span>{' '}
          <a
            href="#login"
            className="signup-login-link"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('login');
            }}
          >
            Se connecter
          </a>
        </div>
      </div>

      <div className="signup-right">
        <img src="/sign-in.jpg" alt="" className="signup-image" />
      </div>
    </div>
  );
}

export default Signup;
