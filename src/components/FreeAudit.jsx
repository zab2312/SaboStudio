import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileSearch, Mail, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Section from './Section'
import './FreeAudit.css'

export default function FreeAudit() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('audit_requests')
        .insert({
          client_name: formData.name,
          client_email: formData.email,
          website_url: formData.website || null,
          status: 'pending'
        })

      if (error) throw error

      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', website: '' })
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('Error submitting audit request:', error)
      setIsSubmitting(false)
      alert('Greška pri slanju zahtjeva. Molimo pokušajte ponovno.')
    }
  }

  return (
    <Section id="analiza" className="free-audit-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Besplatna analiza web stranice</h2>
        <p className="section-description">
          Zatražite besplatnu analizu vaše web stranice i saznajte kako možete poboljšati konverzije i rezultate.
        </p>
      </motion.div>

      <motion.form
        className="audit-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="form-group">
          <label htmlFor="audit-name">
            <User size={18} />
            Ime i prezime *
          </label>
          <input
            type="text"
            id="audit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Vaše ime i prezime"
          />
        </div>

        <div className="form-group">
          <label htmlFor="audit-email">
            <Mail size={18} />
            Email *
          </label>
          <input
            type="email"
            id="audit-email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="vaš@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="audit-website">
            <FileSearch size={18} />
            URL vaše web stranice (opcionalno)
          </label>
          <input
            type="url"
            id="audit-website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://vasa-stranica.hr"
          />
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Slanje...' : 'Zatraži besplatnu analizu'}
        </button>

        {submitSuccess && (
          <motion.div
            className="success-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Hvala! Kontaktirat ćemo vas uskoro s analizom.
          </motion.div>
        )}

        <p className="form-privacy">
          Vaši podaci su sigurni i nećemo ih dijeliti s trećim stranama.
        </p>
      </motion.form>
    </Section>
  )
}

