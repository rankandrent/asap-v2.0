import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useManufacturers } from '../hooks/useManufacturers'
import type { Manufacturer } from '../types/manufacturer'

interface ManufacturerContextType {
  selectedManufacturer: string // Always a string (never null) - defaults to DEFAULT_MANUFACTURER
  setSelectedManufacturer: (manufacturer: string | null) => void
  manufacturers: Manufacturer[]
  isLoading: boolean
  error: Error | null
  defaultManufacturer: string
}

const ManufacturerContext = createContext<ManufacturerContextType | undefined>(undefined)

// Default manufacturer (can be overridden via environment variable)
const DEFAULT_MANUFACTURER = import.meta.env.VITE_DEFAULT_MANUFACTURER || 'Amatom'

interface ManufacturerProviderProps {
  children: ReactNode
}

export const ManufacturerProvider: React.FC<ManufacturerProviderProps> = ({ children }) => {
  const { data: manufacturers = [], isLoading: isLoadingManufacturers, error } = useManufacturers()
  
  // Initialize with default manufacturer immediately (don't wait for manufacturers to load)
  // This ensures queries can run immediately
  const [selectedManufacturer, setSelectedManufacturerState] = useState<string>(() => {
    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedManufacturer')
      if (stored && stored.trim() !== '') {
        console.log('📦 ManufacturerContext: Loaded from localStorage:', stored)
        return stored
      }
    }
    // Otherwise use default
    console.log('📦 ManufacturerContext: Using default manufacturer:', DEFAULT_MANUFACTURER)
    return DEFAULT_MANUFACTURER
  })

  // Update selected manufacturer when manufacturers load (but don't block queries)
  useEffect(() => {
    if (manufacturers.length > 0) {
      console.log('📦 ManufacturerContext: Manufacturers loaded:', manufacturers.map(m => m.name))
      
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('selectedManufacturer')
        
        // If we have a stored value, verify it exists in the list
        if (stored && stored.trim() !== '' && manufacturers.some(m => m.name === stored)) {
          console.log('✅ ManufacturerContext: Verified stored manufacturer:', stored)
          if (stored !== selectedManufacturer) {
            setSelectedManufacturerState(stored)
          }
          return
        }
      }
      
      // Try to find default manufacturer in the list
      const defaultManufacturer = manufacturers.find(
        m => m.name.toLowerCase() === DEFAULT_MANUFACTURER.toLowerCase()
      )
      
      if (defaultManufacturer) {
        console.log('✅ ManufacturerContext: Found default manufacturer in list:', defaultManufacturer.name)
        if (defaultManufacturer.name !== selectedManufacturer) {
          setSelectedManufacturerState(defaultManufacturer.name)
          if (typeof window !== 'undefined') {
            localStorage.setItem('selectedManufacturer', defaultManufacturer.name)
          }
        }
      } else if (manufacturers.length > 0) {
        // If default not found, use the first manufacturer (usually has most parts)
        const firstManufacturer = manufacturers[0].name
        console.log('✅ ManufacturerContext: Using first manufacturer from list:', firstManufacturer)
        if (firstManufacturer !== selectedManufacturer) {
          setSelectedManufacturerState(firstManufacturer)
          if (typeof window !== 'undefined') {
            localStorage.setItem('selectedManufacturer', firstManufacturer)
          }
        }
      }
    } else if (!isLoadingManufacturers && manufacturers.length === 0) {
      // If manufacturers failed to load, still use default (don't block app)
      console.warn('⚠️ ManufacturerContext: No manufacturers loaded, using default:', DEFAULT_MANUFACTURER)
      if (selectedManufacturer !== DEFAULT_MANUFACTURER) {
        setSelectedManufacturerState(DEFAULT_MANUFACTURER)
      }
    }
  }, [manufacturers, isLoadingManufacturers, selectedManufacturer])

  // Save to localStorage when manufacturer changes (but don't block)
  useEffect(() => {
    if (selectedManufacturer && typeof window !== 'undefined') {
      localStorage.setItem('selectedManufacturer', selectedManufacturer)
    }
  }, [selectedManufacturer])

  const setSelectedManufacturer = (manufacturer: string | null) => {
    if (manufacturer && manufacturer.trim() !== '') {
      console.log('🔄 ManufacturerContext: Setting manufacturer:', manufacturer)
      setSelectedManufacturerState(manufacturer)
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedManufacturer', manufacturer)
      }
    } else {
      // If null, reset to default
      console.log('🔄 ManufacturerContext: Resetting to default:', DEFAULT_MANUFACTURER)
      setSelectedManufacturerState(DEFAULT_MANUFACTURER)
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedManufacturer', DEFAULT_MANUFACTURER)
      }
    }
  }

  // Debug logging
  useEffect(() => {
    console.log('ManufacturerContext: Current state:', {
      selectedManufacturer,
      manufacturersCount: manufacturers.length,
      isLoadingManufacturers,
      error: error?.message,
    })
  }, [selectedManufacturer, manufacturers.length, isLoadingManufacturers, error])

  const value: ManufacturerContextType = {
    selectedManufacturer: selectedManufacturer, // Always return a valid manufacturer (never null)
    setSelectedManufacturer,
    manufacturers,
    isLoading: isLoadingManufacturers,
    error: error as Error | null,
    defaultManufacturer: DEFAULT_MANUFACTURER,
  }

  return (
    <ManufacturerContext.Provider value={value}>
      {children}
    </ManufacturerContext.Provider>
  )
}

export const useManufacturerContext = (): ManufacturerContextType => {
  const context = useContext(ManufacturerContext)
  if (context === undefined) {
    throw new Error('useManufacturerContext must be used within a ManufacturerProvider')
  }
  return context
}

