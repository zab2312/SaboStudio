import Layout from '../components/Layout'
import Hero from '../components/Hero'
import TrustSignals from '../components/TrustSignals'
import WhyWebsites from '../components/WhyWebsites'
import WhatWeDo from '../components/WhatWeDo'
import Process from '../components/Process'
import Projects from '../components/Projects'
import Testimonials from '../components/Testimonials'
import FreeAudit from '../components/FreeAudit'
import AppointmentBooking from '../components/AppointmentBooking'
import BottomCTA from '../components/BottomCTA'
import FAQ from '../components/FAQ'
import './Home.css'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <TrustSignals />
      <WhyWebsites />
      <WhatWeDo />
      <Process />
      <Projects />
      <Testimonials />
      <FreeAudit />
      <AppointmentBooking />
      <BottomCTA />
      <FAQ />
    </Layout>
  )
}

