import { MenuGroup } from '@/router/menus'
import MenuItem from './MenuItem'

export default function MenuBlock({ title, id, menus }: MenuGroup) {
  return (
    <div data-menu-id={id}>
      <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </div>
      <ul>
        {menus.map(item => {
          return (
            <li key={item.path} className="w-full h-full">
              <MenuItem {...item} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
