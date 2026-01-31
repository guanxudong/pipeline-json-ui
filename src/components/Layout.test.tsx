import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Layout, { ActiveFilterBar } from './Layout'
import type { FilterCondition, SavedView } from '../types'

describe('Layout', () => {
  const mockSavedViews: SavedView[] = [
    {
      id: 'view-1',
      name: 'Failed Pipelines',
      conditions: [
        { id: 'cond-1', field: 'STATUS', operator: '=', value: 'failed', logic: 'AND' },
      ],
    },
  ]

  const mockConditions: FilterCondition[] = [
    { id: 'cond-1', field: 'STATUS', operator: '=', value: 'failed', logic: 'AND' },
    { id: 'cond-2', field: 'DURATION', operator: '>', value: '300', logic: 'OR' },
  ]

  const defaultProps = {
    onFilterApply: vi.fn(),
    activeConditions: [],
    onClearFilters: vi.fn(),
    savedViews: mockSavedViews,
    onSaveView: vi.fn(),
    onDeleteView: vi.fn(),
    isLoadingViews: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderWithRouter = (component: React.ReactNode) => {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={component} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders header with logo and navigation', () => {
    renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    expect(screen.getByText('Pipeline Logs')).toBeInTheDocument()
    expect(screen.getByText('Pipelines')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('renders children content', () => {
    renderWithRouter(
      <Layout {...defaultProps}>
        <div>Test Content</div>
      </Layout>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('shows search toggle button with count when filters are active', () => {
    renderWithRouter(<Layout {...defaultProps} activeConditions={mockConditions}>Test Content</Layout>)

    const badge = screen.getByText('2')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('badge-secondary')
  })

  it('does not show badge when no active filters', () => {
    renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    expect(screen.queryByTestId('badge')).not.toBeInTheDocument()
  })

  it('toggles sidebar when Search button is clicked', () => {
    const { container } = renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    const toggleButton = screen.getByText('Search')
    expect(screen.getByText('Query Builder')).toBeInTheDocument()

    fireEvent.click(toggleButton)
    expect(container.querySelector('aside[style*="width: 0px"]')).toBeInTheDocument()

    fireEvent.click(toggleButton)
    expect(container.querySelector('aside[style*="width: 0px"]')).not.toBeInTheDocument()
  })

  it('closes sidebar on Escape key', () => {
    const { container } = renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    expect(container.querySelector('aside[style*="width: 256px"]')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(container.querySelector('aside[style*="width: 0px"]')).toBeInTheDocument()
  })

  it('highlights active route', () => {
    renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    const pipelinesLink = screen.getByText('Pipelines').closest('a')
    expect(pipelinesLink).toHaveClass('btn-active')

    const projectsLink = screen.getByText('Projects').closest('a')
    expect(projectsLink).not.toHaveClass('btn-active')
  })

  it('renders Query Builder Sidebar with correct props', () => {
    renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    expect(screen.getByText('Query Builder')).toBeInTheDocument()
    expect(screen.getByText('Library (1)')).toBeInTheDocument()
  })

  it('shows main content area', () => {
    renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    const main = document.querySelector('main')
    expect(main).toBeInTheDocument()
  })

  it('displays app logo', () => {
    renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    const logo = document.querySelector('.w-8.h-8')
    expect(logo).toBeInTheDocument()
  })

  it('has Search button with primary color', () => {
    renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    const searchButton = screen.getByText('Search').closest('button')
    expect(searchButton).toHaveClass('btn-primary')
  })

  it('rotates chevron icon when sidebar is toggled', () => {
    const { container } = renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    const chevron = container.querySelector('svg.rotate-180')
    expect(chevron).toBeInTheDocument()

    const toggleButton = screen.getByText('Search')
    fireEvent.click(toggleButton)

    const chevron2 = container.querySelector('svg.rotate-180')
    expect(chevron2).not.toBeInTheDocument()
  })

  it('has proper header height', () => {
    renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    const header = document.querySelector('header')
    expect(header).toHaveClass('h-14')
  })

  it('has responsive padding in header', () => {
    renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    const header = document.querySelector('header')
    expect(header).toHaveClass('px-4')
  })

  it('shows navigation links as pills', () => {
    renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    const navLinks = screen.getAllByRole('link')
    expect(navLinks.length).toBeGreaterThanOrEqual(2)
  })

  it('does not show Query Builder when sidebar is closed', () => {
    const { container } = renderWithRouter(<Layout {...defaultProps}>Test Content</Layout>)

    const toggleButton = screen.getByText('Search')
    fireEvent.click(toggleButton)

    expect(container.querySelector('aside[style*="width: 0px"]')).toBeInTheDocument()
  })
})

describe('ActiveFilterBar', () => {
  const mockConditions: FilterCondition[] = [
    { id: 'cond-1', field: 'STATUS', operator: '=', value: 'failed', logic: 'AND' },
    { id: 'cond-2', field: 'DURATION', operator: '>', value: '300', logic: 'AND' },
  ]

  it('renders when conditions are provided', () => {
    render(
      <ActiveFilterBar
        conditions={mockConditions}
        onClear={vi.fn()}
      />
    )

    expect(screen.getByText('Active Filters:')).toBeInTheDocument()
    expect(screen.getByText('STATUS')).toBeInTheDocument()
    expect(screen.getByText('DURATION')).toBeInTheDocument()
  })

  it('does not render when conditions are empty', () => {
    render(
      <ActiveFilterBar
        conditions={[]}
        onClear={vi.fn()}
      />
    )

    expect(screen.queryByText('Active Filters:')).not.toBeInTheDocument()
  })

  it('displays condition values correctly', () => {
    render(
      <ActiveFilterBar
        conditions={mockConditions}
        onClear={vi.fn()}
      />
    )

    expect(screen.getByText("'failed'")).toBeInTheDocument()
    expect(screen.getByText("'300'")).toBeInTheDocument()
  })

  it('displays logic operator for conditions', () => {
    render(
      <ActiveFilterBar
        conditions={mockConditions}
        onClear={vi.fn()}
      />
    )

    expect(screen.getByText('AND')).toBeInTheDocument()
  })

  it('calls onClear when Clear all button is clicked', () => {
    const onClear = vi.fn()
    render(
      <ActiveFilterBar
        conditions={mockConditions}
        onClear={onClear}
      />
    )

    const clearButton = screen.getByText('Clear all')
    fireEvent.click(clearButton)

    expect(onClear).toHaveBeenCalled()
  })

  it('calls onRemoveCondition when remove button is clicked', () => {
    const onRemoveCondition = vi.fn()
    render(
      <ActiveFilterBar
        conditions={mockConditions}
        onClear={vi.fn()}
        onRemoveCondition={onRemoveCondition}
      />
    )

    const removeButtons = screen.getAllByRole('button').filter(btn =>
      btn.querySelector('svg[stroke="currentColor"]')
    )
    fireEvent.click(removeButtons[0])

    expect(onRemoveCondition).toHaveBeenCalledWith('cond-1')
  })

  it('does not show remove buttons when onRemoveCondition is not provided', () => {
    render(
      <ActiveFilterBar
        conditions={mockConditions}
        onClear={vi.fn()}
      />
    )

    const removeButtons = screen.getAllByRole('button').filter(btn =>
      btn.querySelector('svg[stroke="currentColor"]')
    )
    expect(removeButtons).toHaveLength(1)
  })

  it('displays conditions with monospace font', () => {
    render(
      <ActiveFilterBar
        conditions={mockConditions}
        onClear={vi.fn()}
      />
    )

    const field1 = screen.getByText('STATUS')
    expect(field1).toHaveClass('font-mono')

    const value1 = screen.getByText("'failed'")
    expect(value1).toHaveClass('font-mono')
  })

  it('wraps conditions in badges', () => {
    render(
      <ActiveFilterBar
        conditions={mockConditions}
        onClear={vi.fn()}
      />
    )

    const badges = document.querySelectorAll('.badge')
    expect(badges.length).toBeGreaterThan(0)
  })
})
