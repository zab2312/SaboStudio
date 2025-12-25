import './Section.css'

export default function Section({ children, className = '', id }) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="section-card">
        {children}
      </div>
    </section>
  )
}

