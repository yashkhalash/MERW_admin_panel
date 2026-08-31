import { createContext, useContext, useState } from 'react'
import { adminProfile as initialProfile } from '../../mock-data/profile'
// TODO: replace mock data with real API call to /api/v1/profile

const STORAGE_KEY = 'merw-admin-profile'

// Default avatar shown until the admin uploads their own photo.
export const DEFAULT_AVATAR_URL = '/user.png'

const ProfileContext = createContext(null)

function loadProfile() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...initialProfile, ...JSON.parse(stored) } : initialProfile
  } catch {
    return initialProfile
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(loadProfile)

  const persist = (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore write failures (e.g. storage full or unavailable)
    }
  }

  const updateProfile = (data) => {
    setProfile((prev) => {
      const next = { ...prev, ...data }
      persist(next)
      return next
    })
  }

  const setAvatar = (avatarUrl) => {
    setProfile((prev) => {
      const next = { ...prev, avatarUrl }
      persist(next)
      return next
    })
  }

  const avatarUrl = profile.avatarUrl || DEFAULT_AVATAR_URL

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, setAvatar, avatarUrl }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
