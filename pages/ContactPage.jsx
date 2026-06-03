// pages/ContactPage.jsx — Page de contact (URL : /contact)
// Formulaire de contact avec informations de l'équipe.
// L'envoi est simulé (setSent = true) sans vrai appel API.

import React, { useState } from 'react'
import SectionHeader from '../components/ui/SectionHeader.jsx'

export default function ContactPage() {
  const [sent, setSent] = useState(false) // true = afficher le message de succès
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  // Met à jour le champ correspondant dans l'objet form
  // [e.target.name] = nom dynamique du champ (ex: 'email', 'message')
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Soumission du formulaire
  function handleSubmit(e) {
    e.preventDefault() // empêche le rechargement de la page (comportement HTML par défaut)
    // L'envoi réel n'est pas implémenté, on simule juste le succès
    setSent(true)
  }

  return (
    <section className="section section--light">
      <div className="container">

        <div className="mb-5">
          <SectionHeader
            label="Contact"
            title="Parlons-nous"
            subtitle="Une question, un partenariat, ou juste envie de dire bonjour — on vous répond sous 24h."
          />
        </div>

        <div className="contact-grid">

          {/* ── Infos de contact ─────────────────────────────── */}
          <div>
            <div className="contact-info__item">
              <div className="contact-info__icon">📍</div>
              <div>
                <div className="contact-info__label">Adresse</div>
                <div className="contact-info__value">12 rue du Faubourg Saint-Honoré<br />75008 Paris, France</div>
              </div>
            </div>
            <div className="contact-info__item">
              <div className="contact-info__icon">📞</div>
              <div>
                <div className="contact-info__label">Téléphone</div>
                <div className="contact-info__value">
                  <a className="link-u" href="tel:+33600000000">+33 6 00 00 00 00</a>
                </div>
              </div>
            </div>
            <div className="contact-info__item">
              <div className="contact-info__icon">✉️</div>
              <div>
                <div className="contact-info__label">Email</div>
                <div className="contact-info__value">
                  <a className="link-u" href="mailto:contact@ubercut.fr">contact@ubercut.fr</a>
                </div>
              </div>
            </div>
            <div className="contact-info__item">
              <div className="contact-info__icon">🕐</div>
              <div>
                <div className="contact-info__label">Disponible</div>
                <div className="contact-info__value">Lun–Ven, 9h–18h</div>
              </div>
            </div>

            <div className="divider" />

            <div style={{ fontSize: 13, color: 'var(--muted-2)', lineHeight: 1.7 }}>
              Vous êtes coiffeur et souhaitez rejoindre la plateforme ?<br />
              <a className="link-u" href="mailto:pro@ubercut.fr">Contactez notre équipe partenaires →</a>
            </div>
          </div>

          {/* ── Formulaire ───────────────────────────────────── */}
          <div className="card-u">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Message envoyé !</h3>
                <p className="card-u__text">Nous vous répondrons sous 24h. Merci de votre confiance.</p>
                <button
                  className="btn-u btn-u--ghost mt-4"
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="card-u__head">Envoyer un message</div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-field">
                      <label className="form-label" htmlFor="contact-name">Nom complet</label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        className="form-input"
                        placeholder="Jean Dupont"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-field">
                      <label className="form-label" htmlFor="contact-email">Email</label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        className="form-input"
                        placeholder="jean@exemple.fr"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="contact-subject">Sujet</label>
                  <select
                    id="contact-subject"
                    name="subject"
                    className="form-select"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner un sujet</option>
                    <option value="reservation">Question sur une réservation</option>
                    <option value="partenariat">Devenir partenaire coiffeur</option>
                    <option value="signalement">Signalement</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="form-textarea"
                    placeholder="Décrivez votre demande..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn-u btn-u--primary" style={{ width: '100%' }}>
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
