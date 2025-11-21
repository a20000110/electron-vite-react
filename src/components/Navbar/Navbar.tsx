import Search from './Search'
import ThemeMenu from './ThemeMenu'

export default function Navbar() {
  return (
    <div className="w-navbar h-navbar border-b border-primary b-flex px-6">
      <Search />
      <ThemeMenu />
    </div>
  )
}
