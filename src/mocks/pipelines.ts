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
    errorLogs: [],
    metadata: {
      source: 's3://data-lake/raw/events/',
      destination: 's3://data-lake/processed/',
      schema: {
        fields: ['user_id', 'event_type', 'timestamp', 'payload'],
        version: 'v2.1'
      },
      performance: {
        throughput: '5.1 MB/s',
        memoryUsage: '2.3 GB',
        cpuUsage: '67%'
      }
    }
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
    accuracy: 0.9234,
    metadata: {
      modelType: 'transformer',
      dataset: 'training_data_v3',
      hyperparameters: {
        learningRate: 0.001,
        batchSize: 32,
        hiddenLayers: 12
      },
      resources: {
        gpuType: 'NVIDIA A100',
        gpuCount: 4,
        memory: '40 GB'
      }
    }
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
    errorLogs: ['Connection timeout to database', 'Retry exhausted'],
    metadata: {
      sourceDatabase: 'prod-db-main.cluster-abc123.us-east-1.rds.amazonaws.com',
      targetDatabase: 'analytics-db.cluster-xyz789.us-east-1.redshift.amazonaws.com',
      tables: ['users', 'orders', 'products', 'transactions'],
      lastRunDetails: {
        rowsTransferred: 5432000,
        startTime: '2024-01-24T11:58:00Z',
        failurePoint: 'orders table migration'
      }
    }
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
    reportsGenerated: 42,
    metadata: {
      reportTypes: ['daily_sales', 'user_metrics', 'performance_kpi', 'revenue'],
      outputFormats: ['PDF', 'Excel'],
      distribution: {
        recipients: 15,
        channels: ['email', 'slack', 'dashboard']
      },
      templates: {
        version: 'v3.2',
        lastUpdated: '2024-01-20T10:00:00Z'
      }
    }
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
    scheduledFor: '2024-01-24T14:00:00Z',
    metadata: {
      validationRules: {
        schemaValidation: true,
        dataQuality: true,
        referentialIntegrity: true
      },
      targetDatasets: ['user_profiles', 'transaction_records', 'inventory'],
      threshold: {
        errorThreshold: 0.01,
        warningThreshold: 0.05
      }
    }
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
    filesArchived: 15600,
    metadata: {
      retentionPolicy: {
        daysToKeep: 90,
        archiveToColdStorage: true
      },
      storageStats: {
        before: '3.2 TB',
        after: '2.1 TB',
        spaceSaved: '1.1 TB'
      },
      cleanupRules: ['*.tmp', '*.log', 'temp/**', 'cache/**']
    }
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
    errorLogs: ['503 Service Unavailable from upstream API'],
    metadata: {
      sourceAPI: 'https://api.partner-service.com/v1/data',
      targetSystem: 'internal-crm',
      syncInterval: '15 minutes',
      lastSuccessfulSync: '2024-01-24T13:45:00Z',
      errorDetails: {
        statusCode: 503,
        retryAttempt: 3,
        endpoint: '/v1/data/users'
      }
    }
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
    totalImages: 10000,
    metadata: {
      processingSteps: ['resize', 'compress', 'watermark', 'optimize'],
      targetSizes: ['thumbnail', 'medium', 'large'],
      qualitySettings: {
        compression: 85,
        maxDimension: 2048,
        format: 'webp'
      },
      queueInfo: {
        pending: 5500,
        workers: 10,
        avgProcessingTime: '3.2s per image'
      }
    }
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
    backupLocation: 's3://backups/2024/01/24/',
    metadata: {
      databases: ['main_prod', 'users_db', 'analytics_db'],
      encryption: 'AES-256',
      retentionPeriod: '30 days',
      backupSchedule: 'daily at 03:00 UTC',
      verification: {
        integrityCheck: true,
        restoreTestScheduled: '2024-01-25T02:00:00Z'
      }
    }
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
    queueSize: 1250,
    metadata: {
      notificationTypes: ['email', 'sms', 'push', 'webhook'],
      priorityQueues: {
        high: 45,
        medium: 320,
        low: 885
      },
      providers: {
        email: 'sendgrid',
        sms: 'twilio',
        push: 'firebase'
      },
      rateLimits: {
        maxPerMinute: 500,
        maxPerHour: 10000
      }
    }
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
    eventsProcessed: 5000000,
    metadata: {
      eventTypes: ['page_view', 'click', 'purchase', 'signup'],
      timeRange: '2024-01-24T00:00:00Z to 2024-01-24T23:59:59Z',
      aggregations: ['daily_active_users', 'revenue', 'conversion_rate'],
      sparkConfig: {
        executors: 20,
        executorMemory: '8 GB',
        driverMemory: '4 GB'
      }
    }
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
    vulnerabilitiesFound: 3,
    metadata: {
      scanType: 'full_vulnerability_scan',
      scannerVersion: 'v2.5.1',
      targets: {
        images: ['app:v1.2.3', 'api:v2.1.0'],
        count: 2
      },
      findings: {
        critical: 0,
        high: 1,
        medium: 2,
        low: 8
      },
      compliance: {
        standards: ['CIS', 'NIST'],
        lastPassed: '2024-01-23T18:00:00Z'
      }
    }
  }
]
