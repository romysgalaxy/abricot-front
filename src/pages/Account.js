import React from 'react';
import './Account.css';

function Account() {
  return (
    <div className="account">
      <div className="account-card">
        <h1 className="account-title">Mon compte</h1>
        <p className="account-subtitle">Amélie Dupont</p>

        <div className="account-form">
          <div className="account-field">
            <label className="account-label">Nom</label>
            <div className="account-input">Amélie</div>
          </div>

          <div className="account-field">
            <label className="account-label">Prénom</label>
            <div className="account-input">Amélie</div>
          </div>

          <div className="account-field">
            <label className="account-label">Email</label>
            <div className="account-input">a.dupont@mail.com</div>
          </div>

          <div className="account-field">
            <label className="account-label">Mot de passe</label>
            <div className="account-input">●●●●●●●●●●●</div>
          </div>

          <button className="account-submit">Modifier les informations</button>
        </div>
      </div>
    </div>
  );
}

export default Account;
