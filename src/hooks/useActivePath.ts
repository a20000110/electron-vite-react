import { useLocation } from 'react-router-dom'

export const useActivePath = (targetPath?: string): boolean => {
  const { pathname } = useLocation()
  const path = targetPath ?? '/'
  return pathname === path
}
