import { useState, useEffect, useCallback, useRef } from 'react'
import type { FilterCondition, SavedView } from '../types'

interface QueryBuilderSidebarProps {
  isOpen: boolean
  savedViews: SavedView[]
  onFilterApply?: (conditions: FilterCondition[]) => void
  onClearFilters?: () => void
  onSaveView?: (name: string, conditions: FilterCondition[]) => void
  onDeleteView?: (viewId: string) => void
  isLoadingViews?: boolean
  onWidthChange?: (width: number) => void
  onResizing?: (isResizing: boolean) => void
  onLibraryTabOpen?: () => void
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

const quickStartTemplates = [
  {
    name: 'Failed Pipelines',
    condition: { field: 'STATUS', operator: '=', value: 'failed', logic: 'AND' as const }
  },
  {
    name: 'Long Running (>5min)',
    condition: { field: 'DURATION', operator: '>', value: '300', logic: 'AND' as const }
  },
  {
    name: 'GitLab CI Only',
    condition: { field: 'PROJECT_TYPE', operator: '=', value: 'gitlab', logic: 'AND' as const }
  }
]

let idCounter = 0
function generateId(): string {
  idCounter += 1
  return `cond-${idCounter}`
}

const MIN_SIDEBAR_WIDTH = 240
const MAX_SIDEBAR_WIDTH = 600
const DEFAULT_SIDEBAR_WIDTH = 256

// Component for individual saved view item with truncation detection
interface SavedViewItemProps {
  view: SavedView
  onLoad: () => void
  onDelete: (e: React.MouseEvent) => void
}

function SavedViewItem({ view, onLoad, onDelete }: SavedViewItemProps) {
  const textRef = useRef<HTMLDivElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth)
      }
    }
    
    // Check immediately
    checkTruncation()
    
    // Use ResizeObserver to detect element size changes (e.g., when sidebar resizes)
    const observer = new ResizeObserver(checkTruncation)
    if (textRef.current) {
      observer.observe(textRef.current)
    }
    
    return () => observer.disconnect()
  }, [view.conditions])

  return (
    <div className="group relative">
      <button
        onClick={onLoad}
        className="btn btn-outline btn-sm w-full text-left h-auto py-2 pr-8"
      >
        <div className="text-left w-full">
          <div className="font-semibold text-xs mb-1">{view.name}</div>
          <div className="relative">
            <div ref={textRef} className="text-xs text-base-content/50 font-mono truncate">
              {view.conditions.map((c) => `${c.field} ${c.operator} '${c.value}'`).join(` ${view.conditions[0]?.logic || 'AND'} `)}
            </div>
            {/* Tooltip - only show if truncated */}
            {isTruncated && (
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50 w-72">
                <div className="bg-base-300 text-base-content text-xs p-3 rounded-lg shadow-xl border border-base-200">
                  <div className="font-semibold mb-2 text-base-content/80">Query Conditions</div>
                  <div className="font-mono whitespace-pre-wrap break-all leading-relaxed">
                    {view.conditions.map((c, idx) => (
                      <div key={idx} className="mb-1">
                        {idx === 0 && <span className="text-primary">WHERE </span>}
                        {idx > 0 && (
                          <span className="text-primary mx-1">{c.logic} </span>
                        )}
                        <span className="text-base-content">{c.field} {c.operator} '{c.value}'</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-base-200 text-base-content/50 text-[10px]">
                    Click to load in Builder
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute left-4 bottom-0 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-base-300"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </button>
      <button
        onClick={onDelete}
        className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete view"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}

export default function QueryBuilderSidebar({
  isOpen,
  savedViews,
  onFilterApply,
  onClearFilters,
  onSaveView,
  onDeleteView,
  isLoadingViews = false,
  onWidthChange,
  onResizing,
  onLibraryTabOpen
}: QueryBuilderSidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [activeTab, setActiveTab] = useState<'builder' | 'library'>('builder')
  const [conditions, setConditions] = useState<FilterCondition[]>([])
  const [copied, setCopied] = useState(false)
  const [sqlExpanded, setSqlExpanded] = useState(true)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [viewName, setViewName] = useState('')
  const conditionsRef = useRef(conditions)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const currentWidthRef = useRef(DEFAULT_SIDEBAR_WIDTH)

  useEffect(() => {
    conditionsRef.current = conditions
  }, [conditions])

  useEffect(() => {
    if (activeTab === 'library') {
      onLibraryTabOpen?.()
    }
  }, [activeTab, onLibraryTabOpen])

  const hasEmptyValues = conditions.some(c => !c.value.trim())

  const applyQuery = useCallback(() => {
    if (hasEmptyValues) return
    onFilterApply?.(conditionsRef.current)
  }, [hasEmptyValues, onFilterApply])

  const handleResizeStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    setIsResizing(true)
    onResizing?.(true)
    currentWidthRef.current = sidebarWidth
    
    document.body.classList.add('cursor-grabbing', 'select-none', 'overflow-hidden')
    if (sidebarRef.current) {
      sidebarRef.current.classList.add('will-change-transform')
    }
    
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [sidebarWidth, onResizing])

  const handleResizeMove = useCallback((e: React.PointerEvent) => {
    if (!isResizing || !sidebarRef.current) return
    
    const newWidth = window.innerWidth - e.clientX
    const clampedWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, newWidth))
    currentWidthRef.current = clampedWidth
    
    sidebarRef.current.style.width = `${clampedWidth}px`
    onWidthChange?.(clampedWidth)
  }, [isResizing, onWidthChange])

  const handleResizeEnd = useCallback(() => {
    if (!isResizing) return
    
    setSidebarWidth(currentWidthRef.current)
    onWidthChange?.(currentWidthRef.current)
    setIsResizing(false)
    onResizing?.(false)
    
    document.body.classList.remove('cursor-grabbing', 'select-none', 'overflow-hidden')
    if (sidebarRef.current) {
      sidebarRef.current.classList.remove('will-change-transform')
      sidebarRef.current.style.width = ''
    }
  }, [isResizing, onWidthChange, onResizing])

  const addCondition = () => {
    const newCondition: FilterCondition = {
      id: generateId(),
      field: fields[0],
      operator: '=',
      value: '',
      logic: conditions.length > 0 ? 'AND' : 'AND'
    }
    setConditions([...conditions, newCondition])
  }

  const addTemplateCondition = (template: typeof quickStartTemplates[0]) => {
    const newCondition: FilterCondition = {
      id: generateId(),
      ...template.condition
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
    onClearFilters?.()
  }

  const loadView = (view: SavedView) => {
    setConditions(view.conditions.map(c => ({ ...c, id: generateId() })))
    setActiveTab('builder')
  }

  const deleteView = (e: React.MouseEvent, viewId: string) => {
    e.stopPropagation()
    onDeleteView?.(viewId)
  }

  const saveView = () => {
    if (!viewName.trim() || conditions.length === 0) return
    
    const conditionsToSave = conditions.map(c => ({ ...c, id: generateId() }))
    onSaveView?.(viewName.trim(), conditionsToSave)
    setViewName('')
    setSaveModalOpen(false)
    setActiveTab('library')
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
    <aside
      ref={sidebarRef}
      className={`fixed right-0 top-0 h-full bg-base-100 border-l border-base-300 z-20 flex flex-col overflow-hidden ${
        isOpen ? '' : 'w-0'
      } ${isResizing ? '' : 'transition-all duration-300'}`}
      style={{ width: isOpen ? sidebarWidth : 0 }}
    >
      <div
        className={`resize-handle ${isResizing ? 'active' : ''}`}
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
        onPointerLeave={handleResizeEnd}
        title="Drag to resize"
      />
      
      <div className="flex items-center justify-between px-4 h-14 border-b border-base-300 pl-6">
        <h2 className="font-semibold">Query Builder</h2>
        <span className="text-xs text-base-content/50">Ctrl+Enter to apply</span>
      </div>

      <div className="tabs tabs-boxed border-b border-base-300 bg-base-200/50 p-1">
        <button
          onClick={() => setActiveTab('builder')}
          className={`tab tab-sm flex-1 ${activeTab === 'builder' ? 'tab-active bg-primary text-primary-content' : 'hover:bg-base-300'}`}
        >
          Builder
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`tab tab-sm flex-1 ${activeTab === 'library' ? 'tab-active bg-primary text-primary-content' : 'hover:bg-base-300'}`}
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
                      className={`input input-bordered input-xs w-full font-mono ${!condition.value.trim() ? 'input-warning' : ''}`}
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
              <div className="text-center py-4 text-base-content/50 text-xs space-y-3">
                <p>No filters added.</p>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wide font-semibold">Quick Start</p>
                  {quickStartTemplates.map((template) => (
                    <button
                      key={template.name}
                      onClick={() => addTemplateCondition(template)}
                      className="btn btn-outline btn-xs w-full gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>{template.name}</span>
                    </button>
                  ))}
                </div>
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

            {conditions.length > 0 && !saveModalOpen && (
              <button
                onClick={() => setSaveModalOpen(true)}
                className="btn btn-outline btn-sm w-full gap-1 btn-secondary"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Save as View</span>
              </button>
            )}

            {saveModalOpen && (
              <div className="space-y-2 p-2 bg-base-200 rounded">
                <input
                  type="text"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  placeholder="Enter view name..."
                  className="input input-bordered input-sm w-full"
                  autoFocus
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => setSaveModalOpen(false)}
                    className="btn btn-sm flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveView}
                    disabled={!viewName.trim()}
                    className="btn btn-sm btn-secondary flex-1"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {isLoadingViews ? (
              <div className="flex items-center justify-center py-6">
                <div className="loading loading-spinner loading-sm"></div>
              </div>
            ) : savedViews.length === 0 ? (
              <div className="text-center py-6 text-base-content/50 text-xs">
                No saved views yet.
              </div>
            ) : (
              savedViews.map((view) => <SavedViewItem key={view.id} view={view} onLoad={() => loadView(view)} onDelete={(e) => deleteView(e, view.id)} />)
            )}
          </div>
        )}
      </div>

      <div className="border-t border-base-300 p-3 space-y-2">
        <div className="bg-base-200 rounded p-2">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={() => setSqlExpanded(!sqlExpanded)}
              className="flex items-center gap-1 text-xs font-semibold uppercase hover:text-primary transition-colors"
            >
              <svg 
                className={`w-3 h-3 transition-transform ${sqlExpanded ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              SQL Preview
            </button>
            {sqlExpanded && (
              <button
                onClick={copySQL}
                className="text-xs text-primary font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          {sqlExpanded && (
            <pre className="text-xs font-mono whitespace-pre-wrap break-all">
              {generateSQL()}
            </pre>
          )}
        </div>

        {hasEmptyValues && (
          <div className="alert alert-warning alert-xs py-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs">Please fill in all values</span>
          </div>
        )}

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
            disabled={hasEmptyValues}
            className="btn btn-sm btn-primary flex-1"
          >
            Apply Query
          </button>
        </div>
      </div>
    </aside>
  )
}
