import { motion } from 'framer-motion'
import Section from './Section'
import './WhatWeDo.css'

export default function WhatWeDo() {
  const features = [
    {
      title: 'Brzina učitavanja',
      description: 'Optimizirana performansa za brzo učitavanje stranice. Svaka sekunda ubrzanja povećava konverziju i zadržava posjetitelje na stranici.'
    },
    {
      title: 'Responzivan dizajn',
      description: 'Savršeno funkcionira na svim uređajima i veličinama ekrana. Mobilno iskustvo je prioritet, ne opcija.'
    },
    {
      title: 'Intuitivna navigacija',
      description: 'Jednostavna i logična navigacija za najbolje korisničko iskustvo. Posjetitelji bi trebali znati gdje su i kamo mogu ići bez razmišljanja.'
    },
    {
      title: 'SEO optimizacija',
      description: 'Optimizirano za pretraživače kako biste bili pronađeni online. Lokalni SEO je ključan za lokalne biznise.'
    },
    {
      title: 'Pozivi na akciju',
      description: 'Strategijski postavljeni CTA-ovi za maksimalnu konverziju. Svaki element ima svrhu i vodi ka cilju.'
    },
    {
      title: 'Uvjerljiv sadržaj',
      description: 'Kvalitetan sadržaj koji privlači i zadržava posjetitelje. Pričamo vašu priču na način koji rezoniramo s klijentima.'
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

      <div className="features-list">
        {features.map((feature, index) => {
          const stepNumber = String(index + 1).padStart(2, '0')
          return (
            <motion.div
              key={index}
              className="feature-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="feature-number">{stepNumber}</div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}

