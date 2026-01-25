import type { Pipeline } from '../types/api'

export const mockPipelines: Pipeline[] = [
  {
    id: 'pipe-001',
    pipelineId: 'pipe-001',
    name: 'Data Ingestion Pipeline',
    projectType: 'data-ingestion',
    status: 'success',
    executor: 'k8s-pod',
    createdAt: '2024-01-24T10:30:00Z',
    duration: 245.67,
    recordsProcessed: 1250000,
    errorLogs: []
  },
  {
    id: 'pipe-002',
    pipelineId: 'pipe-002',
    name: 'ML Model Training',
    projectType: 'ml-training',
    status: 'running',
    executor: 'gpu-pod',
    createdAt: '2024-01-24T11:15:00Z',
    duration: 1234.5,
    epoch: 15,
    accuracy: 0.9234
  },
  {
    id: 'pipe-003',
    pipelineId: 'pipe-003',
    name: 'ETL Daily Job',
    projectType: 'etl',
    status: 'failed',
    executor: 'aws-lambda',
    createdAt: '2024-01-24T12:00:00Z',
    duration: 45.23,
    errorLogs: ['Connection timeout to database', 'Retry exhausted']
  },
  {
    id: 'pipe-004',
    pipelineId: 'pipe-004',
    name: 'Report Generation',
    projectType: 'reporting',
    status: 'success',
    executor: 'serverless',
    createdAt: '2024-01-24T12:30:00Z',
    duration: 12.45,
    reportsGenerated: 42
  },
  {
    id: 'pipe-005',
    pipelineId: 'pipe-005',
    name: 'Data Validation',
    projectType: 'validation',
    status: 'pending',
    executor: 'k8s-job',
    createdAt: '2024-01-24T13:00:00Z',
    duration: 0,
    scheduledFor: '2024-01-24T14:00:00Z'
  },
  {
    id: 'pipe-006',
    pipelineId: 'pipe-006',
    name: 'Archive Cleanup',
    projectType: 'maintenance',
    status: 'success',
    executor: 'cron-job',
    createdAt: '2024-01-24T13:30:00Z',
    duration: 8.9,
    filesArchived: 15600
  },
  {
    id: 'pipe-007',
    pipelineId: 'pipe-007',
    name: 'API Sync',
    projectType: 'sync',
    status: 'failed',
    executor: 'aws-lambda',
    createdAt: '2024-01-24T14:00:00Z',
    duration: 23.1,
    errorLogs: ['503 Service Unavailable from upstream API']
  },
  {
    id: 'pipe-008',
    pipelineId: 'pipe-008',
    name: 'Image Processing',
    projectType: 'processing',
    status: 'running',
    executor: 'batch-job',
    createdAt: '2024-01-24T14:30:00Z',
    duration: 567.8,
    imagesProcessed: 4500,
    totalImages: 10000
  },
  {
    id: 'pipe-009',
    pipelineId: 'pipe-009',
    name: 'Database Backup',
    projectType: 'backup',
    status: 'success',
    executor: 'cron-job',
    createdAt: '2024-01-24T15:00:00Z',
    duration: 45.2,
    backupSize: '2.3 GB',
    backupLocation: 's3://backups/2024/01/24/'
  },
  {
    id: 'pipe-010',
    pipelineId: 'pipe-010',
    name: 'Notification Service',
    projectType: 'notifications',
    status: 'pending',
    executor: 'k8s-deployment',
    createdAt: '2024-01-24T15:30:00Z',
    duration: 0,
    queueSize: 1250
  },
  {
    id: 'pipe-011',
    pipelineId: 'pipe-011',
    name: 'Analytics Pipeline',
    projectType: 'analytics',
    status: 'success',
    executor: 'spark-job',
    createdAt: '2024-01-24T16:00:00Z',
    duration: 890.5,
    eventsProcessed: 5000000
  },
  {
    id: 'pipe-012',
    pipelineId: 'pipe-012',
    name: 'Security Scan',
    projectType: 'security',
    status: 'running',
    executor: 'container-scan',
    createdAt: '2024-01-24T16:30:00Z',
    duration: 234.6,
    vulnerabilitiesFound: 3
  }
]
