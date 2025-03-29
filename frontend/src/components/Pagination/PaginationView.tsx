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

    for (let page = 1; page <= totalPages; page++) {
      items.push(
        <Pagination.Item key={page} active={page === currentPage} onClick={() => handleClick(page)}>
          {page}
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
