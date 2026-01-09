import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, FileSearch } from 'lucide-react'
import './FloatingMenu.css'

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const drawerRef = useRef(null)
  const buttonRef = useRef(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    
    if (element) {
      const offset = 80 // Reduced offset since no navbar
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    
    closeMenu()
  }

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu()
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    const drawer = drawerRef.current
    if (!drawer) return

    const focusableElements = drawer.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    drawer.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      drawer.removeEventListener('keydown', handleTabKey)
    }
  }, [isOpen])

  const navLinks = [
    { href: '#zasto-nas', label: 'Zašto nas' },
    { href: '#sto-radimo', label: 'Što radimo' },
    { href: '#paketi', label: 'Paketi', highlight: true },
    { href: '#proces', label: 'Proces' },
    { href: '#projekti', label: 'Projekti' },
    { href: '#faq', label: 'FAQ' },
  ]

  // Hide blur effect when drawer is open
  useEffect(() => {
    const blurElement = document.querySelector('.gradual-blur-page')
    if (blurElement) {
      if (isOpen) {
        blurElement.style.display = 'none'
      } else {
        blurElement.style.display = ''
      }
    }
  }, [isOpen])

  return (
    <>
      {/* Floating Menu Button */}
      <motion.button
        ref={buttonRef}
        className="floating-menu-button"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        type="button"
        initial={false}
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Off-canvas Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300 
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="drawer-content">
              {/* Brand */}
              <div className="drawer-brand">
                <a href="/" onClick={closeMenu}>
                  sabo studio
                </a>
              </div>

              {/* Navigation Links */}
              <nav className="drawer-nav">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`drawer-link ${link.highlight ? 'drawer-link--highlight' : ''}`}
                  >
                    {link.label}
                    {link.highlight && <span className="drawer-link-badge">Popularno</span>}
                  </a>
                ))}
              </nav>

              {/* Primary CTA */}
              <div className="drawer-cta">
                <a
                  href="#analiza"
                  className="drawer-cta-button"
                  onClick={(e) => handleNavClick(e, '#analiza')}
                >
                  <FileSearch size={18} />
                  <span>Pošalji web na provjeru</span>
                </a>
              </div>

              {/* Optional: Secondary items can be added here */}
              {/* <div className="drawer-footer">
                <a href="mailto:info@sabostudio.com" className="drawer-footer-link">
                  info@sabostudio.com
                </a>
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

