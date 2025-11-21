import Sidebar from '@/components/Sidebar/Sidebar'
import Navbar from './Navbar/Navbar'
import Player from './Player/Player'
import View from './View/View'

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden flex-col">
      <div className="flex">
        {/* 侧边栏 */}
        <Sidebar />
        <div className="flex flex-col flex-1">
          {/* 导航栏 */}
          <Navbar />
          {/* 视图 */}
          <View />
        </div>
      </div>
      {/* 播放器 */}
      <Player />
    </div>
  )
}
