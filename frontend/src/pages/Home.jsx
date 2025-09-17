import { useAuth } from '../contexts/AuthContext'
import HeroPage from '../components/Hero'
import Dashboard from '../components/Dashboard'
import FeaturesSection from '../components/About'
import TestimonialsSection from '../components/Testimonials'
import FAQAndFooter from '../components/Base'
const Home = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <>
        <HeroPage />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQAndFooter />
      </>
    )
  }

  return <Dashboard />
}

export default Home