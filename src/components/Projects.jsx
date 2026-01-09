import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { supabase } from '../lib/supabase'
import Section from './Section'
import GlareHover from './GlareHover'
import './Projects.css'

function BounceCard({ project, index }) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className="bounce-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => project.id && !project.id.startsWith('demo') && navigate(`/project/${project.id}`)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
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
      >
        <div className="bounce-card-inner">
          {project.image_url && (
            <div className="project-image">
              <img src={project.image_url} alt={project.title} />
            </div>
          )}
          <div className="project-content">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.short_description || project.description}</p>
            
            <div className="project-technologies">
              {project.technologies?.map((tech, i) => (
                <span key={i} className="tech-tag">{tech}</span>
              ))}
            </div>
            
            <div className="project-meta">
              <span className="project-time">⏱️ {project.development_time}</span>
              {project.website_url && (
                <a
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={16} />
                  Posjeti stranicu
                </a>
              )}
            </div>
          </div>
        </div>
      </GlareHover>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
      containScroll: 'trimSnaps',
      skipSnaps: false,
      duration: 25, // Animation duration for smooth transitions
      startIndex: 0,
      slidesToScroll: 1,
    },
    []
  )

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(true)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    // In infinite loop mode, buttons are always enabled
    // But we can still check if we're at the start/end for visual feedback
    setPrevBtnEnabled(true)
    setNextBtnEnabled(true)
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!emblaApi) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        scrollPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        scrollNext()
      }
    }

    const emblaNode = emblaRef.current
    if (emblaNode) {
      emblaNode.addEventListener('keydown', handleKeyDown)
      emblaNode.setAttribute('tabIndex', '0')
      emblaNode.setAttribute('role', 'region')
      emblaNode.setAttribute('aria-label', 'Projects carousel')
    }

    return () => {
      if (emblaNode) {
        emblaNode.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [emblaApi, emblaRef, scrollPrev, scrollNext])

  // Re-initialize on projects change
  useEffect(() => {
    if (emblaApi && projects.length > 0) {
      emblaApi.reInit()
    }
  }, [emblaApi, projects.length])

  const displayProjects = projects.length > 0 
    ? projects 
    : [
        {
          id: 'demo-1',
          title: 'OPG - Online prodaja proizvoda',
          description: 'Web stranica za lokalni OPG s online shopom. Povećanje online narudžbi za 150% u prva 3 mjeseca. Mobilno optimizirana stranica s jednostavnim upravljanjem zalihama.',
          technologies: ['WordPress', 'WooCommerce', 'Responsive Design'],
          development_time: '3-4 tjedna',
          website_url: null,
          image_url: null
        },
        {
          id: 'demo-2',
          title: 'Frizerski salon - Rezervacije online',
          description: 'Moderni web dizajn za frizerski salon s online rezervacijskim sustavom. Povećanje rezervacija za 80% i poboljšanje korisničkog iskustva. Integracija s kalendarom i SMS obavještavanje.',
          technologies: ['React', 'Node.js', 'Booking System'],
          development_time: '4-5 tjedana',
          website_url: null,
          image_url: null
        },
        {
          id: 'demo-3',
          title: 'Restoran - Meni i narudžbe',
          description: 'Responzivna web stranica za restoran s digitalnim menijem i mogućnosti online narudžbe. Povećanje online narudžbi za 200% i brže učitavanje stranice.',
          technologies: ['Next.js', 'TypeScript', 'Mobile First'],
          development_time: '4 tjedna',
          website_url: null,
          image_url: null
        }
      ]

  return (
    <Section id="projekti" className="projects-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Naši projekti</h2>
        <p className="section-description">
          Pogledajte neke od naših uspješnih projekata i rezultata koje smo postigli
        </p>
      </motion.div>

      {loading ? (
        <div className="projects-loading">Učitavanje projekata...</div>
      ) : (
        <div className="projects-carousel-wrapper">
          <div className="projects-carousel" ref={emblaRef}>
            <div className="projects-carousel-container">
              {displayProjects.map((project, index) => (
                <div key={project.id || index} className="projects-carousel-slide">
                  <BounceCard project={project} index={index} />
                </div>
              ))}
            </div>
          </div>
          
          <button
            className="projects-carousel-button projects-carousel-button--prev"
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            aria-label="Previous project"
            type="button"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            className="projects-carousel-button projects-carousel-button--next"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            aria-label="Next project"
            type="button"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </Section>
  )
}
