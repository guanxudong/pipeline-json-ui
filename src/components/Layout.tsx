import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
  onFilterToggle?: () => void
}

export default function Layout({ children, onFilterToggle }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Pipelines' },
    { path: '/projects', label: 'Projects' }
  ]

  const getBreadcrumbs = () => {
    const pathParts = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ label: 'Home', path: '/' }]
    
    if (pathParts.length > 0) {
      const currentPage = navItems.find((item) => item.path === location.pathname)
      if (currentPage) {
        breadcrumbs.push({ label: currentPage.label, path: currentPage.path })
      }
    }
    
    return breadcrumbs
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-20 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {sidebarOpen && <span className="font-semibold text-gray-900">Pipeline Logs</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-4 h-4 text-gray-600"
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
        </div>
        <nav className="mt-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2.5 mx-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
            <nav className="flex items-center space-x-2 text-sm">
              {getBreadcrumbs().map((crumb, index) => (
                <div key={crumb.path} className="flex items-center">
                  {index > 0 && (
                    <svg className="w-4 h-4 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  <Link
                    to={crumb.path}
                    className={`${
                      index === getBreadcrumbs().length - 1
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
          {onFilterToggle && (
            <button
              onClick={onFilterToggle}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter</span>
            </button>
          )}
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
