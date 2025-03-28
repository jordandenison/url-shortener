import { useLocation, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

import { ThemePicker } from '../ThemePicker'

import type { User } from '../../models/User'

interface Props {
  currentThemeType: string
  logout: () => void

  currentUser?: User
}

export const HeaderView = ({ currentUser, currentThemeType, logout }: Props) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <Navbar bg={currentThemeType} variant={currentThemeType} fixed="top">
      <Container>
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Url Shortener
        </Navbar.Brand>

        <div className="ms-auto d-flex align-items-center gap-3">
          <ThemePicker />
          {currentUser && (
            <NavDropdown title={currentUser.username}>
              <NavDropdown.Item active={pathname === '/dashboard'} onClick={() => navigate('/dashboard')}>
                Dashboard
              </NavDropdown.Item>
              <NavDropdown.Item active={pathname === '/subscription'} onClick={() => navigate('/subscription')}>
                Subscribe
              </NavDropdown.Item>
              <NavDropdown.Item active={pathname === '/subscriptions'} onClick={() => navigate('/subscriptions')}>
                Subscriptions
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item active={pathname === '/settings'} onClick={() => navigate('/settings')}>
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          )}
        </div>
      </Container>
    </Navbar>
  )
}
