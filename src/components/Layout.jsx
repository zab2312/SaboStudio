import Aurora from './Aurora'
import FloatingMenu from './FloatingMenu'
import GradualBlur from './GradualBlur'
import './Layout.css'

export default function Layout({ children }) {
  return (
    <div className="layout">
      <FloatingMenu />
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
      <GradualBlur 
        position="bottom"
        target="page"
        strength={2}
        height="6rem"
        divCount={5}
        exponential={true}
        opacity={1}
        curve="bezier"
      />
    </div>
  )
}

