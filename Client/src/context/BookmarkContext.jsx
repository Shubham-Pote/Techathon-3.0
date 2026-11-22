import { createContext, useContext, useState } from "react"
import { useAuth } from "./AuthContext"

const BookmarkContext = createContext()

const STORAGE_KEY = "farmer_bookmarks"

function getStoredBookmarks(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const all = JSON.parse(raw)
    return Array.isArray(all?.[userId]) ? all[userId] : []
  } catch {
    return []
  }
}

function saveBookmarks(userId, bookmarks) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const all = raw ? JSON.parse(raw) : {}
    all[userId] = bookmarks
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // ignore
  }
}

export function BookmarkProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.mobile || null

  const [updated, setUpdated] = useState(null)
  const cached = updated?.userId === userId ? updated.bookmarks : null
  const bookmarks = userId ? cached ?? getStoredBookmarks(userId) : emptyBookmarks

  function toggleBookmark(schemeId) {
    if (!userId || !schemeId) return
    const next = bookmarks.includes(schemeId)
      ? bookmarks.filter((id) => id !== schemeId)
      : [...bookmarks, schemeId]
    saveBookmarks(userId, next)
    setUpdated({ userId, bookmarks: next })
  }

  const isBookmarked = (schemeId) => bookmarks.includes(schemeId)

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  )
}

const emptyBookmarks = []
// eslint-disable-next-line react-refresh/only-export-components
export const useBookmarks = () => useContext(BookmarkContext)
