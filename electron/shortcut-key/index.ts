// 注册全局快捷键
import { BrowserWindow, globalShortcut } from 'electron'

// 注册F12 打开开发者工具
export default function registerShortcut(mainWindow: BrowserWindow | null) {
    if (!mainWindow) return
    globalShortcut.register('F12', () => {
        mainWindow.webContents.openDevTools()
    })
}