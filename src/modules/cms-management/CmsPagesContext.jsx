import { createContext, useContext, useState } from 'react'
import { cmsPages as initialPages } from '../../mock-data/cms'
// TODO: replace mock data with real API call to /api/v1/cms/pages

const CmsPagesContext = createContext(null)

export function CmsPagesProvider({ children }) {
  const [pages, setPages] = useState(initialPages)

  const getPage = (id) => pages.find((p) => p.id === id)

  const addPage = (data) => {
    const newPage = {
      ...data,
      id: `CMS-${pages.length + 1 + Math.floor(Math.random() * 1000)}`,
      author: 'Admin User',
      updatedDate: new Date().toISOString().slice(0, 10),
    }
    setPages((prev) => [newPage, ...prev])
    return newPage
  }

  const updatePage = (id, data) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data, updatedDate: new Date().toISOString().slice(0, 10) } : p))
    )
  }

  const deletePage = (id) => {
    setPages((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <CmsPagesContext.Provider value={{ pages, getPage, addPage, updatePage, deletePage }}>
      {children}
    </CmsPagesContext.Provider>
  )
}

export function useCmsPages() {
  const ctx = useContext(CmsPagesContext)
  if (!ctx) throw new Error('useCmsPages must be used within CmsPagesProvider')
  return ctx
}
