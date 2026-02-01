import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { FilterCondition, SavedView } from '../types'
import QueryBuilderSidebar from './QueryBuilderSidebar'

interface LayoutProps {
  children: React.ReactNode
  onFilterApply?: (conditions: FilterCondition[]) => void
  activeConditions?: FilterCondition[]
  onClearFilters?: () => void
  savedViews?: SavedView[]
  onSaveView?: (name: string, conditions: FilterCondition[]) => void
  onDeleteView?: (viewId: string) => void
  isLoadingViews?: boolean
  onLibraryTabOpen?: () => void
}

const DEFAULT_SIDEBAR_WIDTH = 256

export default function Layout({ 
  children, 
  onFilterApply, 
  activeConditions = [],
  onClearFilters,
  savedViews = [],
  onSaveView,
  onDeleteView,
  isLoadingViews = false,
  onLibraryTabOpen
}: LayoutProps) {
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const location = useLocation()
  const mainContentRef = useRef<HTMLDivElement>(null)

  const handleSidebarWidthChange = (width: number) => {
    setSidebarWidth(width)
  }

  const handleResizing = (resizing: boolean) => {
    setIsResizing(resizing)
  }

  const navItems = [
    { path: '/', label: 'Pipelines' },
    { path: '/projects', label: 'Projects' }
  ]

  const hasActiveFilters = activeConditions.length > 0

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && rightSidebarOpen) {
        setRightSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [rightSidebarOpen])

  return (
    <div className="flex min-h-screen bg-base-100">
      <div 
        ref={mainContentRef}
        className={`flex-1 flex flex-col ${isResizing ? '' : 'transition-all duration-300'}`}
        style={{ marginRight: rightSidebarOpen ? sidebarWidth : 0 }}
      >
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
            title="Toggle Sidebar (Esc)"
          >
            <span className="text-sm">Search</span>
            {hasActiveFilters && (
              <span className="badge badge-sm badge-secondary">{activeConditions.length}</span>
            )}
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

      <QueryBuilderSidebar
        isOpen={rightSidebarOpen}
        savedViews={savedViews}
        onFilterApply={onFilterApply}
        onClearFilters={onClearFilters}
        onSaveView={onSaveView}
        onDeleteView={onDeleteView}
        isLoadingViews={isLoadingViews}
        onWidthChange={handleSidebarWidthChange}
        onResizing={handleResizing}
        onLibraryTabOpen={onLibraryTabOpen}
      />
    </div>
  )
}

export function ActiveFilterBar({ 
  conditions, 
  onClear,
  onRemoveCondition 
}: { 
  conditions: FilterCondition[]
  onClear: () => void
  onRemoveCondition?: (id: string) => void
}) {
  if (conditions.length === 0) return null

  return (
    <div className="bg-base-200 border-b border-base-300 px-6 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold uppercase text-base-content/70">Active Filters:</span>
        {conditions.map((condition, index) => (
          <div key={condition.id} className="flex items-center gap-1">
            {index > 0 && (
              <span className="text-xs font-medium text-base-content/50">{condition.logic}</span>
            )}
            <div className="badge badge-sm badge-primary gap-1">
              <span className="font-mono">{condition.field}</span>
              <span className="text-primary-content/70">{condition.operator}</span>
              <span className="font-mono">'{condition.value}'</span>
              {onRemoveCondition && (
                <button
                  onClick={() => onRemoveCondition(condition.id)}
                  className="ml-1 hover:text-primary-content/70"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          onClick={onClear}
          className="btn btn-xs btn-ghost gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear all
        </button>
      </div>
    </div>
  )
}
