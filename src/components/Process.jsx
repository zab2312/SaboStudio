import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Section from './Section'
import './Process.css'

export default function Process() {
  const pathRef = useRef(null)
  const [stepPositions, setStepPositions] = useState([])

  const steps = [
    {
      title: 'Razgovor i analiza ciljeva',
      description: 'Analiziramo vašu trenutnu situaciju i identificiramo prilike za poboljšanje kroz detaljnu analizu.'
    },
    {
      title: 'Planiranje projekta',
      description: 'Kreiramo jasnu strukturu stranice i plan implementacije s realnim rokovima i ciljevima.'
    },
    {
      title: 'Izrada web stranice',
      description: 'Razvijamo funkcionalnu web stranicu optimiziranu za konverzije, brzinu i korisničko iskustvo.'
    },
    {
      title: 'Lansiranje i kontinuirana podrška',
      description: 'Lansiramo stranicu i kontinuirano optimiziramo na temelju rezultata i povratnih informacija.'
    }
  ]

  // SVG viewBox - responsive
  const viewBox = { width: 1200, height: 500 }

  // Clean S-curve path: one smooth path with 2-3 cubic Bézier curves
  // Long S-curve with gentle waves and upward rise toward the right
  const pathString = `
      M 70 340
  C 220 430, 360 260, 520 300
  S 760 350, 880 290
  S 1010 150, 1120 120
  S 1150 110, 1150 110
  `

  // Step positions along the path (as percentages of path length)
  const stepPercentages = [0.15, 0.40, 0.65, 0.95]

  // Calculate exact positions on the path after it's rendered
  useEffect(() => {
    const calculatePositions = () => {
      if (pathRef.current) {
        const path = pathRef.current
        const length = path.getTotalLength()
        
        if (length > 0) {
          const positions = stepPercentages.map((percentage, index) => {
            const point = path.getPointAtLength(length * percentage)
            
            // Special adjustments for step 1 and step 4
            if (index === 0) {
              // Step 1: Move text 15px to the left
              return {
                x: point.x,
                y: point.y,
                xPercent: ((point.x - 35) / viewBox.width) * 100,
                yPercent: (point.y / viewBox.height) * 100,
                originalX: point.x,
                originalY: point.y
              }
            } else if (index === 3) {
              // Step 4: Move text 15px to the right
              return {
                x: point.x,
                y: point.y,
                xPercent: ((point.x + 35) / viewBox.width) * 100,
                yPercent: (point.y / viewBox.height) * 100,
                originalX: point.x,
                originalY: point.y
              }
            } else {
              // Steps 2 and 3: Use original formula (works well)
              return {
                x: point.x,
                y: point.y,
                xPercent: (point.x / viewBox.width) * 100,
                yPercent: (point.y / viewBox.height) * 100,
                originalX: point.x,
                originalY: point.y
              }
            }
          })
          
          setStepPositions(positions)
        }
      }
    }

    // Calculate immediately if path is available
    calculatePositions()

    // Also calculate after a short delay to ensure path is fully rendered
    const timeout = setTimeout(calculatePositions, 100)

    return () => clearTimeout(timeout)
  }, [])

  // Text positions (alternating above/below)
  const textPositions = [
    { align: 'bottom' },
    { align: 'top' },
    { align: 'bottom' },
    { align: 'top' }
  ]

  return (
    <Section id="proces" className="process-section">
      <motion.div
        className="process-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="process-title">Naš proces izrade web stranica</h2>
      
      </motion.div>

      <div className="process-timeline-container">
        <svg
          className="process-svg"
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Combined gradient with color and opacity for fade in/out */}
            <linearGradient id="pathGradient" x1="0" y1="0" x2={viewBox.width} y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0" />
              <stop offset="10%" stopColor="#dc2626" stopOpacity="1" />
              <stop offset="90%" stopColor="#e53935" stopOpacity="1" />
              <stop offset="100%" stopColor="#e53935" stopOpacity="0" />
            </linearGradient>
            
            {/* Glow filter with red glow effect */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feColorMatrix 
                in="coloredBlur" 
                type="matrix" 
                values="0 0 0 0 0.86
                        0 0 0 0 0.15
                        0 0 0 0 0.15
                        0 0 0 0.8 0"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Single smooth S-curve path with fade in/out and glow */}
          <motion.path
            ref={pathRef}
            className="process-path"
            d={pathString}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Process dots - SVG circles exactly on the curve */}
          {stepPositions.map((pos, index) => (
            <motion.circle
              key={`circle-${index}`}
              cx={pos.originalX || pos.x}
              cy={pos.originalY || pos.y}
              r="8"
              fill="#ffffff"
              stroke="#dc2626"
              strokeWidth="3"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: 0.8 + index * 0.2,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ scale: 1.3 }}
            />
          ))}
        </svg>

        {/* Text blocks - separate HTML elements */}
        <div className="process-steps-wrapper">
          {steps.map((step, index) => {
            const pos = stepPositions[index] || { xPercent: 0, yPercent: 0 }
            const textPos = textPositions[index]
            
            return (
              <motion.div
                key={index}
                className={`process-step process-step-${index + 1}`}
                style={{
                  left: `${pos.xPercent}%`,
                  top: `${pos.yPercent}%`
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.8 + index * 0.2,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <motion.div
                  className={`process-step-content ${textPos.align}`}
                  whileHover={{ scale: 1.05, y: textPos.align === 'top' ? -5 : 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="process-step-number">{index + 1}</div>
                  <h3 className="process-step-title">{step.title}</h3>
                  <p className="process-step-description">{step.description}</p>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
