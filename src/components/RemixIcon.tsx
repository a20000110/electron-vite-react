import * as Icons from '@remixicon/react'
import { clsx } from 'clsx'

export default function RemixIcon(
  props: Icons.RemixiconComponentType['defaultProps'] & {
    name: string
    disable?: boolean
  }
): JSX.Element | null {
  const name =
    'Ri' +
    props.name
      .split('-')
      ?.map(item => item?.charAt(0)?.toUpperCase() + item?.slice(1))
      .join('')
  if (!Object.keys(Icons).includes(name)) return null
  const Icon = Icons[name as keyof typeof Icons]
  const disableClassNames: string =
    props?.disable === true ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''
  return (
    <Icon {...props} className={clsx(props?.className || '', 'duration-300', disableClassNames)} />
  )
}
