// pages/LoginPage.jsx — Page de connexion (URL : /login)
// Formulaire email + mot de passe.
// Si la connexion réussit, l'utilisateur est redirigé vers /.
// Si elle échoue, un message d'erreur est affiché.

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/auth'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')    // message d'erreur du serveur
  const [loading, setLoading] = useState(false) // true pendant l'appel API
  const { setUser }           = useAuth()        // met à jour l'utilisateur dans le contexte global
  const navigate              = useNavigate()

  // Mise à jour d'un champ du formulaire
  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  // Soumission du formulaire de connexion
  async function handleSubmit(e) {
    e.preventDefault()   // empêche le rechargement de la page
    setError('')
    setLoading(true)
    // Appel API → envoie email + mot de passe au serveur PHP
    const data = await login(form.email, form.password)
    setLoading(false)
    if (data.error) {
      setError(data.error) // affiche le message d'erreur
    } else {
      setUser(data.user)   // enregistre l'utilisateur connecté dans le contexte
      navigate('/')        // redirige vers la page d'accueil
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-card__brand">
          <div className="auth-card__logo">✂</div>
          <h1 className="auth-card__title">Connexion</h1>
          <p className="auth-card__sub">Accédez à votre espace UberCut</p>
        </div>

        <div className="card-u">
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label" htmlFor="email">Adresse e-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p style={{ color: 'var(--error, #e53e3e)', fontSize: 14, marginBottom: 12 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-u btn-u--primary"
              style={{ width: '100%', marginTop: 8, padding: '13px 20px' }}
              disabled={loading}
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="auth-footer">
            Pas encore de compte ?{' '}
            <Link to="/register">Créer un compte</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
