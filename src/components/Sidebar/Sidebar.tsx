import { getMenuGroup } from '@/router/menus'
import RemixIcon from '../RemixIcon'
import MenuBlock from './MenuBlock'

export default function Sidebar() {
  const menuGroup = getMenuGroup()
  return (
    <aside className="w-siderbar h-sidebar flex-shrink-0 border-r border-primary">
      {/* logo */}
      <div className="p-6 border-b border-primary c-flex gap-x-3 text-2xl">
        <RemixIcon name="music-2-fill" />
        <div className="font-bold">Music</div>
      </div>
      {/* 菜单 */}
      <div className="py-4 h-menu-block overflow-y-auto flex flex-col gap-y-6">
        {menuGroup.map(item => {
          return <MenuBlock {...item} key={item.id} />
        })}
      </div>
    </aside>
  )
}
