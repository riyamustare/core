import { useState, useEffect } from 'react'

const TestimonialsSection = () => {
  const testimonials = [
    {
      text: "Core helped me sort through my messy thoughts when I couldn't even figure out where to start. It's like having a friend who actually gets it.",
      author: "Sarah M."
    },
    {
      text: "I was skeptical at first, but Core really does make me feel heard. No judgment, just genuine understanding when I need to vent.",
      author: "Mike R."
    },
    {
      text: "Finally, something that doesn't make me feel weird for overthinking everything. Core gets my chaos and helps me make sense of it.",
      author: "Alex K."
    },
    {
      text: "3 AM anxiety spirals? Core's there. Midday work stress? Core's there. It's like therapy but available whenever I need it.",
      author: "Jordan P."
    },
    {
      text: "I love that I can just dump all my thoughts without worrying about bothering anyone. Core actually helps me see patterns I never noticed.",
      author: "Taylor L."
    },
    {
      text: "No appointments, no scheduling, no pressure. Just open and talk. Core has become my go-to for mental clarity.",
      author: "Casey W."
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(4)

  // Update itemsPerPage based on screen width
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 1024) {
        setItemsPerPage(2) // mobile/tablet
      } else {
        setItemsPerPage(4) // desktop
      }
    }

    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= testimonials.length ? 0 : prevIndex + itemsPerPage
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, testimonials.length - itemsPerPage) : prevIndex - itemsPerPage
    )
  }

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerPage)

  return (
    <section className="bg-[#FAF7F2] py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            what people are saying
          </h2>
          
          {/* Navigation arrows */}
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              disabled={currentIndex === 0}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              disabled={currentIndex + itemsPerPage >= testimonials.length}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Testimonials Flex Row */}
        <div className="flex overflow-hidden gap-4">
          {visibleTestimonials.map((testimonial, idx) => (
            <div
              key={currentIndex + idx}
              className={`flex-shrink-0 ${
                itemsPerPage === 2 ? 'w-[calc(50%-0.5rem)]' : 'w-[calc(25%-0.75rem)]'
              } bg-white border border-gray-200 rounded-2xl p-6 h-[260px] flex flex-col justify-between hover:shadow-sm transition-shadow`}
            >
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>
                <p className="text-gray-500 text-xs font-medium">
                  — {testimonial.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
