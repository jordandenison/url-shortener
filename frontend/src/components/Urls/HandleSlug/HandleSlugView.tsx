interface Props {
  loading: boolean
  slug: string
}

export const HangleSlugView = ({ slug }: Props) => {
  return <div>HandleSlug {slug}</div>
}
