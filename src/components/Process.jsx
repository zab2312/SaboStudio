import { motion } from 'framer-motion'
import { MessageSquare, Calendar, Code, Rocket } from 'lucide-react'
import Section from './Section'
import './Process.css'

export default function Process() {
  const steps = [
    {
      icon: MessageSquare,
      title: 'Besplatna analiza',
      description: 'Analiziramo vašu trenutnu situaciju i identificiramo prilike za poboljšanje.'
    },
    {
      icon: Calendar,
      title: 'Plan i struktura',
      description: 'Kreiramo jasnu strukturu stranice i plan implementacije s realnim rokovima.'
    },
    {
      icon: Code,
      title: 'Dizajn i izrada',
      description: 'Razvijamo funkcionalnu web stranicu optimiziranu za konverzije i brzinu.'
    },
    {
      icon: Rocket,
      title: 'Objava i optimizacija',
      description: 'Lansiramo stranicu i kontinuirano optimiziramo na temelju rezultata.'
    }
  ]

  return (
    <Section id="proces" className="process-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Naš proces izrade web stranica</h2>
        <p className="section-description">
          Strukturiran pristup koji osigurava da svaki projekt bude uspješan i ispunjava vaše ciljeve.
        </p>
      </motion.div>

      <div className="process-steps">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <motion.div
              key={index}
              className="process-step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.05, x: 10 }}
            >
              <div className="process-step-number">{index + 1}</div>
              <div className="process-step-icon">
                <Icon size={32} />
              </div>
              <h3 className="process-step-title">{step.title}</h3>
              <p className="process-step-description">{step.description}</p>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}

