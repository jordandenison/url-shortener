import { useParams } from 'react-router-dom'

import { EditUrl } from '../../components/Urls/Edit'

import { Layout } from '../../components/Layout'

export const EditUrlView = () => {
  const { id } = useParams()

  return (
    <Layout>
      <EditUrl urlId={id!} />
    </Layout>
  )
}
