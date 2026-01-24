import { useState } from 'react'

interface JsonModalProps {
  isOpen: boolean
  onClose: () => void
  data: Record<string, unknown>
}

export default function JsonModal({ isOpen, onClose, data }: JsonModalProps) {
  const [copied, setCopied] = useState(false)

  const syntaxHighlight = (json: Record<string, unknown> | string): string => {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2)
    }

    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+/-]?\d+)?)/g,
      (match: string) => {
        let cls = 'text-orange-400'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-blue-400'
          } else {
            cls = 'text-green-400'
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-purple-400'
        } else if (/null/.test(match)) {
          cls = 'text-gray-500'
        }
        return `<span class="${cls}">${match}</span>`
      }
    )
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">JSON Details</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 text-gray-300 text-sm rounded hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <pre className="font-mono text-sm leading-relaxed">
            <code
              dangerouslySetInnerHTML={{
                __html: syntaxHighlight(data)
              }}
            />
          </pre>
        </div>

        <div className="flex justify-end px-4 py-3 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
