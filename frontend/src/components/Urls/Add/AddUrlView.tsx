import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

import { LoadingView as Loading } from '../../Loading'

import type { Url, UrlData, UrlPatch } from '../../../models/Url'

import { UrlForm } from '../../Forms/Url'

interface Props {
  addUrl: (data: UrlData | UrlPatch) => Promise<Url | undefined>
  loading: boolean
  modifying: boolean
}

export const AddUrlView = ({ addUrl, loading, modifying }: Props) => {
  const navigate = useNavigate()

  const handleOnSubmit = async (data: UrlData | UrlPatch): Promise<void> => {
    const url = await addUrl(data)
    if (url) {
      navigate('/')
    }
  }

  return loading ? (
    <Loading style={{ marginTop: '32vh' }} />
  ) : (
    <Container>
      <UrlForm onSubmit={handleOnSubmit} modifying={modifying} />
    </Container>
  )
}
