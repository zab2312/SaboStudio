import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileSearch, Menu, X } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    
    if (element) {
      const offset = 100 // Offset za navbar visinu
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    
    closeMenu()
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-brand">
            <a href="/" onClick={closeMenu}>sabo studio</a>
          </div>
          <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="navbar-menu-mobile"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <a href="#zasto-nas" onClick={(e) => handleNavClick(e, '#zasto-nas')}>Zašto nas</a>
                <a href="#sto-radimo" onClick={(e) => handleNavClick(e, '#sto-radimo')}>Što radimo</a>
                <a href="#proces" onClick={(e) => handleNavClick(e, '#proces')}>Proces</a>
                <a href="#projekti" onClick={(e) => handleNavClick(e, '#projekti')}>Projekti</a>
                <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')}>FAQ</a>
                <a href="#analiza" className="navbar-cta-mobile" onClick={(e) => handleNavClick(e, '#analiza')}>
                  <FileSearch size={18} />
                  Besplatna analiza
                </a>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="navbar-links">
            <a href="#zasto-nas" onClick={(e) => handleNavClick(e, '#zasto-nas')}>Zašto nas</a>
            <a href="#sto-radimo" onClick={(e) => handleNavClick(e, '#sto-radimo')}>Što radimo</a>
            <a href="#proces" onClick={(e) => handleNavClick(e, '#proces')}>Proces</a>
            <a href="#projekti" onClick={(e) => handleNavClick(e, '#projekti')}>Projekti</a>
            <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')}>FAQ</a>
          </div>
          <a href="#analiza" className="navbar-cta" onClick={(e) => handleNavClick(e, '#analiza')}>
            <FileSearch size={18} />
            <span>Besplatna analiza</span>
          </a>
        </div>
      </nav>
    </>
  )
}

