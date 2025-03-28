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
              <NavDropdown.Item active={pathname === '/'} onClick={() => navigate('/')}>
                Dashboard
              </NavDropdown.Item>
              <NavDropdown.Item active={pathname === '/add'} onClick={() => navigate('/add')}>
                Add Url
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
