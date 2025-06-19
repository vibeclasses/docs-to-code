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
