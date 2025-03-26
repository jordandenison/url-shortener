import { render } from '@testing-library/react'

import App from './App'

test('renders App', async () => {
  const { findByText } = render(<App />)

  expect(await findByText(/Dashboard/i)).toBeInTheDocument()
})
