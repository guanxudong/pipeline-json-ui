import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './Pagination'

describe('Pagination', () => {
  const defaultProps = {
    totalItems: 100,
    itemsPerPage: 10,
    currentPage: 1,
    onPageChange: vi.fn(),
    onRowsPerPageChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders pagination with correct info', () => {
    render(<Pagination {...defaultProps} />)

    expect(screen.getByText('Rows per page:')).toBeInTheDocument()
    expect(screen.getByText('1 - 10 of 100')).toBeInTheDocument()
  })

  it('displays correct row range', () => {
    const { rerender } = render(<Pagination {...defaultProps} currentPage={1} />)
    expect(screen.getByText('1 - 10 of 100')).toBeInTheDocument()

    rerender(<Pagination {...defaultProps} currentPage={2} />)
    expect(screen.getByText('11 - 20 of 100')).toBeInTheDocument()

    rerender(<Pagination {...defaultProps} currentPage={10} itemsPerPage={10} />)
    expect(screen.getByText('91 - 100 of 100')).toBeInTheDocument()
  })

  it('calls onPageChange when clicking page numbers', () => {
    render(<Pagination {...defaultProps} totalItems={50} itemsPerPage={10} />)

    const page2Button = screen.getByText('2')
    fireEvent.click(page2Button)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2)
  })

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} />)

    const prevButton = screen.getByText('«').closest('button')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} totalItems={10} currentPage={1} />)

    const nextButton = screen.getByText('»').closest('button')
    expect(nextButton).toBeDisabled()
  })

  it('calls onPageChange with previous page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)

    const prevButton = screen.getByText('«').closest('button')
    fireEvent.click(prevButton!)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with next page', () => {
    render(<Pagination {...defaultProps} totalItems={50} />)

    const nextButton = screen.getByText('»').closest('button')
    fireEvent.click(nextButton!)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2)
  })

  it('handles small total pages (<= 5)', () => {
    render(<Pagination {...defaultProps} totalItems={30} itemsPerPage={10} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('handles middle pages', () => {
    render(<Pagination {...defaultProps} totalItems={100} currentPage={5} />)

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('handles end pages', () => {
    render(<Pagination {...defaultProps} totalItems={100} currentPage={10} />)

    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    const page10Buttons = screen.getAllByText('10')
    expect(page10Buttons.some(btn => btn.classList.contains('join-item'))).toBe(true)
  })

  it('calls onRowsPerPageChange when changing rows per page', () => {
    render(<Pagination {...defaultProps} />)

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '25' } })

    expect(defaultProps.onRowsPerPageChange).toHaveBeenCalledWith(25)
  })

  it('displays current page as active', () => {
    render(<Pagination {...defaultProps} totalItems={50} currentPage={2} />)

    const page2Button = screen.getByText('2').closest('button')
    expect(page2Button).toHaveClass('btn-active')
  })

  it('handles single page', () => {
    render(<Pagination {...defaultProps} totalItems={5} itemsPerPage={10} />)

    expect(screen.getByText('1 - 5 of 5')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('handles changing rows per page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '25' } })
    expect(defaultProps.onRowsPerPageChange).toHaveBeenCalledWith(25)
  })
})
