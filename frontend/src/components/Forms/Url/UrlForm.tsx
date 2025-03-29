import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import type { Url, UrlData, UrlPatch } from '../../../models/Url'

import { copyToClipboard } from '../../../lib/util'
import { isValidHttpUrl } from '../../../lib/validate'

interface UrlFormProps {
  createToast: (message: string) => void
  modifying: boolean
  onSubmit: (data: UrlData | UrlPatch) => Promise<Url | undefined>

  url?: Url
}

export const UrlForm = ({ createToast, modifying, onSubmit, url }: UrlFormProps) => {
  const [createdSlug, setCreatedSlug] = useState('')

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

  const handleCopyClick = () => {
    copyToClipboard(`${window.location.origin}/${createdSlug}`)
    createToast(`Shortened URL copied to clipboard successfully!`)
  }

  const handleFormSubmit = async (data: UrlData | UrlPatch) => {
    const result = await onSubmit(data)

    if (result && !url?.id) {
      setCreatedSlug(result.slug)
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <Form.Group controlId="valueField">
        <Form.Label>URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="https://example.com"
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

      {createdSlug && (
        <Form.Group className="mt-4">
          <Form.Label className="text-success">✅ Success! Here's your short URL:</Form.Label>
          <Row className="align-items-center">
            <Col xs={9} className="text-break">
              <a href={`${window.location.origin}/${createdSlug}`} target="_blank" rel="noopener noreferrer">
                {`${window.location.origin}/${createdSlug}`}
              </a>
            </Col>

            <Col xs={3} className="text-end">
              <Button variant="outline-success" size="sm" onClick={handleCopyClick}>
                <i className="bi bi-clipboard" /> Copy
              </Button>
            </Col>
          </Row>
        </Form.Group>
      )}

      <div className="mt-3 text-center">
        <Button variant="primary" type="submit" disabled={!!createdSlug || modifying}>
          {url?.id ? 'Update' : 'Shorten'}
        </Button>
      </div>
    </Form>
  )
}
