import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Section from './Section'
import GlareHover from './GlareHover'
import './Projects.css'

function BounceCard({ project, index }) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg'])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      className="bounce-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={() => project.id && !project.id.startsWith('demo') && navigate(`/project/${project.id}`)}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
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
            <p className="project-description">{project.description}</p>
            
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
        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <BounceCard key={project.id} project={project} index={index} />
            ))
          ) : (
            <>
              <BounceCard 
                project={{
                  id: 'demo-1',
                  title: 'OPG - Online prodaja proizvoda',
                  description: 'Web stranica za lokalni OPG s online shopom. Povećanje online narudžbi za 150% u prva 3 mjeseca. Mobilno optimizirana stranica s jednostavnim upravljanjem zalihama.',
                  technologies: ['WordPress', 'WooCommerce', 'Responsive Design'],
                  development_time: '3-4 tjedna',
                  website_url: null,
                  image_url: null
                }}
                index={0}
              />
              <BounceCard 
                project={{
                  id: 'demo-2',
                  title: 'Frizerski salon - Rezervacije online',
                  description: 'Moderni web dizajn za frizerski salon s online rezervacijskim sustavom. Povećanje rezervacija za 80% i poboljšanje korisničkog iskustva. Integracija s kalendarom i SMS obavještavanje.',
                  technologies: ['React', 'Node.js', 'Booking System'],
                  development_time: '4-5 tjedana',
                  website_url: null,
                  image_url: null
                }}
                index={1}
              />
              <BounceCard 
                project={{
                  id: 'demo-3',
                  title: 'Restoran - Meni i narudžbe',
                  description: 'Responzivna web stranica za restoran s digitalnim menijem i mogućnosti online narudžbe. Povećanje online narudžbi za 200% i brže učitavanje stranice.',
                  technologies: ['Next.js', 'TypeScript', 'Mobile First'],
                  development_time: '4 tjedna',
                  website_url: null,
                  image_url: null
                }}
                index={2}
              />
            </>
          )}
        </div>
      )}
    </Section>
  )
}

