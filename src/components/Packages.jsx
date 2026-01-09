import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Section from './Section'
import GlareHover from './GlareHover'
import './Packages.css'

export default function Packages() {
  const packages = [
    {
      key: 'start',
      name: 'START WEB',
      description: 'Za lokalne obrtnike i uslužne biznise kojima treba profesionalna web stranica bez komplikacija.',
      features: [
        '1–3 stranice (Naslovna, Usluge, Kontakt)',
        'Moderan i čist dizajn',
        'Prilagodba za mobitele, tablete i računala',
        'Kontakt forma i gumb za poziv ili WhatsApp',
        'Osnovna SEO struktura i optimizacija brzine'
      ],
      price: 'Od 490 €',
      isPopular: false
    },
    {
      key: 'upiti',
      name: 'WEB KOJI DONOSI UPITE',
      description: 'Za lokalne biznise koji žele da im se klijenti aktivno javljaju putem web stranice.',
      features: [
        'Sve iz paketa START WEB',
        '4–6 stranica s jasnom strukturom sadržaja',
        'Dizajn i raspored usmjeren na upite i kontakt',
        'Tekstovi prilagođeni lokalnoj publici i uslugama',
        'Osnovna on-page SEO optimizacija',
        'Integracija Google Mapsa i recenzija (po potrebi)',
        'Savjetovanje oko sadržaja i strukture weba'
      ],
      price: 'Od 890 €',
      isPopular: true
    },
    {
      key: 'custom',
      name: 'CUSTOM WEB',
      description: 'Za biznise kojima treba potpuno prilagođena web stranica i jača online prisutnost.',
      features: [
        'Sve iz paketa WEB KOJI DONOSI UPITE',
        'Potpuno prilagođen dizajn (bez gotovih predložaka)',
        'Napredna struktura stranica i sadržaja',
        'Dodatne landing sekcije po potrebi',
        'Integracije (online rezervacije, napredne forme, CRM, newsletter i slično)',
        'Individualna suradnja 1-na-1 kroz cijeli projekt'
      ],
      price: 'Od 1.600 €',
      isPopular: false
    }
  ]

  const handlePackageClick = (packageKey) => {
    console.log('Package clicked:', packageKey)
    
    // Update URL with package query param
    const url = new URL(window.location)
    url.searchParams.set('paket', packageKey)
    window.history.pushState({}, '', url)
    
    // Trigger custom event for AppointmentBooking to pick up
    window.dispatchEvent(new CustomEvent('packageSelected', { detail: { packageKey } }))
    
    // Smooth scroll to booking section - using same method as Navbar
    const scrollToBooking = (attempt = 0) => {
      const bookingSection = document.getElementById('rezervacija')
      console.log('Scroll attempt:', attempt, 'Element found:', !!bookingSection)
      
      if (bookingSection) {
        // Use same method as Navbar: getBoundingClientRect + pageYOffset
        const offset = 80 // Offset for floating menu button
        const elementPosition = bookingSection.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        console.log('Scrolling to:', offsetPosition, 'Current scroll:', window.pageYOffset)
        
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        })
      } else if (attempt < 15) {
        // Retry if element not found yet (max 15 attempts = 1.5 seconds)
        setTimeout(() => scrollToBooking(attempt + 1), 100)
      } else {
        console.error('Element not found after 15 attempts')
      }
    }
    
    // Start scrolling immediately, with retry logic
    scrollToBooking()
  }

  return (
    <Section id="paketi" className="packages-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Paketi usluga</h2>
        <p className="section-description">
          Jasna struktura, transparentne cijene. Svaki paket prilagođavamo vašim stvarnim potrebama.
        </p>
      </motion.div>

      <div className="packages-grid">
        {packages.map((pkg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`package-item ${pkg.isPopular ? 'package-popular' : ''}`}
          >
            <GlareHover
              width="100%"
              height="auto"
              background="rgba(255, 255, 255, 0.06)"
              borderRadius="16px"
              borderColor={pkg.isPopular ? "rgba(220, 38, 38, 0.3)" : "rgba(255, 255, 255, 0.1)"}
              glareColor="#ffffff"
              glareOpacity={0.3}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={800}
              playOnce={false}
              className="package-card package-card-clickable"
              onClick={() => handlePackageClick(pkg.key)}
            >
              {pkg.isPopular && (
                <div className="package-badge">
                  <span>Najčešći izbor</span>
                </div>
              )}
              
              <div className="package-header">
                <h3 className="package-name">{pkg.name}</h3>
                <p className="package-description">{pkg.description}</p>
              </div>

              <div className="package-features">
                <ul className="package-features-list">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="package-feature-item">
                      <Check size={16} className="package-feature-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="package-footer">
                <div className="package-price">{pkg.price}</div>
              </div>
            </GlareHover>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="packages-note"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="packages-note-text">
          Paketi su polazna točka. Svaki projekt prilagođavamo stvarnim potrebama i ciljevima klijenta.
        </p>
      </motion.div>
    </Section>
  )
}

