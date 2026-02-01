import { get } from './client'
import { ENDPOINTS } from './endpoints'
import { USE_MOCK } from '../config/api'
import { mockProjects } from '../mocks/projects'
import type { Project, ProjectQuery } from '../types/api'

function filterMockProjects(query: ProjectQuery): Project[] {
  let filtered = [...mockProjects]

  if (query.status) {
    filtered = filtered.filter((p) => p.status === query.status)
  }

  if (query.projectType) {
    filtered = filtered.filter((p) =>
      p.projectType.toLowerCase().includes(query.projectType!.toLowerCase())
    )
  }

  if (query.language) {
    filtered = filtered.filter((p) =>
      p.language.toLowerCase().includes(query.language!.toLowerCase())
    )
  }

  const offset = query.offset || 0
  const limit = query.limit || filtered.length

  return filtered.slice(offset, offset + limit)
}

export async function getProjects(query: ProjectQuery = {}): Promise<Project[]> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return filterMockProjects(query)
  }

  const params: Record<string, unknown> = {}
  
  if (query.status) params.status = query.status
  if (query.projectType) params.projectType = query.projectType
  if (query.language) params.language = query.language
  if (query.limit !== undefined) params.limit = query.limit
  if (query.offset !== undefined) params.offset = query.offset

  return get<Project[]>(ENDPOINTS.projects, params)
}
