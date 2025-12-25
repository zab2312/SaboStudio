import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import Section from '../components/Section'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProject()
  }, [id])

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setProject(data)
    } catch (error) {
      console.error('Error loading project:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <Section>
          <div className="project-loading">Učitavanje projekta...</div>
        </Section>
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout>
        <Section>
          <div className="project-not-found">Projekt nije pronađen.</div>
        </Section>
      </Layout>
    )
  }

  return (
    <Layout>
      <Section className="project-detail-section">
        <motion.button
          className="back-button"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          Natrag na projekte
        </motion.button>

        {project.image_url && (
          <motion.div
            className="project-detail-image"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src={project.image_url} 
              alt={project.title}
              onError={(e) => {
                console.error('Error loading image:', project.image_url)
                e.target.style.display = 'none'
              }}
            />
          </motion.div>
        )}

        <motion.div
          className="project-detail-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="project-detail-title">{project.title}</h1>
          
          <div className="project-detail-meta">
            <div className="meta-item">
              <Clock size={20} />
              <span>{project.development_time}</span>
            </div>
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="meta-item project-link"
              >
                <ExternalLink size={20} />
                <span>Posjeti stranicu</span>
              </a>
            )}
          </div>

          <div className="project-detail-description">
            <h2>Opis projekta</h2>
            <p>{project.description}</p>
          </div>

          {project.technologies && project.technologies.length > 0 && (
            <div className="project-detail-technologies">
              <h2>Korištene tehnologije</h2>
              <div className="technologies-list">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-badge">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </Section>
    </Layout>
  )
}

