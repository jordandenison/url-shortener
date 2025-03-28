import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'

import { Url } from '../../models/Url'
import { formatDateShort } from '../../lib/date'

import { LoadingView as Loading } from '../Loading'

interface Props {
  limit: number
  loading: boolean
  skip: number
  total: number
  urls: Url[]
}

export const UrlsView = ({ loading, urls }: Props) => {
  // const navigate = useNavigate()

  return loading ? (
    <Loading style={{ marginTop: '32vh' }} />
  ) : (
    <Container>
      <h2>Urls</h2>
      {!urls.length ? (
        <h2 className="text-center" style={{ marginTop: '32vh' }}>
          You have not created any urls yet.
        </h2>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="col-5">Value</th>
              <th className="col-3">Slug</th>
              <th className="col-2 text-center">Visits</th>
              <th className="col-2 text-center">Created At</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url, index) => (
              <tr key={index}>
                <td className="col-5 text-break">{url.value}</td>
                <td className="col-3">{url.slug}</td>
                <td className="col-2 text-center">{url.visits}</td>
                <td className="col-2 text-center">{formatDateShort(url.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}
