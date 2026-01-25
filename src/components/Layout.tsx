import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { FilterCondition, SavedView } from '../types'

interface LayoutProps {
  children: React.ReactNode
  onFilterApply?: (conditions: FilterCondition[]) => void
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

export default function Layout({ children, onFilterApply }: LayoutProps) {
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'builder' | 'library'>('builder')
  const [conditions, setConditions] = useState<FilterCondition[]>([])
  const [copied, setCopied] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Pipelines' },
    { path: '/projects', label: 'Projects' }
  ]

  const savedViews: SavedView[] = [
    {
      id: 'view-1',
      name: 'Failed Pipelines',
      conditions: [
        { id: '1', field: 'STATUS', operator: '=', value: 'failed', logic: 'AND' }
      ]
    },
    {
      id: 'view-2',
      name: 'Running or Pending',
      conditions: [
        { id: '1', field: 'STATUS', operator: '=', value: 'running', logic: 'OR' },
        { id: '2', field: 'STATUS', operator: '=', value: 'pending', logic: 'OR' }
      ]
    }
  ]

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
    onFilterApply?.(conditions)
  }

  const loadView = (view: SavedView) => {
    setConditions(view.conditions)
    setActiveTab('builder')
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

  return (
    <div className="flex min-h-screen bg-white">
      <div className={`flex-1 flex flex-col transition-all duration-300 ${rightSidebarOpen ? 'mr-64' : 'mr-0'}`}>
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">Pipeline Logs</span>
            </div>
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="flex items-center space-x-1 p-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            title="Toggle Sidebar"
          >
            <span className="text-sm">Search</span>
            <svg
              className={`w-5 h-5 transition-transform ${
                rightSidebarOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      <aside
        className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 transition-all duration-300 z-20 flex flex-col ${
          rightSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Query Builder</h2>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'builder'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Builder
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
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
            <div className="p-3 space-y-2">
              {conditions.map((condition, index) => (
                <div key={condition.id} className="space-y-1">
                  {index === 0 ? (
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 font-mono">WHERE</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
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

                  <div className="grid grid-cols-3 gap-1">
                    <select
                      value={condition.field}
                      onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
                      className="text-xs border border-gray-300 rounded px-2 py-1.5 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="text-xs border border-gray-300 rounded px-2 py-1.5 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {operators.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center">
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                        placeholder="Value"
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeCondition(condition.id)}
                        className="ml-1 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {conditions.length === 0 && (
                <div className="text-center py-6 text-gray-500 text-xs">
                  No filters added. Click "Add Condition" to start building your query.
                </div>
              )}

              <button
                onClick={addCondition}
                className="w-full flex items-center justify-center space-x-1 px-2 py-1.5 border border-dashed border-gray-300 rounded text-xs text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Condition</span>
              </button>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {savedViews.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-xs">
                  No saved views yet.
                </div>
              ) : (
                savedViews.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => loadView(view)}
                    className="w-full text-left p-2 border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 text-xs mb-1">{view.name}</div>
                    <div className="text-xs text-gray-500 font-mono truncate">
                      {view.conditions.map((c) => `${c.field} ${c.operator} '${c.value}'`).join(` ${view.conditions[0]?.logic || 'AND'} `)}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-3 space-y-2">
          <div className="bg-gray-50 border border-gray-200 rounded p-2">
            <div className="flex items-center justify-between mb-1">
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

          <div className="flex space-x-1">
            {activeTab === 'builder' && (
              <button
                onClick={clearAll}
                className="flex-1 px-2 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={applyQuery}
              className="flex-1 px-2 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Apply Query
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
