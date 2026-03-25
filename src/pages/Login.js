import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(email, password);
    }
  };

  return (
    <div className="login">
      <div className="login-left">
        <div className="login-logo">
          <img src="/Logo.png" alt="Abricot" />
        </div>

        <div className="login-form-container">
          <h1 className="login-title">Connexion</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label" htmlFor="email">Email</label>
              <input
                className="login-input"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="password">Mot de passe</label>
              <input
                className="login-input"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="login-submit" type="submit">Se connecter</button>
          </form>

          <a href="#forgot" className="login-forgot" onClick={(e) => e.preventDefault()}>
            Mot de passe oublié?
          </a>
        </div>

        <div className="login-footer">
          <span>Pas encore de compte ?</span>{' '}
          <a
            href="#signup"
            className="login-signup-link"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('signup');
            }}
          >
            Créer un compte
          </a>
        </div>
      </div>

      <div className="login-right">
        <img src="/log-in.jpg" alt="" className="login-image" />
      </div>
    </div>
  );
}

export default Login;
