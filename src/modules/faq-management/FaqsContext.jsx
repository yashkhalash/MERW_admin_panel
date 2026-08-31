import { createContext, useContext, useState } from 'react'
import { faqs as initialFaqs } from '../../mock-data/faqs'
// TODO: replace mock data with real API call to /api/v1/faqs

const FaqsContext = createContext(null)

export function FaqsProvider({ children }) {
  const [faqs, setFaqs] = useState(initialFaqs)

  const getFaq = (id) => faqs.find((f) => f.id === id)

  const addFaq = (data) => {
    const newFaq = {
      ...data,
      id: `FAQ-${faqs.length + 1 + Math.floor(Math.random() * 1000)}`,
      updatedDate: new Date().toISOString().slice(0, 10),
    }
    setFaqs((prev) => [newFaq, ...prev])
    return newFaq
  }

  const updateFaq = (id, data) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...data, updatedDate: new Date().toISOString().slice(0, 10) } : f))
    )
  }

  const deleteFaq = (id) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <FaqsContext.Provider value={{ faqs, getFaq, addFaq, updateFaq, deleteFaq }}>
      {children}
    </FaqsContext.Provider>
  )
}

export function useFaqs() {
  const ctx = useContext(FaqsContext)
  if (!ctx) throw new Error('useFaqs must be used within FaqsProvider')
  return ctx
}
