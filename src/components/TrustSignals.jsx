import { motion } from 'framer-motion'
import { Target, MessageSquare, Zap, Users } from 'lucide-react'
import Section from './Section'
import GlareHover from './GlareHover'
import CountUp from './CountUp'
import './TrustSignals.css'

export default function TrustSignals() {
  const reasons = [
    {
      icon: Target,
      title: 'Fokus na konverzije (CRO)',
      supportingSentence: 'Svaki dizajn je testiran i optimiziran za maksimalne rezultate.',
      description: 'Ne samo lijepo, već funkcionalno – dizajniramo za rezultate.'
    },
    {
      icon: MessageSquare,
      title: 'Jasna komunikacija i realni rokovi',
      supportingSentence: 'Bez iznenađenja, bez odlaganja – sve je unaprijed dogovoreno.',
      description: 'Transparentnost i odgovornost u svakom koraku projekta.'
    },
    {
      icon: Zap,
      title: 'Brza i mobilno optimizirana izrada',
      supportingSentence: 'Odlično iskustvo na svakom uređaju, u svako vrijeme.',
      description: 'Stranice koje se učitavaju brzo i savršeno rade na svim uređajima.'
    },
    {
      icon: Users,
      title: 'Individualni pristup (ne radimo masovno)',
      supportingSentence: 'Vaš projekt je prioritet, ne samo još jedan zadatak na listi.',
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
          const isWideCard = index === 3 // 4th card (0-indexed)
          return (
            <motion.div
              key={index}
              className={isWideCard ? 'trust-reason-item trust-reason-item-wide' : 'trust-reason-item'}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlareHover
                width="100%"
                height="auto"
                background="rgba(255, 255, 255, 0.06)"
                borderRadius="16px"
                borderColor="rgba(255, 255, 255, 0.1)"
                glareColor="#ffffff"
                glareOpacity={0.3}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={800}
                playOnce={false}
                className={isWideCard ? 'trust-reason-card trust-reason-card-wide' : 'trust-reason-card'}
              >
                {isWideCard ? (
                  <div className="trust-reason-card-wide-content">
                    <div className="trust-reason-card-wide-left">
                      <div className="trust-reason-icon">
                        <Icon size={28} />
                      </div>
                      <h3 className="trust-reason-title">{reason.title}</h3>
                    </div>
                    <div className="trust-reason-card-wide-right">
                      <p className="trust-reason-description">{reason.description}</p>
                      <p className="trust-reason-supporting">{reason.supportingSentence}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="trust-reason-icon">
                      <Icon size={28} />
                    </div>
                    <h3 className="trust-reason-title">{reason.title}</h3>
                    <p className="trust-reason-supporting">{reason.supportingSentence}</p>
                    <p className="trust-reason-description">{reason.description}</p>
                  </>
                )}
              </GlareHover>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        className="trust-stats-bar"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="trust-stats-item">
          <span className="trust-stat-value">
            <CountUp
              to={12}
              from={0}
              duration={2}
              delay={0.2}
              className="count-up-number"
            />
            <span className="trust-stat-plus">+</span>
          </span>
          <span className="trust-stat-label">završenih projekata</span>
        </div>
        <span className="trust-stats-separator">•</span>
        <div className="trust-stats-item">
          <span className="trust-stat-label">Lokalni biznisi</span>
        </div>
        <span className="trust-stats-separator">•</span>
        <div className="trust-stats-item">
          <span className="trust-stat-label">Dugoročne suradnje</span>
        </div>
      </motion.div>
    </Section>
  )
}

