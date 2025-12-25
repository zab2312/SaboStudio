import { motion } from 'framer-motion'
import { FileSearch } from 'lucide-react'
import Section from './Section'
import './BottomCTA.css'

export default function BottomCTA() {
  return (
    <Section id="analiza" className="bottom-cta-section">
      <motion.div
        className="bottom-cta-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="bottom-cta-title">Niste sigurni treba li vam nova web stranica?</h2>
        <p className="bottom-cta-text">
          Zatražite besplatnu analizu i saznajte što vaša web stranica može raditi bolje.
        </p>
        <a href="#analiza" className="bottom-cta-button">
          <FileSearch size={20} />
          Zatraži besplatnu analizu
        </a>
        <p className="bottom-cta-microcopy">Bez obaveze. Bez prodajnog pritiska.</p>
      </motion.div>
    </Section>
  )
}

