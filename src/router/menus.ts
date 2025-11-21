import React from 'react'

export interface MenuBase {
  path: string
  title: string
  icon?: string
  component: React.ComponentType
  children?: MenuBase[]
  category?: {
    id: string
    title: string
  }
  layout?: React.ComponentType
}

export interface Menu extends MenuBase {
  subs?: Menu[]
}

export interface Menus {
  menus: Menu[]
}

export const menus: Menus = {
  menus: [
    {
      path: '/',
      title: '首页/推荐',
      component: React.lazy(() => import('@/pages/Home/page')),
      icon: 'home-9-fill',
      category: {
        id: '1',
        title: '主菜单',
      },
    },
    {
      path: '/my-music/collect',
      title: '我的收藏',
      component: React.lazy(() => import('@/pages/MyMusic/Collect/page')),
      icon: 'hearts-fill',
      category: {
        id: '2',
        title: '我的音乐',
      },
    },
    {
      path: '/my-music/recently-played',
      title: '最近播放',
      component: React.lazy(() => import('@/pages/MyMusic/RecentlyPlayed/page')),
      icon: 'music-fill',
      category: {
        id: '2',
        title: '我的音乐',
      },
    },
    {
      path: '/my-music/local-music',
      title: '本地音乐',
      component: React.lazy(() => import('@/pages/MyMusic/LocalMusic/page')),
      icon: 'phone-find-line',
      category: {
        id: '2',
        title: '我的音乐',
      },
    },
    {
      path: '/find-music/song-list-classification',
      title: '歌单分类',
      component: React.lazy(() => import('@/pages/FindMusic/SongListClassification/page')),
      icon: 'safari-line',
      category: {
        id: '3',
        title: '发现音乐',
      },
    },
    {
      path: '/find-music/ranking-list',
      title: '排行榜',
      component: React.lazy(() => import('@/pages/FindMusic/RankingList/page')),
      icon: 'line-chart-fill',
      category: {
        id: '3',
        title: '发现音乐',
      },
    },
    {
      path: '/find-music/radio-blog',
      title: '电台/博客',
      component: React.lazy(() => import('@/pages/FindMusic/RadioBlog/page')),
      icon: 'signal-tower-fill',
      category: {
        id: '3',
        title: '发现音乐',
      },
    },
  ],
}

export interface MenuGroup {
  id: string
  title: string
  menus: Menu[]
}

export const getMenuGroup = () => {
  // 根据category.id分组
  const groups = new Map<string, MenuGroup>()

  for (const item of menus.menus) {
    const id = item.category?.id ?? ''
    const title = item.category?.title ?? ''

    const g = groups.get(id)
    if (g) {
      g.menus.push(item)
    } else {
      groups.set(id, { id, title, menus: [item] })
    }
  }

  return Array.from(groups.values())
}
