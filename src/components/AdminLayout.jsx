import Aurora from './Aurora'
import './Layout.css'

export default function AdminLayout({ children }) {
  return (
    <div className="layout admin-layout">
      <div className="aurora-background">
        <Aurora
          colorStops={["#F5E6D3", "#E8DCC6", "#F5E6D3"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      <div className="layout-content">
        {children}
      </div>
    </div>
  )
}

