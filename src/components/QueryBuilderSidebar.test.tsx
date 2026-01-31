import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import QueryBuilderSidebar from './QueryBuilderSidebar'
import type { SavedView } from '../types'

const mockSavedViews: SavedView[] = [
  {
    id: 'view-1',
    name: 'Failed Pipelines',
    conditions: [
      { id: 'cond-1', field: 'STATUS', operator: '=', value: 'failed', logic: 'AND' },
    ],
  },
  {
    id: 'view-2',
    name: 'Long Running',
    conditions: [
      { id: 'cond-1', field: 'DURATION', operator: '>', value: '300', logic: 'AND' },
    ],
  },
]

describe('QueryBuilderSidebar', () => {
  const defaultProps = {
    isOpen: true,
    savedViews: mockSavedViews,
    onFilterApply: vi.fn(),
    onClearFilters: vi.fn(),
    onSaveView: vi.fn(),
    onDeleteView: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('renders when isOpen is true', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    expect(screen.getByText('Query Builder')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    const { container } = render(<QueryBuilderSidebar {...defaultProps} isOpen={false} />)

    expect(container.querySelector('aside[style*="width: 0px"]')).toBeInTheDocument()
  })

  it('displays builder tab by default', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    expect(screen.getByText('Builder')).toHaveClass('tab-active')
    expect(screen.getByText((content) => content.includes('Library'))).not.toHaveClass('tab-active')
  })

  it('switches to library tab when clicked', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText((content) => content.includes('Library')))

    expect(screen.getByText((content) => content.includes('Library'))).toHaveClass('tab-active')
    expect(screen.getByText('Builder')).not.toHaveClass('tab-active')
  })

  it('displays saved views count', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    expect(screen.getByText('Library (2)')).toBeInTheDocument()
  })

  it('shows empty state when no conditions', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    expect(screen.getByText('No filters added.')).toBeInTheDocument()
  })

  it('shows quick start templates when no conditions', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    expect(screen.getByText('Failed Pipelines')).toBeInTheDocument()
    expect(screen.getByText('Long Running (>5min)')).toBeInTheDocument()
    expect(screen.getByText('GitLab CI Only')).toBeInTheDocument()
  })

  it('adds condition when template is clicked', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    const templateButton = screen.getByText('Failed Pipelines')
    fireEvent.click(templateButton)

    expect(screen.getByDisplayValue('failed')).toBeInTheDocument()
  })

  it('adds condition when Add Condition button is clicked', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    const addButton = screen.getByText('Add Condition')
    fireEvent.click(addButton)

    expect(screen.getByDisplayValue('PIPELINE_ID')).toBeInTheDocument()
  })

  it('removes condition when remove button is clicked', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    const removeButton = screen.getAllByRole('button').find(btn =>
      btn.querySelector('svg path[d="M6 18L18 6M6 6l12 12"]')
    )!
    fireEvent.click(removeButton)

    expect(screen.queryByDisplayValue('STATUS')).not.toBeInTheDocument()
  })

  it('updates condition field', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    const fieldSelect = screen.getByDisplayValue('STATUS')
    fireEvent.change(fieldSelect, { target: { value: 'PROJECT_TYPE' } })

    expect(screen.getByDisplayValue('PROJECT_TYPE')).toBeInTheDocument()
  })

  it('updates condition operator', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    const operatorSelect = screen.getByDisplayValue('=')
    fireEvent.change(operatorSelect, { target: { value: '!=' } })

    expect(screen.getByDisplayValue('!=')).toBeInTheDocument()
  })

  it('updates condition value', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    const valueInput = screen.getByDisplayValue('failed')
    fireEvent.change(valueInput, { target: { value: 'success' } })

    expect(screen.getByDisplayValue('success')).toBeInTheDocument()
  })

  it('shows warning when condition value is empty', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Add Condition'))
    const valueInput = screen.getByPlaceholderText('Value')

    expect(valueInput).toHaveClass('input-warning')
  })

  it('generates SQL preview', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))

    expect(screen.getByText(/SELECT \* FROM pipelines/)).toBeInTheDocument()
    expect(screen.getByText(/STATUS = 'failed'/)).toBeInTheDocument()
  })

  it('copies SQL to clipboard', async () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    const copyButton = screen.getByText('Copy')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument()
    })
  })

  it('calls onFilterApply when Apply Query is clicked', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    const applyButton = screen.getByText('Apply Query')
    fireEvent.click(applyButton)

    expect(defaultProps.onFilterApply).toHaveBeenCalled()
  })

  it('calls onClearFilters when Clear All is clicked', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    const clearButton = screen.getByText('Clear All')
    fireEvent.click(clearButton)

    expect(defaultProps.onClearFilters).toHaveBeenCalled()
  })

  it('shows save as view button when conditions exist', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    expect(screen.getByText('Save as View')).toBeInTheDocument()
  })

  it('opens save modal when Save as View is clicked', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    fireEvent.click(screen.getByText('Save as View'))

    expect(screen.getByPlaceholderText('Enter view name...')).toBeInTheDocument()
  })

  it('saves view with name', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    fireEvent.click(screen.getByText('Save as View'))

    const nameInput = screen.getByPlaceholderText('Enter view name...')
    fireEvent.change(nameInput, { target: { value: 'My Custom View' } })

    const saveButton = screen.getByRole('button', { name: 'Save' })
    fireEvent.click(saveButton)

    expect(defaultProps.onSaveView).toHaveBeenCalledWith('My Custom View', expect.any(Array))
  })

  it('cancels save view', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    fireEvent.click(screen.getByText('Save as View'))

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)

    expect(screen.queryByPlaceholderText('Enter view name...')).not.toBeInTheDocument()
  })

  it('disables save button when view name is empty', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    fireEvent.click(screen.getByText('Save as View'))

    const saveButton = screen.getByRole('button', { name: 'Save' })
    expect(saveButton).toBeDisabled()
  })

  it('displays saved views in library tab', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText((content) => content.includes('Library')))

    expect(screen.getByText('Failed Pipelines', { selector: '.font-semibold' })).toBeInTheDocument()
    expect(screen.getByText('Long Running', { selector: '.font-semibold' })).toBeInTheDocument()
  })

  it('loads saved view when clicked', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText((content) => content.includes('Library')))
    const viewButton = screen.getByText('Failed Pipelines').closest('button')
    fireEvent.click(viewButton!)

    const builderTab = document.querySelector('.tab-active')
    expect(builderTab?.textContent).toContain('Builder')
  })

  it('deletes saved view', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText((content) => content.includes('Library')))

    const deleteButton = document.querySelector('button svg path[d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7"]')?.closest('button')
    if (deleteButton) {
      fireEvent.click(deleteButton)
      expect(defaultProps.onDeleteView).toHaveBeenCalledWith('view-1')
    }
  })

  it('shows loading state in library', () => {
    render(<QueryBuilderSidebar {...defaultProps} isLoadingViews={true} />)

    fireEvent.click(screen.getByText((content) => content.includes('Library')))

    expect(screen.getByText('', { selector: '.loading-spinner' })).toBeInTheDocument()
  })

  it('shows empty state when no saved views', () => {
    render(<QueryBuilderSidebar {...defaultProps} savedViews={[]} />)

    const libraryTab = screen.getByText((content) => content.includes('Library'))
    fireEvent.click(libraryTab)

    expect(screen.queryByText('No saved views yet.')).toBeInTheDocument()
  })

  it('updates logic operator for second condition', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    fireEvent.click(screen.getByText('Add Condition'))

    const logicSelect = screen.getByDisplayValue('AND')
    fireEvent.change(logicSelect, { target: { value: 'OR' } })

    expect(screen.getByDisplayValue('OR')).toBeInTheDocument()
  })

  it('displays WHERE clause for first condition', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))

    expect(screen.getByText('WHERE')).toBeInTheDocument()
  })

  it('expands SQL preview by default', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))

    expect(screen.getByText(/SELECT \* FROM pipelines/)).toBeVisible()
  })

  it('collapses SQL preview when clicked', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    const expandButton = screen.getByText('SQL Preview').closest('button')
    fireEvent.click(expandButton!)

    expect(screen.queryByText(/SELECT \* FROM pipelines/)).not.toBeInTheDocument()
  })

  it('shows SQL Preview header', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    expect(screen.getByText('SQL Preview')).toBeInTheDocument()
  })

  it('shows Ctrl+Enter hint', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    expect(screen.getByText('Ctrl+Enter to apply')).toBeInTheDocument()
  })

  it('disables Apply Query when conditions have empty values', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Add Condition'))

    const applyButton = screen.getByText('Apply Query')
    expect(applyButton).toBeDisabled()
  })

  it('shows alert for empty values', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Add Condition'))

    expect(screen.getByText('Please fill in all values')).toBeInTheDocument()
  })

  it('handles multiple conditions', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    fireEvent.click(screen.getByText('Add Condition'))

    expect(screen.getByDisplayValue('STATUS')).toBeInTheDocument()
    expect(screen.getByDisplayValue('PIPELINE_ID')).toBeInTheDocument()
  })

  it('resets conditions when Clear All is clicked', () => {
    render(<QueryBuilderSidebar {...defaultProps} />)

    fireEvent.click(screen.getByText('Failed Pipelines'))
    fireEvent.click(screen.getByText('Clear All'))

    expect(screen.getByText('No filters added.')).toBeInTheDocument()
  })
})
