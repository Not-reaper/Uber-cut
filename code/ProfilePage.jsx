// pages/ProfilePage.jsx — Profil utilisateur (URL : /profile)
// Page protégée : redirige vers /login si non connecté.
// Deux colonnes :
//   Gauche : informations du compte + formulaire d'édition
//   Droite : liste des rendez-vous passés et à venir

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { updateProfile } from '../services/user.js'
import { getAppointments, cancelAppointment } from '../services/appointments.js'
import { euro } from '../utils/format.js'

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth()
  const navigate                  = useNavigate()

  const [appointments, setAppointments] = useState([])    // liste des rendez-vous
  const [editMode, setEditMode]         = useState(false)  // true = afficher le formulaire d'édition
  const [form, setForm]                 = useState({ firstName: '', lastName: '', phone: '', newPassword: '' })
  const [message, setMessage]           = useState('')     // message de succès
  const [error, setError]               = useState('')     // message d'erreur

  // Au chargement : vérifier la connexion, remplir le formulaire, charger les RDV
  useEffect(() => {
    // Protection de la page : si non connecté, rediriger vers /login
    if (!user) { navigate('/login'); return }
    // Pré-remplir le formulaire avec les infos actuelles
    // (le serveur peut retourner first_name ou firstName selon la version)
    setForm({
      firstName: user.first_name || user.firstName || '',
      lastName:  user.last_name  || user.lastName  || '',
      phone:     user.phone || '',
      newPassword: '',
    })
    // Charger les rendez-vous depuis le serveur
    getAppointments().then(data => setAppointments(data.appointments || []))
  }, [user]) // se relance si l'objet user change

  // Sauvegarde des modifications du profil
  async function handleSave(e) {
    e.preventDefault()
    setMessage('')
    setError('')
    const data = await updateProfile(form)
    if (data.error) {
      setError(data.error)
    } else {
      // Mettre à jour le contexte global avec les nouvelles infos
      setUser(prev => ({ ...prev, first_name: form.firstName, last_name: form.lastName, phone: form.phone }))
      setMessage('Profil mis à jour avec succès.')
      setEditMode(false)
    }
  }

  // Annulation d'un rendez-vous : appel API + mise à jour locale
  async function handleCancelAppointment(id) {
    await cancelAppointment(id)
    // Mise à jour optimiste : on change le statut localement sans recharger
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'annulé' } : a))
  }

  // Sécurité : ne rien rendre si pas d'utilisateur (pendant la redirection)
  if (!user) return null

  // Normalisation : le serveur peut utiliser snake_case ou camelCase
  const firstName = user.first_name || user.firstName || ''
  const lastName  = user.last_name  || user.lastName  || ''

  return (
    <section className="section section--light">
      <div className="container">

        {/* En-tête profil */}
        <div className="profile-hero mb-4" style={{ minHeight: 140, display: 'flex', alignItems: 'center', padding: '32px 40px', gap: 24, background: 'var(--bg-2, #f8f8f8)', borderRadius: 'var(--radius)' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gold, #c9a84c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff', fontWeight: 700, flexShrink: 0 }}>
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: 0 }}>
              {firstName} {lastName}
            </h1>
            <p style={{ color: 'var(--muted)', margin: '4px 0 0' }}>{user.email}</p>
          </div>
        </div>

        <div className="row g-4">

          {/* Colonne gauche — Infos + édition */}
          <div className="col-lg-6">
            <div className="card-u mb-4">
              <div className="card-u__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Mes informations
                <button className="btn-u btn-u--ghost btn-u--sm" onClick={() => { setEditMode(e => !e); setMessage(''); setError('') }}>
                  {editMode ? 'Annuler' : 'Modifier'}
                </button>
              </div>

              {!editMode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Prénom',    value: firstName },
                    { label: 'Nom',       value: lastName  },
                    { label: 'Email',     value: user.email },
                    { label: 'Téléphone', value: user.phone || '—' },
                    { label: 'Rôle',      value: user.role  || 'client' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                      <span style={{ color: 'var(--muted-2)', fontWeight: 600 }}>{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSave}>
                  {[
                    { id: 'firstName', label: 'Prénom',    type: 'text' },
                    { id: 'lastName',  label: 'Nom',       type: 'text' },
                    { id: 'phone',     label: 'Téléphone', type: 'tel'  },
                    { id: 'newPassword', label: 'Nouveau mot de passe (laisser vide pour ne pas changer)', type: 'password' },
                  ].map(({ id, label, type }) => (
                    <div className="form-field" key={id}>
                      <label className="form-label" htmlFor={id}>{label}</label>
                      <input
                        id={id}
                        name={id}
                        type={type}
                        className="form-input"
                        value={form[id]}
                        onChange={e => setForm(p => ({ ...p, [id]: e.target.value }))}
                      />
                    </div>
                  ))}

                  {error   && <p style={{ color: 'var(--error, #e53e3e)', fontSize: 13, marginBottom: 8 }}>{error}</p>}
                  {message && <p style={{ color: 'green', fontSize: 13, marginBottom: 8 }}>{message}</p>}

                  <button type="submit" className="btn-u btn-u--primary" style={{ width: '100%', padding: '11px 20px' }}>
                    Enregistrer
                  </button>
                </form>
              )}

              {message && !editMode && (
                <p style={{ color: 'green', fontSize: 13, marginTop: 12 }}>{message}</p>
              )}
            </div>

            <button onClick={logout} className="btn-u btn-u--ghost btn-u--sm" style={{ color: 'var(--error, #e53e3e)' }}>
              Se déconnecter
            </button>
          </div>

          {/* Colonne droite — Rendez-vous */}
          <div className="col-lg-6">
            <div className="card-u">
              <div className="card-u__head">Mes rendez-vous ({appointments.length})</div>

              {appointments.length === 0 ? (
                <p className="card-u__text">Aucun rendez-vous pour le moment.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {appointments.map(appt => (
                    <div key={appt.id} style={{ padding: '14px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{appt.service_name}</div>
                          {appt.price > 0 && (
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', marginTop: 2 }}>
                              {euro(appt.price)}
                            </div>
                          )}
                          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                            📅 {appt.appointment_date} à {appt.appointment_time}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                            ✂ {appt.hairdresser_first} {appt.hairdresser_last}
                          </div>
                          {appt.location && (
                            <div style={{ fontSize: 13, color: 'var(--muted)' }}>📍 {appt.location}</div>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                            background: appt.status === 'confirmé' ? '#d4edda' : appt.status === 'annulé' ? '#f8d7da' : '#fff3cd',
                            color:      appt.status === 'confirmé' ? '#155724' : appt.status === 'annulé' ? '#721c24' : '#856404',
                          }}>
                            {appt.status}
                          </span>
                          {appt.status !== 'annulé' && appt.status !== 'terminé' && (
                            <button
                              className="btn-u btn-u--ghost btn-u--sm"
                              style={{ fontSize: 11, color: 'var(--error, #e53e3e)' }}
                              onClick={() => handleCancelAppointment(appt.id)}
                            >
                              Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
