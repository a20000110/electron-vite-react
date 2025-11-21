import { Input } from '@/components/ui/input'

export default function Search() {
  return (
    <div className="w-1/3 relative">
      <Input type="text" placeholder="搜索音乐、歌手、歌单..." prefixIcon="search-line" />
    </div>
  )
}
