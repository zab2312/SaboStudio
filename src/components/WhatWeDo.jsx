import { motion } from 'framer-motion'
import { Gauge, Smartphone, Navigation, Search, MousePointerClick, FileText } from 'lucide-react'
import Section from './Section'
import './WhatWeDo.css'

export default function WhatWeDo() {
  const features = [
    {
      icon: Gauge,
      title: 'Brzina učitavanja',
      description: 'Optimizirana performansa za brzo učitavanje stranice.'
    },
    {
      icon: Smartphone,
      title: 'Responzivan dizajn',
      description: 'Savršeno funkcionira na svim uređajima i veličinama ekrana.'
    },
    {
      icon: Navigation,
      title: 'Intuitivna navigacija',
      description: 'Jednostavna i logična navigacija za najbolje korisničko iskustvo.'
    },
    {
      icon: Search,
      title: 'SEO optimizacija',
      description: 'Optimizirano za pretraživače kako biste bili pronađeni online.'
    },
    {
      icon: MousePointerClick,
      title: 'Pozivi na akciju',
      description: 'Strategijski postavljeni CTA-ovi za maksimalnu konverziju.'
    },
    {
      icon: FileText,
      title: 'Uvjerljiv sadržaj',
      description: 'Kvalitetan sadržaj koji privlači i zadržava posjetitelje.'
    }
  ]

  return (
    <Section id="sto-radimo" className="what-we-do-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Što zapravo radimo?</h2>
        <p className="section-description">
          Svaki projekt pristupamo s pažnjom i fokusom na detalje kako bismo stvorili web stranice 
          koje ne samo da izgledaju odlično, već i donose rezultate.
        </p>
      </motion.div>

      <div className="features-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="feature-icon">
                <Icon size={28} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}

