import Pagination from 'react-bootstrap/Pagination'

interface Props {
  total: number
  limit: number
  skip: number
  onPageChange: (newSkip: number) => void
}

export const PaginationView = ({ total, limit, skip, onPageChange }: Props) => {
  const currentPage = Math.floor(skip / limit) + 1
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  const handleClick = (page: number) => {
    onPageChange((page - 1) * limit)
  }

  const getPageItems = () => {
    const items = []
    const range = 2

    const start = Math.max(currentPage - range, 1)
    const end = Math.min(currentPage + range, totalPages)

    if (start > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handleClick(1)}>
          1
        </Pagination.Item>
      )
      if (start > 2) items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />)
    }

    for (let page = start; page <= end; page++) {
      items.push(
        <Pagination.Item key={page} active={page === currentPage} onClick={() => handleClick(page)}>
          {page}
        </Pagination.Item>
      )
    }

    if (end < totalPages) {
      if (end < totalPages - 1) items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />)
      items.push(
        <Pagination.Item key={totalPages} onClick={() => handleClick(totalPages)}>
          {totalPages}
        </Pagination.Item>
      )
    }

    return items
  }

  return (
    <Pagination className="justify-content-center mt-4 flex-wrap">
      <Pagination.First onClick={() => handleClick(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1} />
      {getPageItems()}
      <Pagination.Next onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => handleClick(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  )
}
