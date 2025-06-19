import { BaseDocument } from '@types'

export interface AcceptanceCriteria extends BaseDocument {
  userStoryId: string
  scenarios: Array<{
    id: string
    title: string
    type: 'happy_path' | 'alternative' | 'error' | 'edge_case'
    priority?: 'Critical' | 'High' | 'Medium' | 'Low'
    given: string
    when: string
    then: string
    and?: string[]
  }>
  crossScenarioRequirements?: {
    performance?: string[]
    accessibility?: string[]
    responsive?: string[]
    browserSupport?: string[]
    security?: string[]
  }
  dataValidationRules?: Array<{
    field: string
    rules: string[]
    errorMessages?: string[]
  }>
  integrationRequirements?: {
    externalAPIs?: Array<{
      api: string
      calls: string[]
      expectedResponses: string[]
    }>
    database?: string[]
    notifications?: Array<{
      trigger: string
      recipients: string[]
      method: string
    }>
  }
}

// JSON Schema for validation
export const acceptanceCriteriaSchema = {
  type: 'object',
  required: ['userStoryId', 'scenarios'],
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    version: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    userStoryId: { type: 'string' },
    scenarios: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'title', 'type', 'given', 'when', 'then'],
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          type: {
            type: 'string',
            enum: ['happy_path', 'alternative', 'error', 'edge_case'],
          },
          priority: {
            type: 'string',
            enum: ['Critical', 'High', 'Medium', 'Low'],
          },
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
    crossScenarioRequirements: {
      type: 'object',
      properties: {
        performance: {
          type: 'array',
          items: { type: 'string' },
        },
        accessibility: {
          type: 'array',
          items: { type: 'string' },
        },
        responsive: {
          type: 'array',
          items: { type: 'string' },
        },
        browserSupport: {
          type: 'array',
          items: { type: 'string' },
        },
        security: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  },
}
