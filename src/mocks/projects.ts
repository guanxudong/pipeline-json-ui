import type { Project } from '../types/api'

export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    projectId: 'proj-001',
    name: 'E-Commerce Platform',
    projectType: 'java-17',
    status: 'active',
    repository: 'github.com/company/ecommerce',
    language: 'TypeScript',
    createdAt: '2024-01-20T08:00:00Z',
    lastUpdate: '2024-01-24T10:30:00Z',
    lastDeployed: '2024-01-24T10:00:00Z',
    team: 'frontend',
    metadata: {
      stack: {
        framework: 'Next.js 14',
        stateManagement: 'Zustand',
        styling: 'Tailwind CSS',
        testing: 'Jest + React Testing Library'
      },
      deployment: {
        platform: 'Vercel',
        environment: 'production',
        region: 'us-east-1',
        customDomain: 'shop.company.com'
      },
      metrics: {
        dailyActiveUsers: 45000,
        pageLoadTime: '1.2s',
        uptime: '99.9%'
      }
    }
  },
  {
    id: 'proj-002',
    projectId: 'proj-002',
    name: 'Payment Service',
    projectType: 'java-11',
    status: 'deploying',
    repository: 'github.com/company/payment',
    language: 'Go',
    createdAt: '2024-01-18T14:30:00Z',
    lastUpdate: '2024-01-24T15:15:00Z',
    replicas: 3,
    cpuUsage: '45%',
    metadata: {
      apiEndpoints: {
        base: '/api/v1/payments',
        routes: ['charge', 'refund', 'webhook', 'status'],
        version: 'v1.2.0'
      },
      integration: {
        paymentGateways: ['Stripe', 'PayPal'],
        currencies: ['USD', 'EUR', 'GBP', 'JPY'],
        pciCompliance: true
      },
      infrastructure: {
        cluster: 'prod-cluster-east',
        namespace: 'payments',
        resourceLimits: {
          cpu: '2000m',
          memory: '4Gi'
        }
      }
    }
  },
  {
    id: 'proj-003',
    projectId: 'proj-003',
    name: 'Analytics Dashboard',
    projectType: 'python-3.6',
    status: 'active',
    repository: 'github.com/company/analytics',
    language: 'Python',
    createdAt: '2024-01-22T11:00:00Z',
    lastUpdate: '2024-01-24T12:45:00Z',
    charts: 24,
    dataSources: 8,
    metadata: {
      techStack: {
        frontend: 'React + D3.js',
        backend: 'FastAPI',
        database: 'PostgreSQL',
        cache: 'Redis'
      },
      dataPipeline: {
        sources: ['Snowflake', 'BigQuery', 'MongoDB'],
        refreshInterval: '15 minutes',
        dataWarehouse: 'Snowflake'
      },
      features: {
        realTimeUpdates: true,
        exportOptions: ['CSV', 'PDF', 'Excel'],
        customDashboards: 12,
        scheduledReports: 8
      }
    }
  },
  {
    id: 'proj-004',
    projectId: 'proj-004',
    name: 'User Management API',
    projectType: 'node-22',
    status: 'error',
    repository: 'github.com/company/user-api',
    language: 'Node.js',
    createdAt: '2024-01-19T09:15:00Z',
    lastUpdate: '2024-01-24T09:30:00Z',
    errorRate: '2.3%',
    lastError: 'Database connection timeout',
    metadata: {
      apiSpec: {
        openApiVersion: '3.0.0',
        baseUrl: 'https://api.company.com/users',
        endpoints: 42,
        authentication: 'JWT Bearer Token'
      },
      dependencies: {
        database: 'PostgreSQL 15',
        cache: 'Redis 7',
        messageQueue: 'RabbitMQ'
      },
      health: {
        lastIncident: '2024-01-24T10:15:00Z',
        incidentDuration: '23 minutes',
        resolvedAt: '2024-01-24T10:38:00Z',
        sla: '99.5%'
      }
    }
  },
  {
    id: 'proj-005',
    projectId: 'proj-005',
    name: 'Mobile App Backend',
    projectType: 'java-11',
    status: 'configuring',
    repository: 'github.com/company/mobile-api',
    language: 'Java',
    createdAt: '2024-01-23T16:45:00Z',
    lastUpdate: '2024-01-24T17:15:00Z',
    endpoints: 42,
    scheduledFor: '2024-01-25T09:00:00Z',
    metadata: {
      platforms: {
        ios: true,
        android: true,
        version: '2.5.0'
      },
      services: {
        pushNotifications: 'Firebase',
        authentication: 'Auth0',
        storage: 'AWS S3',
        cdn: 'CloudFront'
      },
      api: {
        protocol: 'REST + GraphQL',
        rateLimit: '1000 req/min',
        compression: 'gzip',
        tlsVersion: '1.3'
      }
    }
  },
  {
    id: 'proj-006',
    projectId: 'proj-006',
    name: 'Notification Service',
    projectType: 'dotNet-18',
    status: 'active',
    repository: 'github.com/company/notifications',
    language: 'Rust',
    createdAt: '2024-01-21T13:20:00Z',
    lastUpdate: '2024-01-24T14:50:00Z',
    throughput: '50K msg/min',
    metadata: {
      providers: {
        email: 'SendGrid',
        sms: 'Twilio',
        push: 'Firebase Cloud Messaging',
        webhook: 'Custom'
      },
      queues: {
        priority: 'Redis Sorted Sets',
        bulk: 'RabbitMQ',
        deadLetter: 'SQS'
      },
      configuration: {
        templates: 150,
        languages: ['en', 'es', 'fr', 'de', 'ja'],
        retryPolicy: 'exponential backoff',
        maxRetries: 5
      }
    }
  },
  {
    id: 'proj-007',
    projectId: 'proj-007',
    name: 'Data Pipeline',
    projectType: 'python-3.6',
    status: 'processing',
    repository: 'github.com/company/data-pipeline',
    language: 'Scala',
    createdAt: '2024-01-17T10:00:00Z',
    lastUpdate: '2024-01-24T11:20:00Z',
    clusterSize: '10 nodes',
    metadata: {
      framework: 'Apache Spark 3.5',
      processing: {
        batchJobs: 12,
        streamingJobs: 3,
        dataLake: 's3://company-data-lake/',
        warehouse: 'Snowflake'
      },
      resources: {
        executors: 20,
        executorMemory: '16GB',
        driverMemory: '8GB',
        totalCores: 160
      },
      monitoring: {
        metrics: 'Prometheus',
        logs: 'ELK Stack',
        alerts: 'PagerDuty'
      }
    }
  },
  {
    id: 'proj-008',
    projectId: 'proj-008',
    name: 'Admin Portal',
    projectType: 'java-17',
    status: 'active',
    repository: 'github.com/company/admin',
    language: 'React',
    createdAt: '2024-01-22T15:30:00Z',
    lastUpdate: '2024-01-24T16:45:00Z',
    pages: 18,
    users: 1250,
    metadata: {
      features: {
        userManagement: true,
        roleBasedAccess: true,
        auditLogs: true,
        settings: true
      },
      security: {
        mfaEnabled: true,
        sessionTimeout: '30 minutes',
        passwordPolicy: 'min 12 chars, mixed case',
        auditTrail: true
      },
      integration: {
        sso: 'Okta',
        ldap: 'Active Directory',
        apiClients: 15
      }
    }
  }
]
