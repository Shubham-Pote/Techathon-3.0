import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "./AuthContext"

const BookmarkContext = createContext()

const STORAGE_KEY = "farmer_bookmarks"

function getStoredBookmarks(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const all = JSON.parse(raw)
    return all[userId] || []
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

  const [bookmarks, setBookmarks] = useState([])

  // Load bookmarks when user changes
  useEffect(() => {
    if (userId) {
      setBookmarks(getStoredBookmarks(userId))
    } else {
      setBookmarks([])
    }
  }, [userId])

  const toggleBookmark = useCallback(
    (schemeId) => {
      if (!userId) return
      setBookmarks((prev) => {
        const next = prev.includes(schemeId)
          ? prev.filter((id) => id !== schemeId)
          : [...prev, schemeId]
        saveBookmarks(userId, next)
        return next
      })
    },
    [userId]
  )

  const isBookmarked = useCallback(
    (schemeId) => bookmarks.includes(schemeId),
    [bookmarks]
  )

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  )
}

export const useBookmarks = () => useContext(BookmarkContext)
