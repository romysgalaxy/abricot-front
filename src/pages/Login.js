import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
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
          <Link to="/signup" className="login-signup-link">Créer un compte</Link>
        </div>
      </div>

      <div className="login-right">
        <img src="/log-in.jpg" alt="" className="login-image" />
      </div>
    </div>
  );
}

export default Login;
