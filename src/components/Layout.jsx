import Aurora from './Aurora'
import Navbar from './Navbar'
import './Layout.css'

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <div className="aurora-background">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
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

