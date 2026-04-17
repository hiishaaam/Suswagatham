'use client'

import React, { createContext, useContext, useReducer, useCallback, ReactNode, useState, useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

type Action =
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }

const ToastContext = createContext<{
  addToast: (message: string, type: ToastType) => void
  removeToast: (id: string) => void
} | null>(null)

const toastReducer = (state: Toast[], action: Action): Toast[] => {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.toast]
    case 'REMOVE_TOAST':
      return state.filter(t => t.id !== action.id)
    default:
      return state
  }
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, dispatch] = useReducer(toastReducer, [])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9)
    dispatch({ type: 'ADD_TOAST', toast: { id, message, type } })
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', id })
    }, 3000)
  }, [])

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id })
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) => {
  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:-translate-x-0 sm:right-6 z-50 flex flex-col gap-2 w-max max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

const ToastItem = ({ toast, onRemove }: { toast: Toast, onRemove: () => void }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(onRemove, 300) // wait for animation
  }

  const borderColors = {
    success: 'border-success',
    error: 'border-error',
    info: 'border-gold'
  }

  const bgColors = {
    success: 'bg-success/5',
    error: 'bg-error/5',
    info: 'bg-gold/5'
  }

  return (
    <div 
      onClick={handleRemove}
      className={`
        px-4 py-3 rounded bg-white shadow-card border-l-4 ${borderColors[toast.type]}
        cursor-pointer font-body text-sm font-medium text-ink flex items-center justify-between
        transition-all duration-300 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
    >
      <span className="truncate max-w-[280px]">{toast.message}</span>
    </div>
  )
}
