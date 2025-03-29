import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'

import type { Url } from '../../models/Url'

import { formatDateShort } from '../../lib/date'
import { copyToClipboard } from '../../lib/util'

import { ConfirmRemoveUrlModal } from '../Modals/ConfirmRemoveUrl'
import { PaginationView as Pagination } from '../Pagination'
import { LoadingView as Loading } from '../Loading'

interface Props {
  createToast: (message: string) => void
  currentThemeType: string
  findUrls: (search: string, $limit: number, $skip: number, sort: string, sortOrder: number) => void
  limit: number
  loading: boolean
  openModal: (modalName: string) => void
  removeUrl: (id: number) => Promise<void>
  skip: number
  sort: string
  sortOrder: number
  total: number
  urls: Url[]

  search?: string
}

export const UrlsView = ({
  createToast,
  currentThemeType,
  findUrls,
  limit,
  loading,
  openModal,
  removeUrl,
  search,
  skip,
  sort,
  sortOrder,
  total,
  urls
}: Props) => {
  const [idToRemove, setIdToRemove] = useState<number>(0)
  const navigate = useNavigate()

  useEffect(() => {
    findUrls('', 10, 0, 'id', 1)
  }, [findUrls])

  const handleConfirmRemoveUrl = async (): Promise<void> => {
    await removeUrl(idToRemove)
    navigate('/')
  }

  const handleHeaderClick = (field: string): void => {
    if (sort === field) {
      const newSortOrder = sortOrder === 1 ? -1 : 1
      findUrls(search || '', limit, skip, field, newSortOrder)
    } else {
      findUrls(search || '', limit, skip, field, 1)
    }
  }

  const renderSortIcon = (field: string) => {
    if (sort !== field) return null
    return sortOrder === 1 ? <i className="bi bi-arrow-up-short ms-1" /> : <i className="bi bi-arrow-down-short ms-1" />
  }

  const handlePageChange = (newSkip: number): void => {
    if (skip !== newSkip) {
      findUrls(search || '', limit, newSkip, sort, sortOrder)
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    findUrls(event.target.value, limit, 0, sort, sortOrder)
  }

  return (
    <Container>
      <Row className="align-items-center mb-3">
        <Col>
          <h3 className="mb-0">Your URLs</h3>
        </Col>
        <Col xs="12" sm="6" md="6" lg="6">
          <InputGroup>
            <InputGroup.Text className={`border-end-0 ${currentThemeType === 'dark' ? 'bg-dark text-light border-light' : ''}`}>
              <i className="bi bi-search text-muted" />
            </InputGroup.Text>

            <Form.Control
              placeholder="Search..."
              className={`${currentThemeType === 'dark' ? 'bg-dark text-light border-start-0 border-light' : 'border-start-0'}`}
              onChange={handleSearchChange}
              value={search || ''}
            />
          </InputGroup>
        </Col>
      </Row>
      {!loading && !urls.length ? (
        <h2 className="text-center" style={{ marginTop: '32vh' }}>
          {search?.length ? 'No URLs found.' : 'You have not created any URLs yet.'}
        </h2>
      ) : loading ? (
        <Loading style={{ marginTop: '32vh' }} />
      ) : (
        <Table striped bordered>
          <thead>
            <tr>
              <th className={`col-4 ${sort === 'value' ? 'bg-light' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleHeaderClick('value')}>
                Target URL {renderSortIcon('value')}
              </th>
              <th className={`col-2 ${sort === 'slug' ? 'bg-light' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleHeaderClick('slug')}>
                Slug {renderSortIcon('slug')}
              </th>
              <th
                className={`col-1 text-center ${sort === 'visits' ? 'bg-light' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleHeaderClick('visits')}
              >
                Visits {renderSortIcon('visits')}
              </th>
              <th className={`col-3 text-center ${sort === 'id' ? 'bg-light' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleHeaderClick('id')}>
                Created At {renderSortIcon('id')}
              </th>
              <th className="col-2 text-center">Options</th>
            </tr>
          </thead>

          <tbody>
            {urls.map((url, index) => (
              <tr key={index}>
                <td className="col-4 text-break align-middle">
                  <a href={url.value} target="_blank" rel="noopener noreferrer">
                    {url.value}
                  </a>
                </td>
                <td
                  className="col-2 align-middle text-primary"
                  style={{ cursor: 'pointer' }}
                  title="Click to copy"
                  onClick={() => {
                    copyToClipboard(`${window.location.origin}/${url.slug}`)
                    createToast(`Shortened URL copied to clipboard successfully!`)
                  }}
                >
                  {url.slug}
                </td>
                <td className="col-1 text-center align-middle">{url.visits}</td>
                <td className="col-3 text-center align-middle">{formatDateShort(url.createdAt)}</td>
                <td className="col-2 text-center align-middle">
                  <div className="d-flex justify-content-center gap-2 flex-wrap w-100">
                    <Button variant="link" size="sm" onClick={() => navigate(`/edit/${url.id}`)} title="Edit">
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setIdToRemove(url.id)
                        openModal('confirmRemoveUrl')
                      }}
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {!loading && total > 10 && <Pagination limit={limit} onPageChange={handlePageChange} skip={skip} total={total} />}
      <ConfirmRemoveUrlModal onAccept={handleConfirmRemoveUrl} />
    </Container>
  )
}
