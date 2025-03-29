import { useForm } from 'react-hook-form'
import { Form, Button } from 'react-bootstrap'

import type { Url, UrlData, UrlPatch } from '../../../models/Url'

import { isValidHttpUrl } from '../../../lib/validate'

interface UrlFormProps {
  modifying: boolean
  onSubmit: (data: UrlData | UrlPatch) => Promise<void> | void

  url?: Url
}

export const UrlForm = ({ modifying, onSubmit, url }: UrlFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UrlData | UrlPatch>({
    defaultValues: {
      value: url?.value || '',
      slug: url?.slug || ''
    }
  })

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="valueField">
        <Form.Label>URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter the full URL"
          {...register('value', {
            required: 'URL is required',
            validate: isValidHttpUrl
          })}
          isInvalid={!!errors.value}
        />
        {errors.value && <Form.Control.Feedback type="invalid">{errors.value.message}</Form.Control.Feedback>}
      </Form.Group>

      {url?.id && (
        <Form.Group controlId="slugField" className="mt-3">
          <Form.Label>Slug</Form.Label>
          <Form.Control type="text" placeholder="Enter a custom slug" {...register('slug')} />
        </Form.Group>
      )}

      <div className="mt-3">
        <Button variant="primary" type="submit" disabled={modifying}>
          {url?.id ? 'Update' : 'Shorten'}
        </Button>
      </div>
    </Form>
  )
}
