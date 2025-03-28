import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, Button } from 'react-bootstrap'

interface AuthFormInputs {
  username: string
  password: string
  confirmPassword?: string
}

interface AuthPayload {
  username: string
  password: string
}

interface AuthFormProps {
  loading: boolean
  onLogin: (username: string, password: string) => void
  onRegister: (username: string, password: string) => void
}

export const AuthForm = ({ loading, onLogin, onRegister }: AuthFormProps) => {
  const [isRegister, setIsRegister] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<AuthFormInputs>()
  const passwordValue = watch('password')

  const onSubmit = (data: AuthFormInputs) => {
    if (isRegister) {
      onRegister(data.username, data.password)
    } else {
      onLogin(data.username, data.password)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username" {...register('username', { required: 'Username is required' })} isInvalid={!!errors.username} />
        {errors.username && <Form.Control.Feedback type="invalid">{errors.username.message}</Form.Control.Feedback>}
      </Form.Group>
      <Form.Group controlId="password" className="mt-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          {...register('password', { required: 'Password is required' })}
          isInvalid={!!errors.password}
        />
        {errors.password && <Form.Control.Feedback type="invalid">{errors.password.message}</Form.Control.Feedback>}
      </Form.Group>
      {isRegister && (
        <Form.Group controlId="confirmPassword" className="mt-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === passwordValue || 'Passwords do not match'
            })}
            isInvalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && <Form.Control.Feedback type="invalid">{errors.confirmPassword.message}</Form.Control.Feedback>}
        </Form.Group>
      )}
      <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
        {isSubmitting ? (isRegister ? 'Registering...' : 'Logging in...') : isRegister ? 'Register' : 'Login'}
      </Button>
      <div className="mt-3">
        {isRegister ? (
          <span>
            Already have an account?{' '}
            <Button variant="link" onClick={() => setIsRegister(false)} disabled={loading}>
              Login here
            </Button>
          </span>
        ) : (
          <span>
            Don&apos;t have an account?{' '}
            <Button variant="link" onClick={() => setIsRegister(true)} disabled={loading}>
              Register here
            </Button>
          </span>
        )}
      </div>
    </Form>
  )
}
