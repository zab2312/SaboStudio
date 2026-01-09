import { motion } from 'framer-motion'
import { FileSearch, TrendingUp, Smartphone, Zap, Target } from 'lucide-react'
import Section from './Section'
import GlareHover from './GlareHover'
import './Hero.css'

export default function Hero() {
  const benefitBullets = [
    { icon: TrendingUp, text: 'Više upita i rezervacija' },
    { icon: Target, text: 'Jasna poruka i jednostavno korištenje' },
    { icon: Zap, text: 'Brza, pouzdana i mobilna stranica' },
    { icon: Smartphone, text: 'Fokus na lokalne biznise' }
  ]

  return (
    <Section className="hero-section">
      <div className="hero-content">
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Web dizajn za lokalne biznise koji ne žele prosječno rješenje.
        </motion.h1>
        
        <motion.p 
          className="hero-subheadline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Jasni paketi, transparentne cijene i iskren savjet prije svake ponude.
        </motion.p>

        <motion.div 
          className="hero-cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.a
            href="#analiza"
            className="hero-cta-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileSearch size={20} />
            Pošalji web na provjeru
          </motion.a>
        </motion.div>

        <div className="hero-benefit-bullets">
          {benefitBullets.map((bullet, index) => {
            const Icon = bullet.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <GlareHover
                  width="100%"
                  height="100%"
                  background="rgba(255, 255, 255, 0.06)"
                  borderRadius="12px"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  className="benefit-bullet"
                >
                  <Icon size={20} className="benefit-icon" />
                  <span>{bullet.text}</span>
                </GlareHover>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

