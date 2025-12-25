import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Section from './Section'
import './FAQ.css'

export default function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [openIndex, setOpenIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFAQs()
  }, [])

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      setFaqs(data || [])
    } catch (error) {
      console.error('Error loading FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <Section id="faq" className="faq-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Često postavljena pitanja</h2>
        <p className="section-description">
          Brzi odgovori na najčešća pitanja o izradi web stranica i web aplikacija.
        </p>
      </motion.div>

      {loading ? (
        <div className="faq-loading">Učitavanje pitanja...</div>
      ) : (
        <div className="faq-list">
          {/* Pricing FAQ - always shown */}
          <motion.div
            className="faq-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <button
              className="faq-question"
              onClick={() => toggleFAQ(-1)}
            >
              <span>Kolika je cijena izrade web stranice?</span>
              <motion.div
                animate={{ rotate: openIndex === -1 ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={20} className="chevron-icon" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === -1 && (
                <motion.div
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>Cijena ovisi o kompleksnosti projekta – nakon besplatne analize dobivate jasnu ponudu i plan. Svaki projekt je jedinstven, stoga prvo analiziramo vaše potrebe i ciljeve kako bismo vam ponudili najbolje rješenje koje odgovara vašem budžetu.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Other FAQs from database */}
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} className="chevron-icon" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  )
}

