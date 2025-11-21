import { Menu } from '@/router/menus'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import RemixIcon from '../RemixIcon'

export default function MenuItem(props: Menu) {
  return (
    <NavLink to={props.path} end className={() => 'block w-full h-full'}>
      {({ isActive }) => (
        <div
          className={clsx(
            isActive ? 'w-full border-color-primary' : 'border-transparent',
            'border-l-[4px] duration-200'
          )}
        >
        <div
          data-active={isActive}
          className={clsx(
            's-flex gap-x-3  px-4 py-3 w-full h-full duration-200',
            isActive ? 'bg-subtle' : 'hover:bg-subtle text-muted-foreground'
          )}
        >
          <RemixIcon name={props.icon!} />
          <span>{props.title}</span>
        </div>
        </div>
      )}
    </NavLink>
  )
}
