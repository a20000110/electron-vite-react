import MusicLoading from '@/components/Loading/MusicLoading'
import { menus } from '@/router/menus'
import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function View() {
  return (
    <div className="flex flex-col w-view h-view overflow-y-auto">
      <Suspense fallback={<MusicLoading />}>
        <Routes>
          {menus.menus.map(m => (
            <Route key={m.path} path={m.path} element={<m.component />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}
