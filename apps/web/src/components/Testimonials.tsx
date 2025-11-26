export default function Testimonials() {
  const testimonials = [
    {
      quote: "Saved me from a gym membership trap! Found a $200 cancellation fee hidden in paragraph 47. This tool paid for itself instantly.",
      author: "Sarah Martinez",
      role: "Small Business Owner",
      location: "Austin, TX",
      avatarGradient: "from-purple-400 to-pink-500",
      rating: 5,
      verified: true,
      savings: "$200"
    },
    {
      quote: "Used it before signing my apartment lease. Caught 3 unfair clauses and negotiated them out! My landlord was surprised I actually read everything.",
      author: "Michael Chen",
      role: "Software Engineer",
      location: "San Francisco, CA",
      avatarGradient: "from-blue-400 to-cyan-500",
      rating: 5,
      verified: true,
      savings: "$1,200"
    },
    {
      quote: "Finally understand my phone contract. Turns out I was paying for 'insurance' I never signed up for. Got a refund for 8 months!",
      author: "Jessica Lee",
      role: "Teacher",
      location: "Seattle, WA",
      avatarGradient: "from-green-400 to-emerald-500",
      rating: 5,
      verified: true,
      savings: "$320"
    },
    {
      quote: "As a college student, I can't afford legal help. This made me feel protected when signing my first apartment lease. Incredible value!",
      author: "David Thompson",
      role: "Graduate Student",
      location: "Boston, MA",
      avatarGradient: "from-orange-400 to-red-500",
      rating: 5,
      verified: true,
      savings: "$450"
    },
    {
      quote: "Used it for my employment contract negotiation. Identified vague IP clauses that could have cost me my side business. Worth every penny!",
      author: "Rachel Patel",
      role: "Product Designer",
      location: "New York, NY",
      avatarGradient: "from-pink-400 to-rose-500",
      rating: 5,
      verified: true,
      savings: "$5,000+"
    },
    {
      quote: "Analyzed my gym, phone, and insurance contracts in one afternoon. Found I was overpaying by $85/month. Best investment I've made this year!",
      author: "James Wilson",
      role: "Marketing Manager",
      location: "Chicago, IL",
      avatarGradient: "from-indigo-400 to-purple-500",
      rating: 5,
      verified: true,
      savings: "$1,020/yr"
    }
  ]

  return (
    <div className="py-20 bg-gradient-to-b from-paper-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold text-green-700">Verified Reviews</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-ink-900 mb-6">
            Real People, Real Savings
          </h2>
          <p className="text-xl text-ink-600 max-w-3xl mx-auto leading-relaxed">
            Join over 50,000 people who stopped getting scammed by fine print. 
            Our users have collectively saved over <span className="font-bold text-brand-green">$2.5 million</span> in hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, i) => (
            <div 
              key={i}
              className="group bg-white p-8 rounded-2xl border-2 border-border-200 shadow-sm hover:shadow-2xl hover:border-brand-blue transition-all duration-300 hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-ink-700 mb-6 leading-relaxed text-base">
                "{testimonial.quote}"
              </p>

              {/* Savings badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full mb-6">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold text-green-700">Saved {testimonial.savings}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border-200">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.avatarGradient} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-ink-900">{testimonial.author}</div>
                    {testimonial.verified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="text-sm text-ink-600">{testimonial.role}</div>
                  <div className="text-xs text-ink-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof stats */}
        <div className="bg-gradient-to-br from-brand-blue to-blue-900 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-8">Join Our Growing Community</h3>
          <div className="grid sm:grid-cols-4 gap-8">
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Happy Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100K+</div>
              <div className="text-blue-200">Documents Analyzed</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">$2.5M</div>
              <div className="text-blue-200">Total Savings</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.9★</div>
              <div className="text-blue-200">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
