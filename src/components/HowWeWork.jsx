import { motion } from 'framer-motion'
import Section from './Section'
import './HowWeWork.css'
import './WhatWeDo.css'
import './Process.css'

export default function HowWeWork() {
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

  const steps = [
    {
      title: 'Razgovor i analiza',
      description: 'Slušamo vaše potrebe, ciljeve i viziju. Razumijevanje vašeg biznisa je prvi korak prema uspješnom projektu.'
    },
    {
      title: 'Dizajn i planiranje',
      description: 'Kreiramo dizajn koji odražava vašu marku i privlači ciljnu publiku. Svaki element je pažljivo osmišljen.'
    },
    {
      title: 'Razvoj i implementacija',
      description: 'Pretvaramo dizajn u funkcionalnu web stranicu. Koristimo najnovije tehnologije za optimalne performanse.'
    },
    {
      title: 'Testiranje i optimizacija',
      description: 'Testiramo na svim uređajima i optimiziramo za najbolje rezultate. Kvaliteta je naš prioritet.'
    }
  ]

  return (
    <Section id="kako-radimo" className="how-we-work-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Kako radimo</h2>
        <p className="section-description">
          Kombiniramo strategiju, dizajn i tehnologiju kako bismo stvorili web stranice koje donose rezultate.
        </p>
      </motion.div>

      {/* What We Do Section */}
      <div className="how-we-work-subsection">
        <motion.h3 
          className="subsection-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Što zapravo radimo?
        </motion.h3>
        <p className="subsection-description">
          Svaki projekt pristupamo s pažnjom i fokusom na detalje kako bismo stvorili web stranice 
          koje ne samo da izgledaju odlično, već i donose rezultate.
        </p>

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
      </div>

      {/* Process Section */}
      <div className="how-we-work-subsection process-subsection">
        <motion.h3 
          className="subsection-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Naš proces
        </motion.h3>
        <p className="subsection-description">
          Strukturiran pristup koji osigurava da svaki projekt bude uspješan i ispunjava vaše ciljeve.
        </p>

        <div className="process-steps-list">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="process-step-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <div className="process-step-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="process-step-content">
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-description">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

