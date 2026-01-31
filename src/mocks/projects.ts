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
  },
  {
    id: 'proj-009',
    projectId: 'proj-009',
    name: 'Search Service',
    projectType: 'java-11',
    status: 'active',
    repository: 'github.com/company/search',
    language: 'Go',
    createdAt: '2024-01-16T08:15:00Z',
    lastUpdate: '2024-01-24T18:20:00Z',
    indexSize: '2.5TB',
    queryLatency: '15ms',
    metadata: {
      engine: 'Elasticsearch 8.11',
      indices: {
        products: '500K docs',
        users: '2M docs',
        orders: '10M docs'
      },
      features: {
        fuzzyMatching: true,
        autoComplete: true,
        facetedSearch: true,
        synonyms: true
      },
      scaling: {
        nodes: 6,
        shards: 30,
        replicas: 2
      }
    }
  },
  {
    id: 'proj-010',
    projectId: 'proj-010',
    name: 'Image Processing Service',
    projectType: 'python-3.6',
    status: 'deploying',
    repository: 'github.com/company/image-proc',
    language: 'Python',
    createdAt: '2024-01-25T09:00:00Z',
    lastUpdate: '2024-01-24T20:10:00Z',
    processingRate: '1000 images/min',
    metadata: {
      capabilities: {
        resize: true,
        compress: true,
        watermark: true,
        formatConvert: true
      },
      mlModels: {
        objectDetection: 'YOLO v8',
        faceRecognition: 'OpenCV',
        qualityAssessment: 'Custom CNN'
      },
      storage: {
        raw: 'AWS S3',
        processed: 'Cloudflare R2',
        cdn: 'CloudFront'
      }
    }
  },
  {
    id: 'proj-011',
    projectId: 'proj-011',
    name: 'Chat Application',
    projectType: 'node-22',
    status: 'active',
    repository: 'github.com/company/chat',
    language: 'TypeScript',
    createdAt: '2024-01-14T11:30:00Z',
    lastUpdate: '2024-01-24T19:45:00Z',
    activeUsers: 15000,
    messagesPerDay: '2.5M',
    metadata: {
      realtime: {
        protocol: 'WebSocket',
        fallback: 'Server-Sent Events',
        presence: true
      },
      features: {
        typing: true,
        readReceipts: true,
        fileSharing: true,
        reactions: true
      },
      moderation: {
        spamFilter: true,
        profanityFilter: true,
        autoModeration: true
      }
    }
  },
  {
    id: 'proj-012',
    projectId: 'proj-012',
    name: 'Inventory Management',
    projectType: 'dotNet-18',
    status: 'error',
    repository: 'github.com/company/inventory',
    language: 'C#',
    createdAt: '2024-01-13T14:20:00Z',
    lastUpdate: '2024-01-24T21:30:00Z',
    syncErrors: 15,
    lastError: 'ERP API rate limit exceeded',
    metadata: {
      integrations: {
        erp: 'SAP',
        warehouse: 'NetSuite',
        suppliers: 45,
        marketplaces: ['Amazon', 'eBay', 'Walmart']
      },
      tracking: {
        skus: 50000,
        warehouses: 8,
        autoReorder: true,
        barcodeScanning: true
      },
      alerts: {
        lowStock: true,
        overstock: true,
        expiryDates: true
      }
    }
  },
  {
    id: 'proj-013',
    projectId: 'proj-013',
    name: 'Recommendation Engine',
    projectType: 'python-3.6',
    status: 'processing',
    repository: 'github.com/company/recommendations',
    language: 'Python',
    createdAt: '2024-01-12T10:45:00Z',
    lastUpdate: '2024-01-24T22:15:00Z',
    modelVersion: 'v3.2.1',
    trainingProgress: '65%',
    metadata: {
      mlFramework: 'PyTorch 2.1',
      algorithms: {
        collaborative: 'Matrix Factorization',
        contentBased: 'TF-IDF',
        deepLearning: 'Neural Collaborative Filtering'
      },
      data: {
        users: 2.5,
        items: 500000,
        interactions: '50M',
        features: 1200
      },
      performance: {
        latency: '50ms',
        throughput: '10K req/s',
        accuracy: '0.87'
      }
    }
  },
  {
    id: 'proj-014',
    projectId: 'proj-014',
    name: 'Email Marketing Platform',
    projectType: 'java-17',
    status: 'configuring',
    repository: 'github.com/company/email-platform',
    language: 'Java',
    createdAt: '2024-01-26T13:00:00Z',
    lastUpdate: '2024-01-24T23:00:00Z',
    subscriberCount: 850000,
    metadata: {
      features: {
        automation: true,
        aBTesting: true,
        segmentation: true,
        personalization: true
      },
      templates: {
        total: 250,
        responsive: true,
        dragDrop: true
      },
      deliverability: {
        inboxRate: '98.5%',
        spamScore: 2,
        bounceRate: '0.3%'
      }
    }
  },
  {
    id: 'proj-015',
    projectId: 'proj-015',
    name: 'Video Streaming Service',
    projectType: 'node-22',
    status: 'active',
    repository: 'github.com/company/video-stream',
    language: 'TypeScript',
    createdAt: '2024-01-11T09:30:00Z',
    lastUpdate: '2024-01-25T00:15:00Z',
    concurrentStreams: 5000,
    metadata: {
      streaming: {
        protocol: 'HLS + DASH',
        adaptiveBitrate: true,
        drm: 'Widevine + FairPlay',
        cdn: 'Akamai'
      },
      encoding: {
        codecs: ['H.264', 'H.265', 'VP9'],
        resolutions: ['480p', '720p', '1080p', '4K'],
        frameRate: '60fps'
      },
      analytics: {
        watchTime: '2.5 hours/day',
        completionRate: '72%',
        rebufferRate: '0.1%'
      }
    }
  },
  {
    id: 'proj-016',
    projectId: 'proj-016',
    name: 'Payment Gateway',
    projectType: 'java-11',
    status: 'active',
    repository: 'github.com/company/gateway',
    language: 'Java',
    createdAt: '2024-01-10T15:45:00Z',
    lastUpdate: '2024-01-25T01:30:00Z',
    transactionsPerSecond: 2500,
    metadata: {
      security: {
        pciDss: 'Level 1',
        encryption: 'AES-256',
        tokenization: true,
        fraudDetection: true
      },
      methods: {
        creditCards: ['Visa', 'Mastercard', 'Amex'],
        digitalWallets: ['Apple Pay', 'Google Pay'],
        bankTransfer: true,
        crypto: ['BTC', 'ETH']
      },
      uptime: {
        sla: '99.99%',
        lastOutage: '2024-01-01',
        regions: ['US', 'EU', 'APAC']
      }
    }
  },
  {
    id: 'proj-017',
    projectId: 'proj-017',
    name: 'Document Collaboration',
    projectType: 'dotNet-18',
    status: 'active',
    repository: 'github.com/company/docs-collab',
    language: 'C#',
    createdAt: '2024-01-09T11:20:00Z',
    lastUpdate: '2024-01-25T02:45:00Z',
    activeEditors: 3200,
    metadata: {
      editing: {
        realTime: true,
        conflictResolution: 'Operational Transform',
        versioning: true,
        comments: true
      },
      formats: {
        supported: ['docx', 'pdf', 'txt', 'md'],
        import: true,
        export: true,
        templates: 150
      },
      collaboration: {
        permissions: ['view', 'comment', 'edit'],
        sharing: true,
        auditLog: true
      }
    }
  },
  {
    id: 'proj-018',
    projectId: 'proj-018',
    name: 'IoT Device Manager',
    projectType: 'python-3.6',
    status: 'deploying',
    repository: 'github.com/company/iot-manager',
    language: 'Python',
    createdAt: '2024-01-08T08:00:00Z',
    lastUpdate: '2024-01-25T03:20:00Z',
    connectedDevices: 45000,
    metadata: {
      protocols: {
        mqtt: true,
        coap: true,
        http: true,
        lora: true
      },
      management: {
        ota: true,
        monitoring: true,
        fleet: true,
        diagnostics: true
      },
      security: {
        deviceAuth: 'X.509',
        encryption: 'TLS 1.3',
        secureBoot: true
      }
    }
  },
  {
    id: 'proj-019',
    projectId: 'proj-019',
    name: 'API Gateway',
    projectType: 'go-1.21',
    status: 'active',
    repository: 'github.com/company/api-gateway',
    language: 'Go',
    createdAt: '2024-01-07T14:00:00Z',
    lastUpdate: '2024-01-25T04:00:00Z',
    requestsPerSecond: 50000,
    metadata: {
      routing: {
        loadBalancing: 'Round Robin',
        healthChecks: true,
        circuitBreaker: true,
        retries: 3
      },
      security: {
        rateLimiting: true,
        apiKey: true,
        oauth2: true,
        ipWhitelist: true
      },
      monitoring: {
        latency: '5ms',
        caching: 'Redis',
        logs: true,
        metrics: true
      }
    }
  },
  {
    id: 'proj-020',
    projectId: 'proj-020',
    name: 'Logging & Monitoring',
    projectType: 'node-22',
    status: 'active',
    repository: 'github.com/company/logging',
    language: 'TypeScript',
    createdAt: '2024-01-06T10:30:00Z',
    lastUpdate: '2024-01-25T05:15:00Z',
    logsPerDay: '2TB',
    metadata: {
      collection: {
        agents: 'Fluent Bit',
        buffering: true,
        compression: 'gzip',
        batchSize: 1000
      },
      storage: {
        hot: 'Elasticsearch',
        warm: 'S3',
        cold: 'Glacier',
        retention: '90 days'
      },
      visualization: {
        dashboards: 45,
        alerts: 120,
        queries: 'KQL',
        realTime: true
      }
    }
  }
]
