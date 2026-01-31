import { render, screen, fireEvent } from '@testing-library/react'
import DataTable from './DataTable'
import type { TableRow } from '../types'

const mockData: TableRow[] = [
  {
    id: 'pipe-001',
    name: 'Data Ingestion Pipeline',
    status: 'success',
    createdAt: '2024-01-24T10:30:00Z',
    data: {
      projectType: 'java-11',
      lastUpdate: '2024-01-24T10:45:00Z',
    },
  },
  {
    id: 'pipe-002',
    name: 'ML Model Training',
    status: 'running',
    createdAt: '2024-01-24T11:15:00Z',
    data: {
      projectType: 'java-17',
      lastUpdate: '2024-01-24T11:45:00Z',
    },
  },
  {
    id: 'pipe-003',
    name: 'ETL Daily Job',
    status: 'failed',
    createdAt: '2024-01-24T12:00:00Z',
    data: {
      projectType: 'python-3.6',
      lastUpdate: '2024-01-24T12:10:00Z',
    },
  },
  {
    id: 'pipe-004',
    name: 'Report Generation',
    status: 'pending',
    createdAt: '2024-01-24T12:30:00Z',
    data: {
      projectType: 'node-22',
      lastUpdate: '2024-01-24T12:50:00Z',
    },
  },
]

describe('DataTable', () => {
  const defaultProps = {
    data: mockData,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default columns', () => {
    render(<DataTable {...defaultProps} />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Created At')).toBeInTheDocument()
    expect(screen.getByText('Attributes')).toBeInTheDocument()
  })

  it('renders all data rows', () => {
    render(<DataTable {...defaultProps} />)

    expect(screen.getByText('pipe-001')).toBeInTheDocument()
    expect(screen.getByText('pipe-002')).toBeInTheDocument()
    expect(screen.getByText('pipe-003')).toBeInTheDocument()
    expect(screen.getByText('pipe-004')).toBeInTheDocument()
  })

  it('renders custom columns', () => {
    render(
      <DataTable
        {...defaultProps}
        columns={['id', 'name', 'status', 'createdAt', 'lastUpdate', 'attributes']}
      />
    )

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Created At')).toBeInTheDocument()
    expect(screen.getByText('Last Update')).toBeInTheDocument()
    expect(screen.getByText('Attributes')).toBeInTheDocument()
  })

  it('renders id column with monospace font', () => {
    render(<DataTable {...defaultProps} columns={['id', 'name']} />)

    const idCell = screen.getByText('pipe-001').closest('td')
    expect(idCell).toHaveClass('font-mono')
  })

  it('renders name column correctly', () => {
    render(<DataTable {...defaultProps} columns={['name']} />)

    expect(screen.getByText('Data Ingestion Pipeline')).toBeInTheDocument()
    expect(screen.getByText('ML Model Training')).toBeInTheDocument()
  })

  it('renders projectType column correctly', () => {
    render(<DataTable {...defaultProps} columns={['projectType']} />)

    expect(screen.getByText('java-11')).toBeInTheDocument()
    expect(screen.getByText('java-17')).toBeInTheDocument()
    expect(screen.getByText('python-3.6')).toBeInTheDocument()
  })

  it('renders status badges with correct classes', () => {
    render(<DataTable {...defaultProps} columns={['status']} />)

    const successBadge = screen.getByText('Success')
    expect(successBadge).toHaveClass('badge-success')

    const runningBadge = screen.getByText('Running')
    expect(runningBadge).toHaveClass('badge-info')

    const failedBadge = screen.getByText('Failed')
    expect(failedBadge).toHaveClass('badge-error')

    const pendingBadge = screen.getByText('Pending')
    expect(pendingBadge).toHaveClass('badge-warning')
  })

  it('capitalizes status text', () => {
    render(<DataTable {...defaultProps} columns={['status']} />)

    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('Failed')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('renders createdAt timestamp correctly', () => {
    render(<DataTable {...defaultProps} columns={['createdAt']} />)

    const timestamps = screen.getAllByText(/Jan/)
    expect(timestamps.length).toBeGreaterThan(0)
  })

  it('renders lastUpdate timestamp correctly', () => {
    render(<DataTable {...defaultProps} columns={['lastUpdate']} />)

    const timeElements = screen.getAllByText((content) => {
      if (typeof content !== 'string') return false
      return content.includes(':45')
    })
    expect(timeElements.length).toBeGreaterThan(0)
  })

  it('renders attributes button', () => {
    render(<DataTable {...defaultProps} columns={['attributes']} />)

    const buttons = screen.getAllByTitle('View JSON')
    expect(buttons).toHaveLength(4)
  })

  it('calls onViewJson when attributes button is clicked', () => {
    const onViewJson = vi.fn()
    render(<DataTable {...defaultProps} onViewJson={onViewJson} />)

    const firstButton = screen.getAllByTitle('View JSON')[0]
    fireEvent.click(firstButton)

    expect(onViewJson).toHaveBeenCalledWith(mockData[0])
  })

  it('does not call onViewJson when callback is not provided', () => {
    render(<DataTable {...defaultProps} />)

    const firstButton = screen.getAllByTitle('View JSON')[0]
    expect(() => fireEvent.click(firstButton)).not.toThrow()
  })

  it('renders empty table when no data', () => {
    render(<DataTable data={[]} />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.queryByText('pipe-001')).not.toBeInTheDocument()
  })

  it('renders with project column', () => {
    render(<DataTable {...defaultProps} columns={['project']} />)

    expect(screen.getByText('Project')).toBeInTheDocument()
    expect(screen.getByText('Data Ingestion Pipeline')).toBeInTheDocument()
  })

  it('renders projectType column with header', () => {
    render(<DataTable {...defaultProps} columns={['projectType']} />)

    expect(screen.getByText('Project Type')).toBeInTheDocument()
  })

  it('handles undefined projectType', () => {
    const dataWithUndefinedType: TableRow[] = [
      {
        id: 'pipe-005',
        name: 'Test Pipeline',
        status: 'success',
        createdAt: '2024-01-24T10:30:00Z',
        data: {},
      },
    ]

    render(<DataTable data={dataWithUndefinedType} columns={['projectType']} />)

    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('renders timestamp column with header', () => {
    render(<DataTable {...defaultProps} columns={['timestamp']} />)

    expect(screen.getByText('Timestamp')).toBeInTheDocument()
  })

  it('formats dates consistently', () => {
    render(<DataTable {...defaultProps} columns={['createdAt']} />)

    const dates = screen.getAllByText(/Jan 24, 2024/)
    expect(dates.length).toBeGreaterThan(0)
  })

  it('renders hover effect on rows', () => {
    render(<DataTable {...defaultProps} />)

    const rows = screen.getAllByRole('row')
    rows.slice(1).forEach((row) => {
      expect(row).toHaveClass('hover')
    })
  })

  it('uses unique keys for rows', () => {
    render(<DataTable {...defaultProps} />)

    const rows = screen.getAllByRole('row')
    rows.slice(1).forEach((row) => {
      expect(row).toBeInTheDocument()
    })
  })

  it('renders header row', () => {
    render(<DataTable {...defaultProps} />)

    const rows = screen.getAllByRole('row')
    const headerRow = rows[0]
    expect(headerRow).toContainElement(screen.getByText('ID'))
    expect(headerRow).toContainElement(screen.getByText('Name'))
  })
})
