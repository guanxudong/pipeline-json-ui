import { useState } from 'react'

export interface FilterCondition {
  id: string
  field: string
  operator: string
  value: string
  logic: 'AND' | 'OR'
}

export interface SavedView {
  id: string
  name: string
  conditions: FilterCondition[]
}

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onApply: (conditions: FilterCondition[]) => void
  initialConditions?: FilterCondition[]
  savedViews?: SavedView[]
}

const fields = [
  'PIPELINE_ID',
  'PROJECT_TYPE',
  'STATUS',
  'CREATED_AT',
  'DURATION',
  'EXECUTOR'
]

const operators = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'IN', 'NOT IN']

export default function FilterDrawer({
  isOpen,
  onClose,
  onApply,
  initialConditions = [],
  savedViews = []
}: FilterDrawerProps) {
  const [activeTab, setActiveTab] = useState<'builder' | 'library'>('builder')
  const [conditions, setConditions] = useState<FilterCondition[]>(initialConditions)
  const [saveViewName, setSaveViewName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [copied, setCopied] = useState(false)

  const addCondition = () => {
    const newCondition: FilterCondition = {
      id: Date.now().toString(),
      field: fields[0],
      operator: '=',
      value: '',
      logic: conditions.length > 0 ? 'AND' : 'AND'
    }
    setConditions([...conditions, newCondition])
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id))
  }

  const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, ...updates } : c))
    )
  }

  const clearAll = () => {
    setConditions([])
  }

  const applyQuery = () => {
    onApply(conditions)
    onClose()
  }

  const saveView = () => {
    if (saveViewName.trim()) {
      const newView: SavedView = {
        id: Date.now().toString(),
        name: saveViewName.trim(),
        conditions: [...conditions]
      }
      console.log('Saving view:', newView)
      setSaveViewName('')
      setShowSaveDialog(false)
    }
  }

  const loadView = (view: SavedView) => {
    setConditions(view.conditions)
  }

  const generateSQL = (): string => {
    if (conditions.length === 0) return 'SELECT * FROM pipelines'

    const whereClause = conditions
      .map((c) => `${c.field} ${c.operator} '${c.value}'`)
      .join(` ${conditions[0].logic} `)

    return `SELECT * FROM pipelines WHERE ${whereClause}`
  }

  const copySQL = async () => {
    try {
      await navigator.clipboard.writeText(generateSQL())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-50">
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'builder'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Builder
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'library'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Library ({savedViews.length})
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {activeTab === 'builder' ? (
            <div className="p-4 space-y-3">
              {conditions.map((condition, index) => (
                <div key={condition.id} className="flex items-start space-x-2">
                  {index === 0 ? (
                    <div className="w-16 flex items-center">
                      <span className="text-xs text-gray-500 font-mono">WHERE</span>
                    </div>
                  ) : (
                    <div className="w-16 flex items-center">
                      <select
                        value={condition.logic}
                        onChange={(e) =>
                          updateCondition(condition.id, { logic: e.target.value as 'AND' | 'OR' })
                        }
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </select>
                    </div>
                  )}

                  <select
                    value={condition.field}
                    onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
                    className="flex-1 text-sm border border-gray-300 rounded px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {fields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>

                  <select
                    value={condition.operator}
                    onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
                    className="w-20 text-sm border border-gray-300 rounded px-2 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {operators.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                    placeholder="Value"
                    className="flex-1 text-sm border border-gray-300 rounded px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={() => removeCondition(condition.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {conditions.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No filters added. Click "Add Condition" to start building your query.
                </div>
              )}

              <button
                onClick={addCondition}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Condition</span>
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {savedViews.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No saved views yet. Save your current filter to create a library view.
                </div>
              ) : (
                savedViews.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => loadView(view)}
                    className="w-full text-left p-4 border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 text-sm mb-1">{view.name}</div>
                    <div className="text-xs text-gray-500 font-mono truncate">
                      {view.conditions.map((c) => `${c.field} ${c.operator} '${c.value}'`).join(` ${view.conditions[0]?.logic || 'AND'} `)}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 space-y-3">
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                SQL Preview
              </span>
              <button
                onClick={copySQL}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap break-all">
              {generateSQL()}
            </pre>
          </div>

          <div className="flex space-x-2">
            {activeTab === 'builder' && (
              <button
                onClick={clearAll}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
            )}
            {activeTab === 'builder' && (
              <button
                onClick={() => setShowSaveDialog(true)}
                disabled={conditions.length === 0}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save View
              </button>
            )}
            <button
              onClick={applyQuery}
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Apply Query
            </button>
          </div>
        </div>

        {showSaveDialog && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Save Current View</h3>
              <button
                onClick={() => {
                  setShowSaveDialog(false)
                  setSaveViewName('')
                }}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Name
              </label>
              <input
                type="text"
                value={saveViewName}
                onChange={(e) => setSaveViewName(e.target.value)}
                placeholder="e.g., Failed Pipelines Last 24h"
                className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
            <div className="flex space-x-2 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowSaveDialog(false)
                  setSaveViewName('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveView}
                disabled={!saveViewName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
