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
        let cls = 'text-orange-600'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-blue-600'
          } else {
            cls = 'text-green-600'
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-purple-600'
        } else if (/null/.test(match)) {
          cls = 'text-base-content/50'
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

  const handleClose = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Attributes</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn btn-sm btn-ghost gap-1"
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
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-auto max-h-96">
          <pre className="font-mono text-sm leading-relaxed">
            <code
              dangerouslySetInnerHTML={{
                __html: syntaxHighlight(data)
              }}
            />
          </pre>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  )
}