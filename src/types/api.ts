export interface Pipeline {
  id: string
  pipelineId: string
  name: string
  projectType: string
  status: string
  executor: string
  createdAt: string
  duration: number
  recordsProcessed?: number
  epoch?: number
  accuracy?: number
  errorLogs?: string[]
  reportsGenerated?: number
  scheduledFor?: string
  filesArchived?: number
  imagesProcessed?: number
  totalImages?: number
  backupSize?: string
  backupLocation?: string
  queueSize?: number
  eventsProcessed?: number
  vulnerabilitiesFound?: number
}

export interface Project {
  id: string
  projectId: string
  name: string
  projectType: string
  status: string
  repository: string
  language: string
  createdAt: string
  lastDeployed?: string
  team?: string
  replicas?: number
  cpuUsage?: string
  charts?: number
  dataSources?: number
  errorRate?: string
  lastError?: string
  endpoints?: number
  scheduledFor?: string
  throughput?: string
  clusterSize?: string
  pages?: number
  users?: number
}

export interface PipelineQuery {
  status?: string
  projectType?: string
  executor?: string
  durationGte?: number
  durationLte?: number
  createdAtGte?: string
  createdAtLte?: string
  limit?: number
  offset?: number
}

export interface ProjectQuery {
  status?: string
  projectType?: string
  language?: string
  limit?: number
  offset?: number
}
