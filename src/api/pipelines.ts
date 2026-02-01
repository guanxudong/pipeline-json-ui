import { get } from './client'
import { ENDPOINTS } from './endpoints'
import { USE_MOCK } from '../config/api'
import { mockPipelines } from '../mocks/pipelines'
import type { Pipeline, PipelineQuery } from '../types/api'

function filterMockPipelines(query: PipelineQuery): Pipeline[] {
  let filtered = [...mockPipelines]

  if (query.status) {
    filtered = filtered.filter((p) => p.status === query.status)
  }

  if (query.projectType) {
    filtered = filtered.filter((p) =>
      p.projectType.toLowerCase().includes(query.projectType!.toLowerCase())
    )
  }

  if (query.executor) {
    filtered = filtered.filter((p) =>
      p.executor.toLowerCase().includes(query.executor!.toLowerCase())
    )
  }

  if (query.durationGte !== undefined) {
    filtered = filtered.filter((p) => p.duration >= query.durationGte!)
  }

  if (query.durationLte !== undefined) {
    filtered = filtered.filter((p) => p.duration <= query.durationLte!)
  }

  const offset = query.offset || 0
  const limit = query.limit || filtered.length

  return filtered.slice(offset, offset + limit)
}

export async function getPipelines(query: PipelineQuery = {}): Promise<Pipeline[]> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return filterMockPipelines(query)
  }

  const params: Record<string, unknown> = {}
  
  if (query.status) params.status = query.status
  if (query.projectType) params.projectType = query.projectType
  if (query.executor) params.executor = query.executor
  if (query.durationGte !== undefined) params.durationGte = query.durationGte
  if (query.durationLte !== undefined) params.durationLte = query.durationLte
  if (query.limit !== undefined) params.limit = query.limit
  if (query.offset !== undefined) params.offset = query.offset

  return get<Pipeline[]>(ENDPOINTS.pipelines, params)
}
