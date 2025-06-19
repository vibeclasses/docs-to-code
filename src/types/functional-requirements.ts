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
