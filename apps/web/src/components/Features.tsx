export default function Features() {
  const features = [
    {
      icon: '⚡',
      title: 'Universal Analysis',
      description: 'Analyze any content type: documents, code, articles, emails, research papers, and more.',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Insights',
      description: 'Advanced AI summarization with key points, sentiment analysis, and topic extraction.',
    },
    {
      icon: '🎯',
      title: 'Actionable Results',
      description: 'Get clear recommendations and next steps tailored to your content type.',
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Bank-level encryption, threat monitoring, and comprehensive security logging.',
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Get results in seconds. Optimized for speed without compromising accuracy.',
    },
    {
      icon: '💼',
      title: 'Professional Grade',
      description: 'Built for professionals who need reliable, accurate analysis at scale.',
    }
  ]

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Why Choose PaiperSum
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Professional AI analysis that works with any content type. Fast, accurate, secure.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
