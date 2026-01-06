import { motion } from 'framer-motion'
import { MessageSquare, Calendar, Code, Rocket } from 'lucide-react'
import Section from './Section'
import GlareHover from './GlareHover'
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
          const isLast = index === steps.length - 1
          return (
            <div key={index} className="process-step-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
            >
              <div className="process-step-wrapper">
                <div className="process-step-number">{index + 1}</div>
                <GlareHover
                  width="100%"
                  height="100%"
                  background="rgba(255, 255, 255, 0.06)"
                  borderRadius="16px"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  className="process-step"
                >
                  <div className="process-step-icon">
                    <Icon size={32} />
                  </div>
                  <h3 className="process-step-title">{step.title}</h3>
                  <p className="process-step-description">{step.description}</p>
                </GlareHover>
              </div>
            </motion.div>
              {!isLast && (
                <div className="process-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="4,4"/>
                    <polyline points="8 16 12 20 16 16"/>
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}

