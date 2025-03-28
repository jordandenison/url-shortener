import { useParams } from 'react-router-dom'

import { HandleSlug } from '../../components/Urls/HandleSlug'
import { Layout } from '../../components/Layout'

export const HandleSlugView = () => {
  const { slug } = useParams()

  return (
    <Layout>
      <HandleSlug slug={slug!} />
    </Layout>
  )
}
