// pages/RegisterPage.jsx — Page d'inscription (URL : /register)
// Formulaire de création de compte avec validation locale
// (vérification que les deux mots de passe sont identiques).
// Si l'inscription réussit, l'utilisateur est connecté et
// redirigé vers la page d'accueil.

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/auth'
import { useAuth } from '../context/AuthContext.jsx'

export default function RegisterPage() {
  // Tous les champs du formulaire dans un seul objet d'état
  const [form, setForm]       = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser }           = useAuth()
  const navigate              = useNavigate()

  // Mise à jour d'un champ du formulaire
  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  // Soumission du formulaire d'inscription
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    // Validation côté client avant d'envoyer au serveur
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return // arrêter l'exécution si les mots de passe diffèrent
    }
    setLoading(true)
    // Envoi des données d'inscription au serveur (sans confirmPassword)
    const data = await register({
      firstName: form.firstName,
      lastName:  form.lastName,
      email:     form.email,
      phone:     form.phone,
      password:  form.password,
    })
    setLoading(false)
    if (data.error) {
      setError(data.error)
    } else {
      // Connexion automatique après inscription réussie
      setUser(data.user)
      navigate('/')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">

        <div className="auth-card__brand">
          <div className="auth-card__logo">✂</div>
          <h1 className="auth-card__title">Créer un compte</h1>
          <p className="auth-card__sub">Rejoignez la communauté UberCut</p>
        </div>

        <div className="card-u">
          <form onSubmit={handleSubmit}>

            <div className="auth-row-2">
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="firstName">Prénom</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="form-input"
                  placeholder="Jean"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="lastName">Nom</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="form-input"
                  placeholder="Dupont"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="reg-email">Adresse e-mail</label>
              <input
                id="reg-email"
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
              <label className="form-label" htmlFor="phone">Téléphone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-input"
                placeholder="06 12 34 56 78"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="reg-password">Mot de passe</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <span className="auth-hint">8 caractères minimum</span>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
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
              {loading ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>

          <p className="auth-footer">
            Déjà un compte ?{' '}
            <Link to="/login">Se connecter</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
