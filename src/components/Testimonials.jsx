import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Section from './Section'
import './Testimonials.css'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTestimonials(data || [])
    } catch (error) {
      console.error('Error loading testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Section id="iskustva" className="testimonials-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Iskustva klijenata</h2>
        <p className="section-description">
          Što naši klijenti kažu o radu s nama
        </p>
      </motion.div>

      {loading ? (
        <div className="testimonials-loading">Učitavanje iskustava...</div>
      ) : (
        <div className="testimonials-grid">
          {testimonials.length > 0 ? (
            testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Quote size={32} className="quote-icon" />
                <p className="testimonial-comment">"{testimonial.comment}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.client_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="author-name">{testimonial.client_name}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <>
              <motion.div
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Quote size={32} className="quote-icon" />
                <p className="testimonial-comment">"Profesionalan pristup od početka do kraja. Naša nova web stranica je donijela značajno više upita u prva 3 mjeseca."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">M</div>
                  <span className="author-name">Marko P., OPG (primjer)</span>
                </div>
              </motion.div>
              <motion.div
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Quote size={32} className="quote-icon" />
                <p className="testimonial-comment">"Konačno imamo web stranicu koja zaista funkcionira i donosi rezultate. Online rezervacije su se povećale za preko 100%."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">A</div>
                  <span className="author-name">Ana K., Frizerski salon (primjer)</span>
                </div>
              </motion.div>
            </>
          )}
        </div>
      )}
    </Section>
  )
}

