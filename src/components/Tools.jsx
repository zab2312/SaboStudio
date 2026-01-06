import { motion } from 'framer-motion'
import Section from './Section'
import './Tools.css'

export default function Tools() {
  const tools = [
    {
      name: 'Figma',
      percentage: 90,
      description: 'Vodeći alat za dizajn',
      icon: (
        <img 
          src="/figma-logo.png" 
          alt="Figma" 
          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
        />
      )
    },
    {
      name: 'Visual Studio Code',
      percentage: 80,
      description: 'Kod editor',
      icon: (
        <img 
          src="/vscode-logo.png" 
          alt="Visual Studio Code" 
          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
          onError={(e) => {
            // Fallback na javni URL ako lokalna slika ne postoji
            e.target.src = 'https://code.visualstudio.com/assets/images/code-stable.png';
          }}
        />
      )
    },
    {
      name: 'Photoshop',
      percentage: 60,
      description: 'Rasterski grafički editor',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="4" fill="#DC2626"/>
          <text x="16" y="22" fontSize="16" fill="white" textAnchor="middle" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-2">Ps</text>
        </svg>
      )
    }
  ].sort((a, b) => b.percentage - a.percentage) // Sortiraj od najvećeg do najmanjeg

  return (
    <Section className="tools-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Alati koje koristimo</h2>
        <p className="section-description">
          Profesionalni alati za dizajn i razvoj koji osiguravaju kvalitetne rezultate
        </p>
      </motion.div>

      <div className="tools-list">
        {tools.map((tool, index) => (
          <motion.div
            key={index}
            className="tool-item"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="tool-content">
              <div className="tool-icon-wrapper">
                {tool.icon}
              </div>
              <div className="tool-info">
                <div className="tool-header">
                  <span className="tool-name">{tool.name}</span>
                  <span className="tool-percentage">{tool.percentage}%</span>
                </div>
                <p className="tool-description">{tool.description}</p>
                <div className="progress-bar-container">
                  <motion.div
                    className="progress-bar"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tool.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

