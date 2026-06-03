// BookingPanel.jsx — Panneau de réservation d'un coiffeur
// Composant en 3 étapes : choix prestation → jour → créneau.
// Appelle l'API pour créer un rendez-vous, puis affiche
// une modal de confirmation.

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
// Fonction qui envoie la réservation au serveur
import { createAppointment } from '../../services/appointments.js'
import { euro } from '../../utils/format.js'

// ── Fonctions utilitaires de date ────────────────────────────────────────────

// Retourne la date ISO (YYYY-MM-DD) du prochain jour de la semaine donné
// Ex: getNextDate('Lundi') → '2025-06-09'
function getNextDate(dayName) {
  const map = { Dimanche: 0, Lundi: 1, Mardi: 2, Mercredi: 3, Jeudi: 4, Vendredi: 5, Samedi: 6 }
  const target = map[dayName]
  if (target === undefined) return null
  const today = new Date()
  // Calcule le nombre de jours à ajouter pour atteindre le bon jour
  const diff = ((target - today.getDay()) + 7) % 7 || 7
  const d = new Date(today)
  d.setDate(today.getDate() + diff)
  // Format ISO sans l'heure : "2025-06-09"
  return d.toISOString().split('T')[0]
}

// Formate une date ISO en texte lisible
// Ex: '2025-06-09' → 'lundi 9 juin'
function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

// ── Modal de confirmation ─────────────────────────────────────────────────────
// Fenêtre qui s'affiche après une réservation réussie,
// avec le récapitulatif complet du rendez-vous.

function ConfirmationModal({ booking, onClose, onNewBooking }) {
  // Fermeture avec la touche Echap (accessibilité clavier)
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Confirmation de réservation"
      onClick={onClose}
    >
      <div
        className="booking-modal anim-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Fermer */}
        <button className="lightbox-close" onClick={onClose} aria-label="Fermer">✕</button>

        {/* Icône */}
        <div className="booking-modal__icon">✅</div>

        <h2 className="booking-modal__title">Réservation confirmée !</h2>
        <p className="booking-modal__subtitle">
          Merci pour votre réservation chez UberCut.<br />
          Vous la retrouverez dans votre profil.
        </p>

        {/* Récapitulatif */}
        <div className="booking-modal__recap">
          <div className="booking-modal__recap-row">
            <span>Prestation</span>
            <strong>{booking.service.name}</strong>
          </div>
          <div className="booking-modal__recap-row">
            <span>Date</span>
            <strong>{formatDate(booking.date)}</strong>
          </div>
          <div className="booking-modal__recap-row">
            <span>Heure</span>
            <strong>{booking.time}</strong>
          </div>
          <div className="booking-modal__recap-row">
            <span>Coiffeur</span>
            <strong>{booking.providerName}</strong>
          </div>
          <div className="booking-modal__recap-row">
            <span>Lieu</span>
            <strong>{booking.location}</strong>
          </div>
          <div className="booking-modal__recap-row booking-modal__recap-row--price">
            <span>Prix</span>
            <strong>{euro(booking.service.price)}</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="booking-modal__actions">
          <Link to="/profile" className="btn-u btn-u--primary w-100">
            Voir mes rendez-vous
          </Link>
          <button className="btn-u btn-u--ghost w-100" onClick={onNewBooking}>
            Faire une autre réservation
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Panneau de réservation principal ─────────────────────────────────────────
// Composant principal : gère les 3 étapes de la réservation.

export default function BookingPanel({ provider }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  // États des 3 étapes de sélection
  const [selectedService, setSelectedService] = useState(null) // étape 1 : prestation
  const [selectedDay,     setSelectedDay]     = useState(null) // étape 2 : jour
  const [selectedSlot,    setSelectedSlot]    = useState(null) // étape 3 : créneau horaire
  const [loading,         setLoading]         = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null) // données après réservation réussie
  const [error,           setError]           = useState('')

  // Récupère les créneaux disponibles pour le jour sélectionné
  const dayData = provider.availability?.find(a => a.day === selectedDay)

  // Sélection/désélection d'une prestation (toggle)
  function pickService(s) {
    setSelectedService(prev => prev?.name === s.name ? null : s)
    // Réinitialiser les étapes suivantes
    setSelectedDay(null)
    setSelectedSlot(null)
    setError('')
  }

  // Sélection/désélection d'un jour (toggle)
  function pickDay(day) {
    setSelectedDay(prev => prev === day ? null : day)
    setSelectedSlot(null)
    setError('')
  }

  // Réinitialise tout le formulaire après une réservation
  function resetForm() {
    setConfirmedBooking(null)
    setSelectedService(null)
    setSelectedDay(null)
    setSelectedSlot(null)
    setError('')
  }

  // Envoi de la réservation au serveur
  async function handleBook() {
    // Si pas connecté → rediriger vers la page de connexion
    if (!user) { navigate('/login'); return }
    if (!selectedService || !selectedDay || !selectedSlot) return

    setLoading(true)
    setError('')

    try {
      // Convertir le nom du jour en date ISO (ex: 'Lundi' → '2025-06-09')
      const date = getNextDate(selectedDay)
      // Appel API pour créer le rendez-vous en base de données
      const data = await createAppointment({
        hairdresser_id: provider.id,
        service_name:   selectedService.name,
        price:          selectedService.price,
        date,
        time:           selectedSlot,
        location:       provider.city,
      })

      if (data.error) {
        setError(data.error)
      } else {
        // Stocker les infos pour les afficher dans la modal de confirmation
        setConfirmedBooking({
          date,
          time:         selectedSlot,
          service:      selectedService,
          providerName: provider.name,
          location:     provider.city,
        })
        // Réinitialiser les sélections
        setSelectedService(null)
        setSelectedDay(null)
        setSelectedSlot(null)
      }
    } catch {
      setError('Impossible de joindre le serveur. Vérifiez que XAMPP est démarré.')
    } finally {
      setLoading(false)
    }
  }

  // Le bouton "Confirmer" est actif uniquement si tout est sélectionné
  const canBook = !!(selectedService && selectedDay && selectedSlot && provider.available)

  return (
    <>
      {/* Popup de confirmation */}
      {confirmedBooking && (
        <ConfirmationModal
          booking={confirmedBooking}
          onClose={resetForm}
          onNewBooking={resetForm}
        />
      )}

      <div className="card-u mb-3">
        <div className="card-u__head">Réservation</div>

        {/* Prix dynamique */}
        <div className="booking-price">
          {selectedService ? euro(selectedService.price) : euro(provider.priceFrom)}
          <span>/ prestation</span>
        </div>

        <div className={`avail-pill${provider.available ? ' is-ok' : ' is-off'}`}>
          {provider.available ? 'Disponible' : 'Indisponible'}
        </div>

        <div className="divider" />

        {/* ── Étape 1 : Prestation ────────────────────────────────── */}
        <div style={{ marginBottom: 18 }}>
          <div className="booking-step-label">1 · Prestation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {provider.services.map(s => (
              <button
                key={s.name}
                onClick={() => pickService(s)}
                style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'center',
                  padding:        '10px 12px',
                  borderRadius:   'var(--radius-sm)',
                  border:         `1.5px solid ${selectedService?.name === s.name ? 'var(--gold)' : 'var(--border)'}`,
                  background:     selectedService?.name === s.name ? 'rgba(201,168,76,.08)' : 'var(--bg)',
                  cursor:         'pointer',
                  fontSize:       13,
                  textAlign:      'left',
                  width:          '100%',
                  transition:     'border-color .15s',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>⏱ {s.duration}</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--gold)', whiteSpace: 'nowrap', marginLeft: 8 }}>
                  {euro(s.price)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Étape 2 : Jour ──────────────────────────────────────── */}
        {selectedService && (
          <div style={{ marginBottom: 18 }}>
            <div className="booking-step-label">2 · Jour</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {provider.availability.map(({ day }) => (
                <button
                  key={day}
                  className={`chip${selectedDay === day ? ' is-active' : ''}`}
                  onClick={() => pickDay(day)}
                  style={{ fontSize: 12 }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Étape 3 : Créneau ───────────────────────────────────── */}
        {selectedDay && dayData && (
          <div style={{ marginBottom: 18 }}>
            <div className="booking-step-label">3 · Créneau</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {dayData.slots.map(slot => (
                <button
                  key={slot}
                  className={`chip${selectedSlot === slot ? ' is-active' : ''}`}
                  onClick={() => setSelectedSlot(prev => prev === slot ? null : slot)}
                  style={{ fontSize: 13 }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Résumé avant confirmation */}
        {canBook && (
          <div style={{
            padding: '10px 12px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)', fontSize: 13, marginBottom: 12,
          }}>
            <div style={{ fontWeight: 700 }}>{selectedService.name}</div>
            <div style={{ color: 'var(--muted)', marginTop: 2 }}>
              {selectedDay} · {selectedSlot} · {euro(selectedService.price)}
            </div>
          </div>
        )}

        {error && (
          <p style={{ color: 'var(--error, #e53e3e)', fontSize: 13, marginBottom: 10 }}>{error}</p>
        )}

        {/* ── Bouton principal ──────────────────────────────────── */}
        <button
          className="btn-u btn-u--primary w-100"
          disabled={!canBook || loading}
          onClick={handleBook}
        >
          {loading
            ? 'Réservation en cours…'
            : !user
              ? 'Se connecter pour réserver'
              : canBook
                ? `Confirmer · ${selectedDay} à ${selectedSlot}`
                : 'Sélectionnez prestation, jour et créneau'
          }
        </button>

        {!user && (
          <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 8 }}>
            <Link to="/login" style={{ color: 'var(--gold)' }}>Connexion</Link> requise pour réserver
          </p>
        )}

        <div className="divider" />

        <div className="small-u" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div>📞 <a className="link-u" href={`tel:${provider.phone}`}>{provider.phone}</a></div>
          <div>🕐 {provider.hours}</div>
          <div>📍 {provider.city}</div>
        </div>
      </div>
    </>
  )
}
