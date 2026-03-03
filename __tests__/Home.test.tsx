import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the FlightSelector component as it might have complex logic/hooks
jest.mock('../components/flight-selector', () => ({
  FlightSelector: () => <div data-testid="flight-selector">Mocked Flight Selector</div>,
}))

describe('Home Page', () => {
  it('renders the title correctly', () => {
    render(<Home />)
    expect(screen.getByText(/Flight Calendar/i)).toBeInTheDocument()
  })

  it('renders the subtitle correctly', () => {
    render(<Home />)
    expect(screen.getByText(/Redefining Travel Planning/i)).toBeInTheDocument()
  })

  it('renders the flight selector component', () => {
    render(<Home />)
    expect(screen.getByTestId('flight-selector')).toBeInTheDocument()
  })
})
