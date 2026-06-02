import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { fetchPackagesContent, mapDbPackageToCard } from '../lib/packagesApi'
import Section from './Section'
import GlareHover from './GlareHover'
import './Packages.css'

function PackageCard({ pkg, index, onPackageClick }) {
  return (
    <motion.div
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
        borderColor={pkg.isPopular ? 'rgba(220, 38, 38, 0.3)' : 'rgba(255, 255, 255, 0.1)'}
        glareColor="#ffffff"
        glareOpacity={0.3}
        glareAngle={-30}
        glareSize={300}
        transitionDuration={800}
        playOnce={false}
        className="package-card package-card-clickable"
        onClick={() => onPackageClick(pkg.key)}
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
  )
}

export default function Packages() {
  const [settings, setSettings] = useState(null)
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    try {
      setLoading(true)
      setError(null)
      const { settings: pageSettings, sections: loadedSections } = await fetchPackagesContent({
        publishedOnly: true,
      })

      setSettings(pageSettings)
      setSections(
        loadedSections
          .filter((section) => section.packages.length > 0)
          .map((section) => ({
            ...section,
            packages: section.packages.map(mapDbPackageToCard),
          }))
      )
    } catch (err) {
      console.error('Error loading packages:', err)
      setError('Paketi se trenutno ne mogu učitati.')
    } finally {
      setLoading(false)
    }
  }

  const handlePackageClick = (packageKey) => {
    const url = new URL(window.location)
    url.searchParams.set('paket', packageKey)
    window.history.pushState({}, '', url)

    window.dispatchEvent(new CustomEvent('packageSelected', { detail: { packageKey } }))

    const scrollToBooking = (attempt = 0) => {
      const bookingSection = document.getElementById('rezervacija')

      if (bookingSection) {
        const offset = 80
        const elementPosition = bookingSection.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth',
        })
      } else if (attempt < 15) {
        setTimeout(() => scrollToBooking(attempt + 1), 100)
      }
    }

    scrollToBooking()
  }

  if (loading) {
    return (
      <Section id="paketi" className="packages-section">
        <p className="packages-loading">Učitavanje paketa...</p>
      </Section>
    )
  }

  if (error || !settings) {
    return (
      <Section id="paketi" className="packages-section">
        <p className="packages-error">{error || 'Paketi nisu konfigurirani.'}</p>
      </Section>
    )
  }

  const comboKey = settings.combo_package_key || 'web-social'

  return (
    <Section id="paketi" className="packages-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">{settings.page_title}</h2>
        <p className="section-description">{settings.page_description}</p>
      </motion.div>

      {sections.map((section, sectionIndex) => (
        <div key={section.id}>
          <motion.div
            className={`packages-subsection ${sectionIndex > 0 ? 'packages-subsection-social' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="packages-subsection-title">{section.title}</h3>
            {section.description && (
              <p className="packages-subsection-description">{section.description}</p>
            )}
          </motion.div>
          <div className="packages-grid">
            {section.packages.map((pkg, index) => (
              <PackageCard key={pkg.key} pkg={pkg} index={index} onPackageClick={handlePackageClick} />
            ))}
          </div>
        </div>
      ))}

      {settings.combo_enabled && (
        <motion.div
          className="packages-combo-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h4 className="packages-combo-cta-title">{settings.combo_title}</h4>
          <p className="packages-combo-cta-text">{settings.combo_description}</p>
          <button
            type="button"
            className="packages-combo-cta-button"
            onClick={() => handlePackageClick(comboKey)}
          >
            {settings.combo_button_text}
          </button>
        </motion.div>
      )}

      {settings.footer_note && (
        <motion.div
          className="packages-note"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="packages-note-text">{settings.footer_note}</p>
        </motion.div>
      )}
    </Section>
  )
}
