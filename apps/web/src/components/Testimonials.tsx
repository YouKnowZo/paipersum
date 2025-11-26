export default function Testimonials() {
  const testimonials = [
    {
      quote: "Saved me from a gym membership trap! Found a $200 cancellation fee hidden in paragraph 47.",
      author: "Sarah M.",
      role: "Small Business Owner",
      avatar: "👩‍💼",
      rating: 5
    },
    {
      quote: "Used it before signing my apartment lease. Caught 3 unfair clauses and negotiated them out!",
      author: "Mike T.",
      role: "Software Engineer",
      avatar: "👨‍💻",
      rating: 5
    },
    {
      quote: "Finally understand my phone contract. Turns out I was paying for 'insurance' I never signed up for.",
      author: "Jessica L.",
      role: "Teacher",
      avatar: "👩‍🏫",
      rating: 5
    }
  ]

  return (
    <div className="py-16 bg-gradient-to-b from-white to-paper-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">
            Real People, Real Savings
          </h2>
          <p className="text-lg text-ink-600">
            Join thousands who stopped getting scammed by fine print
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div 
              key={i}
              className="bg-white p-6 rounded-xl border border-border-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-ink-700 mb-4 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-ink-900">{testimonial.author}</div>
                  <div className="text-sm text-ink-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
