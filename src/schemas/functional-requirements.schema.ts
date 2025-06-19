import { BaseDocument } from '@types'

export interface FunctionalRequirement extends BaseDocument {
  requirementStatement: {
    relatedEpic?: string
    userStoryLink?: string
    priority: 'Must Have' | 'Should Have' | 'Could Have' | "Won't Have"
    complexity: 'Low' | 'Medium' | 'High'
    userStoryFormat: {
      userType: string
      capability: string
      benefit: string
    }
    functionalDescription: string
  }
  detailedSpecifications: {
    inputRequirements: Array<{
      element: string
      dataType: string
      format: string
      validationRules: string
      source: string
    }>
    processingRequirements: Array<{
      step: string
      description: string
      conditions?: string
    }>
    outputRequirements: Array<{
      element: string
      dataType: string
      format: string
      destination: string
      timing: string
    }>
  }
  businessRules: {
    businessLogicRules?: Array<{
      category: string
      rule: string
    }>
    dataConstraints?: Array<{
      dataElement: string
      constraints: string
    }>
    workflowRules?: Array<{
      processStep: string
      requirements: string
    }>
  }
  examples?: Array<{
    title: string
    input: string
    processing: string
    output: string
  }>
  acceptanceCriteria: Array<{
    flow: string
    given: string
    when: string
    then: string
    and?: string[]
  }>
  traceabilityLinks?: {
    upstream?: Array<{
      type: string
      id: string
      description: string
    }>
    downstream?: Array<{
      type: string
      id: string
      description: string
    }>
    related?: Array<{
      type: string
      id: string
      relationship: string
    }>
  }
  nonFunctionalConsiderations?: {
    performance?: string
    security?: string
    usability?: string
    reliability?: string
  }
  verificationCriteria?: Array<{
    type: string
    criteria: string
    completed: boolean
  }>
  changeHistory?: Array<{
    date: string
    version: string
    description: string
    changedBy: string
  }>
}

// JSON Schema for validation
export const functionalRequirementsSchema = {
  type: 'object',
  required: [
    'requirementStatement',
    'detailedSpecifications',
    'businessRules',
    'acceptanceCriteria',
  ],
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    version: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    requirementStatement: {
      type: 'object',
      required: [
        'priority',
        'complexity',
        'userStoryFormat',
        'functionalDescription',
      ],
      properties: {
        relatedEpic: { type: 'string' },
        userStoryLink: { type: 'string' },
        priority: {
          type: 'string',
          enum: ['Must Have', 'Should Have', 'Could Have', "Won't Have"],
        },
        complexity: {
          type: 'string',
          enum: ['Low', 'Medium', 'High'],
        },
        userStoryFormat: {
          type: 'object',
          required: ['userType', 'capability', 'benefit'],
          properties: {
            userType: { type: 'string' },
            capability: { type: 'string' },
            benefit: { type: 'string' },
          },
        },
        functionalDescription: { type: 'string' },
      },
    },
    detailedSpecifications: {
      type: 'object',
      required: [
        'inputRequirements',
        'processingRequirements',
        'outputRequirements',
      ],
      properties: {
        inputRequirements: {
          type: 'array',
          items: {
            type: 'object',
            required: [
              'element',
              'dataType',
              'format',
              'validationRules',
              'source',
            ],
            properties: {
              element: { type: 'string' },
              dataType: { type: 'string' },
              format: { type: 'string' },
              validationRules: { type: 'string' },
              source: { type: 'string' },
            },
          },
        },
        processingRequirements: {
          type: 'array',
          items: {
            type: 'object',
            required: ['step', 'description'],
            properties: {
              step: { type: 'string' },
              description: { type: 'string' },
              conditions: { type: 'string' },
            },
          },
        },
        outputRequirements: {
          type: 'array',
          items: {
            type: 'object',
            required: [
              'element',
              'dataType',
              'format',
              'destination',
              'timing',
            ],
            properties: {
              element: { type: 'string' },
              dataType: { type: 'string' },
              format: { type: 'string' },
              destination: { type: 'string' },
              timing: { type: 'string' },
            },
          },
        },
      },
    },
    businessRules: {
      type: 'object',
      properties: {
        businessLogicRules: {
          type: 'array',
          items: {
            type: 'object',
            required: ['category', 'rule'],
            properties: {
              category: { type: 'string' },
              rule: { type: 'string' },
            },
          },
        },
        dataConstraints: {
          type: 'array',
          items: {
            type: 'object',
            required: ['dataElement', 'constraints'],
            properties: {
              dataElement: { type: 'string' },
              constraints: { type: 'string' },
            },
          },
        },
        workflowRules: {
          type: 'array',
          items: {
            type: 'object',
            required: ['processStep', 'requirements'],
            properties: {
              processStep: { type: 'string' },
              requirements: { type: 'string' },
            },
          },
        },
      },
    },
    examples: {
      type: 'array',
      items: {
        type: 'object',
        required: ['title', 'input', 'processing', 'output'],
        properties: {
          title: { type: 'string' },
          input: { type: 'string' },
          processing: { type: 'string' },
          output: { type: 'string' },
        },
      },
    },
    acceptanceCriteria: {
      type: 'array',
      items: {
        type: 'object',
        required: ['flow', 'given', 'when', 'then'],
        properties: {
          flow: { type: 'string' },
          given: { type: 'string' },
          when: { type: 'string' },
          then: { type: 'string' },
          and: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
    traceabilityLinks: {
      type: 'object',
      properties: {
        upstream: {
          type: 'array',
          items: {
            type: 'object',
            required: ['type', 'id', 'description'],
            properties: {
              type: { type: 'string' },
              id: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
        downstream: {
          type: 'array',
          items: {
            type: 'object',
            required: ['type', 'id', 'description'],
            properties: {
              type: { type: 'string' },
              id: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
        related: {
          type: 'array',
          items: {
            type: 'object',
            required: ['type', 'id', 'relationship'],
            properties: {
              type: { type: 'string' },
              id: { type: 'string' },
              relationship: { type: 'string' },
            },
          },
        },
      },
    },
    nonFunctionalConsiderations: {
      type: 'object',
      properties: {
        performance: { type: 'string' },
        security: { type: 'string' },
        usability: { type: 'string' },
        reliability: { type: 'string' },
      },
    },
    verificationCriteria: {
      type: 'array',
      items: {
        type: 'object',
        required: ['type', 'criteria', 'completed'],
        properties: {
          type: { type: 'string' },
          criteria: { type: 'string' },
          completed: { type: 'boolean' },
        },
      },
    },
    changeHistory: {
      type: 'array',
      items: {
        type: 'object',
        required: ['date', 'version', 'description', 'changedBy'],
        properties: {
          date: { type: 'string' },
          version: { type: 'string' },
          description: { type: 'string' },
          changedBy: { type: 'string' },
        },
      },
    },
  },
}
