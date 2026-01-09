import { motion } from 'framer-motion'
import { Shield, Clock, Zap, TrendingUp } from 'lucide-react'
import Section from './Section'
import './WhyWebsites.css'

export default function WhyWebsites() {
  const cards = [
    {
      icon: Shield,
      title: 'Povjerenje i Kredibilitet',
      description: 'Profesionalna web stranica gradi povjerenje i kredibilitet kod vaših klijenata.'
    },
    {
      icon: Clock,
      title: 'Dostupnost 24/7',
      description: 'Vaša web stranica radi 24 sata dnevno, 7 dana u tjednu, bez odmora.'
    },
    {
      icon: Zap,
      title: 'Automatizacija',
      description: 'Automatizirajte procese, smanjite troškove i povećajte efikasnost.'
    },
    {
      icon: TrendingUp,
      title: 'Rast i Konkurentnost',
      description: 'Budite konkurentni i omogućite rast vašeg poslovanja u digitalnom svijetu.'
    }
  ]

  return (
    <Section id="zasto-web-stranice" className="why-websites-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Zašto su potrebne web stranice?</h2>
        <p className="section-description">
          Nalazimo se u fazi digitalne transformacije gdje svako poslovanje treba profesionalnu web stranicu. 
          Bez prisutnosti na internetu, vaš biznis gubi ogromne mogućnosti za rast i razvoj.
        </p>
      </motion.div>

      <div className="why-statements-list">
        {cards.map((card, index) => {
          const Icon = card.icon
          const isLeft = index % 2 === 0
          return (
            <motion.div
              key={index}
              className={`why-statement ${isLeft ? 'align-left' : 'align-right'}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="why-statement-content">
                <div className="why-statement-icon">
                  <Icon size={24} />
                </div>
                <div className="why-statement-text">
                  <h3 className="why-statement-title">{card.title}</h3>
                  <p className="why-statement-description">{card.description}</p>
                </div>
              </div>
              {index < cards.length - 1 && <div className="why-statement-divider"></div>}
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}

