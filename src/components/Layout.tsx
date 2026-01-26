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
    <div className="flex min-h-screen bg-base-100">
      <div className={`flex-1 flex flex-col transition-all duration-300 ${rightSidebarOpen ? 'mr-64' : 'mr-0'}`}>
        <header className="h-14 bg-base-100 border-b border-base-300 flex items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-semibold">Pipeline Logs</span>
            </div>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`btn btn-sm btn-ghost ${
                    location.pathname === item.path
                      ? 'btn-active'
                      : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="btn btn-sm btn-primary gap-1"
            title="Toggle Sidebar"
          >
            <span className="text-sm">Search</span>
            <svg
              className={`w-4 h-4 transition-transform ${
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
        className={`fixed right-0 top-0 h-full bg-base-100 border-l border-base-300 transition-all duration-300 z-20 flex flex-col ${
          rightSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-base-300">
          <h2 className="font-semibold">Query Builder</h2>
        </div>

        <div className="tabs tabs-boxed flex-col border-b border-base-300">
          <button
            onClick={() => setActiveTab('builder')}
            className={`tab tab-sm ${activeTab === 'builder' ? 'tab-active' : ''}`}
          >
            Builder
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`tab tab-sm ${activeTab === 'library' ? 'tab-active' : ''}`}
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
                      <span className="text-xs text-base-content/50 font-mono">WHERE</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <select
                        value={condition.logic}
                        onChange={(e) =>
                          updateCondition(condition.id, { logic: e.target.value as 'AND' | 'OR' })
                        }
                        className="select select-bordered select-xs w-full"
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
                      className="select select-bordered select-xs font-mono"
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
                      className="select select-bordered select-xs font-mono"
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
                        className="input input-bordered input-xs w-full font-mono"
                      />
                      <button
                        onClick={() => removeCondition(condition.id)}
                        className="btn btn-ghost btn-xs btn-circle ml-1"
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
                <div className="text-center py-6 text-base-content/50 text-xs">
                  No filters added. Click "Add Condition" to start building your query.
                </div>
              )}

              <button
                onClick={addCondition}
                className="btn btn-outline btn-sm w-full gap-1"
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
                <div className="text-center py-6 text-base-content/50 text-xs">
                  No saved views yet.
                </div>
              ) : (
                savedViews.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => loadView(view)}
                    className="btn btn-outline btn-sm w-full text-left h-auto py-2"
                  >
                    <div className="text-left w-full">
                      <div className="font-semibold text-xs mb-1">{view.name}</div>
                      <div className="text-xs text-base-content/50 font-mono truncate">
                        {view.conditions.map((c) => `${c.field} ${c.operator} '${c.value}'`).join(` ${view.conditions[0]?.logic || 'AND'} `)}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="border-t border-base-300 p-3 space-y-2">
          <div className="bg-base-200 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold uppercase">
                SQL Preview
              </span>
              <button
                onClick={copySQL}
                className="text-xs text-primary font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-xs font-mono whitespace-pre-wrap break-all">
              {generateSQL()}
            </pre>
          </div>

          <div className="flex gap-1">
            {activeTab === 'builder' && (
              <button
                onClick={clearAll}
                className="btn btn-sm flex-1"
              >
                Clear All
              </button>
            )}
            <button
              onClick={applyQuery}
              className="btn btn-sm btn-primary flex-1"
            >
              Apply Query
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}