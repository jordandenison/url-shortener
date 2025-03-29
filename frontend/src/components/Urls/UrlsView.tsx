import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
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
    findUrls(event.target.value, limit, skip, sort, sortOrder)
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Your Urls</h3>
        <div className="position-relative" style={{ maxWidth: '300px', width: '100%' }}>
          <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className={`form-control ps-5 ${currentThemeType === 'dark' ? 'bg-dark text-light border-light' : ''}`}
            onChange={handleSearchChange}
            value={search || ''}
          />
        </div>
      </div>
      {!urls.length ? (
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
                Value {renderSortIcon('value')}
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
