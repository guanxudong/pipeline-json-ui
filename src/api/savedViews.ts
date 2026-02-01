import type { SavedView, FilterCondition } from '../types'
import { get } from './client'
import { ENDPOINTS } from './endpoints'
import { USE_MOCK } from '../config/api'
import { mockSavedViews } from '../mocks/savedViews'

export interface CreateSavedViewRequest {
  name: string
  conditions: FilterCondition[]
}

export interface SavedViewResponse extends SavedView {
  createdAt: string
  updatedAt: string
}

// In-memory mock storage for CRUD operations
const mockStorage = {
  views: [...mockSavedViews],
  idCounter: mockSavedViews.length + 1
}

function toSavedViewResponse(view: SavedView): SavedViewResponse {
  return {
    ...view,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

function generateId(): string {
  const id = `view-${mockStorage.idCounter}`
  mockStorage.idCounter += 1
  return id
}

export async function getSavedViews(): Promise<SavedViewResponse[]> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockStorage.views.map(toSavedViewResponse)
  }

  return get<SavedViewResponse[]>(ENDPOINTS.savedViews)
}

export async function createSavedView(name: string, conditions: FilterCondition[]): Promise<SavedViewResponse> {
  if (USE_MOCK) {
    const newView: SavedView = {
      id: generateId(),
      name,
      conditions: conditions.map(c => ({ ...c, id: generateId() }))
    }
    mockStorage.views.push(newView)
    return toSavedViewResponse(newView)
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}${ENDPOINTS.savedViews}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, conditions })
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

export async function deleteSavedView(id: string): Promise<void> {
  if (USE_MOCK) {
    mockStorage.views = mockStorage.views.filter(v => v.id !== id)
    return
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}${ENDPOINTS.savedViews}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
}
