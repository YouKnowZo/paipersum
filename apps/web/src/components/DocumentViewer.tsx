import { useState } from 'react'
import type { EnhancedAnalysisT } from '../lib/schemas'

interface DocumentViewerProps {
  text: string
  analysis: EnhancedAnalysisT
}

export default function DocumentViewer({ text, analysis }: DocumentViewerProps) {
  const [selectedClause, setSelectedClause] = useState<number | null>(null)

  // Create highlights based on analysis
  const highlights = analysis.clauses.map((clause, i) => {
    // Find clause in text
    const searchTerm = clause.title.toLowerCase().split(' ')[0]
    const index = text.toLowerCase().indexOf(searchTerm)
    
    return {
      id: i,
      clause,
      start: index > -1 ? index : 0,
      end: index > -1 ? index + 100 : 100
    }
  })

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Compare Version
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {highlights.length} risks highlighted
        </div>
      </div>

      {/* Document Viewer */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-8 min-h-[600px] relative">
        <div className="prose max-w-none">
          {text.split('\n').map((paragraph, pIdx) => {
            // Check if this paragraph contains any highlights
            const paragraphStart = text.indexOf(paragraph)
            const paragraphEnd = paragraphStart + paragraph.length
            
            const relevantHighlights = highlights.filter(h => 
              h.start >= paragraphStart && h.start < paragraphEnd
            )

            if (relevantHighlights.length === 0) {
              return <p key={pIdx} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
            }

            // Render paragraph with highlights
            let lastIndex = 0
            const parts: JSX.Element[] = []
            
            relevantHighlights.forEach((highlight, hIdx) => {
              const relativeStart = highlight.start - paragraphStart
              const relativeEnd = highlight.end - paragraphStart
              
              // Add text before highlight
              if (relativeStart > lastIndex) {
                parts.push(
                  <span key={`text-${hIdx}`}>
                    {paragraph.substring(lastIndex, relativeStart)}
                  </span>
                )
              }
              
              // Add highlighted text
              const riskColors = {
                red: 'bg-red-100 text-red-800 border-red-300',
                yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                green: 'bg-green-100 text-green-800 border-green-300'
              }
              
              parts.push(
                <span
                  key={`highlight-${hIdx}`}
                  className={`px-1 py-0.5 rounded border-2 cursor-pointer hover:shadow-md transition ${riskColors[highlight.clause.risk]}`}
                  onClick={() => setSelectedClause(highlight.id)}
                  title={highlight.clause.summary}
                >
                  {paragraph.substring(relativeStart, Math.min(relativeEnd, paragraph.length))}
                </span>
              )
              
              lastIndex = relativeEnd
            })
            
            // Add remaining text
            if (lastIndex < paragraph.length) {
              parts.push(
                <span key={`text-end`}>
                  {paragraph.substring(lastIndex)}
                </span>
              )
            }

            return (
              <p key={pIdx} className="mb-4 text-gray-700 leading-relaxed">
                {parts}
              </p>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
              <span>High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
              <span>Moderate Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span>Low Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar with clause details */}
      {selectedClause !== null && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">{analysis.clauses[selectedClause].title}</h3>
          <p className="text-gray-700 mb-4">{analysis.clauses[selectedClause].summary}</p>
          <p className="text-sm text-gray-600 italic">"{analysis.clauses[selectedClause].citation}"</p>
          <button
            onClick={() => setSelectedClause(null)}
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
