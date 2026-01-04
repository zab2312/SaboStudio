import { motion } from 'framer-motion'
import { Target, MessageSquare, Zap, Users } from 'lucide-react'
import Section from './Section'
import GlareHover from './GlareHover'
import './TrustSignals.css'

export default function TrustSignals() {
  const reasons = [
    {
      icon: Target,
      title: 'Fokus na konverzije (CRO)',
      description: 'Ne samo lijepo, već funkcionalno – dizajniramo za rezultate.'
    },
    {
      icon: MessageSquare,
      title: 'Jasna komunikacija i realni rokovi',
      description: 'Transparentnost i odgovornost u svakom koraku projekta.'
    },
    {
      icon: Zap,
      title: 'Brza i mobilno optimizirana izrada',
      description: 'Stranice koje se učitavaju brzo i savršeno rade na svim uređajima.'
    },
    {
      icon: Users,
      title: 'Individualni pristup (ne radimo masovno)',
      description: 'Svaki projekt je jedinstven i dobiva pažnju koju zaslužuje.'
    }
  ]

  return (
    <Section id="zasto-nas" className="trust-signals-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Zašto klijenti biraju nas</h2>
        <p className="section-description">
          Nismo samo izvođači – partneri smo u vašem digitalnom rastu
        </p>
      </motion.div>

      <div className="trust-reasons-grid">
        {reasons.map((reason, index) => {
          const Icon = reason.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
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
                className="trust-reason-card"
              >
                <div className="trust-reason-icon">
                  <Icon size={28} />
                </div>
                <h3 className="trust-reason-title">{reason.title}</h3>
                <p className="trust-reason-description">{reason.description}</p>
              </GlareHover>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        className="trust-strip"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="trust-strip-content">
          <span className="trust-strip-label">Radimo s lokalnim poduzećima</span>
          <div className="trust-strip-logos">
            <div className="trust-logo-placeholder">OPG</div>
            <div className="trust-logo-placeholder">Saloni</div>
            <div className="trust-logo-placeholder">Restorani</div>
            <div className="trust-logo-placeholder">Klinike</div>
            <div className="trust-logo-placeholder">Pravne službe</div>
          </div>
        </div>
      </motion.div>
    </Section>
  )
}

