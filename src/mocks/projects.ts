import type { Project } from '../types/api'

export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    projectId: 'proj-001',
    name: 'E-Commerce Platform',
    projectType: 'web-app',
    status: 'active',
    repository: 'github.com/company/ecommerce',
    language: 'TypeScript',
    createdAt: '2024-01-20T08:00:00Z',
    lastDeployed: '2024-01-24T10:00:00Z',
    team: 'frontend'
  },
  {
    id: 'proj-002',
    projectId: 'proj-002',
    name: 'Payment Service',
    projectType: 'microservice',
    status: 'deploying',
    repository: 'github.com/company/payment',
    language: 'Go',
    createdAt: '2024-01-18T14:30:00Z',
    replicas: 3,
    cpuUsage: '45%'
  },
  {
    id: 'proj-003',
    projectId: 'proj-003',
    name: 'Analytics Dashboard',
    projectType: 'dashboard',
    status: 'active',
    repository: 'github.com/company/analytics',
    language: 'Python',
    createdAt: '2024-01-22T11:00:00Z',
    charts: 24,
    dataSources: 8
  },
  {
    id: 'proj-004',
    projectId: 'proj-004',
    name: 'User Management API',
    projectType: 'api',
    status: 'error',
    repository: 'github.com/company/user-api',
    language: 'Node.js',
    createdAt: '2024-01-19T09:15:00Z',
    errorRate: '2.3%',
    lastError: 'Database connection timeout'
  },
  {
    id: 'proj-005',
    projectId: 'proj-005',
    name: 'Mobile App Backend',
    projectType: 'mobile-backend',
    status: 'configuring',
    repository: 'github.com/company/mobile-api',
    language: 'Java',
    createdAt: '2024-01-23T16:45:00Z',
    endpoints: 42,
    scheduledFor: '2024-01-25T09:00:00Z'
  },
  {
    id: 'proj-006',
    projectId: 'proj-006',
    name: 'Notification Service',
    projectType: 'microservice',
    status: 'active',
    repository: 'github.com/company/notifications',
    language: 'Rust',
    createdAt: '2024-01-21T13:20:00Z',
    throughput: '50K msg/min'
  },
  {
    id: 'proj-007',
    projectId: 'proj-007',
    name: 'Data Pipeline',
    projectType: 'etl',
    status: 'processing',
    repository: 'github.com/company/data-pipeline',
    language: 'Scala',
    createdAt: '2024-01-17T10:00:00Z',
    clusterSize: '10 nodes'
  },
  {
    id: 'proj-008',
    projectId: 'proj-008',
    name: 'Admin Portal',
    projectType: 'web-app',
    status: 'active',
    repository: 'github.com/company/admin',
    language: 'React',
    createdAt: '2024-01-22T15:30:00Z',
    pages: 18,
    users: 1250
  }
]
