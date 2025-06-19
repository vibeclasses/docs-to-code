export interface BaseDocument {
  id: string
  title: string
  metadata?: {
    createdBy?: string
    createdDate?: string
    lastModified?: string
    version?: string
    status?:
      | 'Draft'
      | 'Under Review'
      | 'Approved'
      | 'Implemented'
      | 'Deprecated'
  }
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  path: string
  message: string
  value?: any
}

export interface ValidationWarning {
  path: string
  message: string
  suggestion?: string
}

export interface ConversionOptions {
  templateType: DocumentType
  outputFormat: 'markdown' | 'json'
  validateOutput?: boolean
  preserveMetadata?: boolean
}

export interface ProjectStructure {
  features: string[]
  tasks: string[]
  bugs: string[]
  techDebts: string[]
  nonFunctionalRequirements: string[]
  acceptanceCriteria: string[]
}

export type DocumentType =
  | 'user-story'
  | 'acceptance-criteria'
  | 'functional-requirements'
  | 'bug-report'
  | 'tech-debt'

export interface CLIOptions {
  input?: string
  output?: string
  type?: DocumentType
  validate?: boolean
  force?: boolean
  verbose?: boolean
  watch?: boolean
}

export * from './user-story.js'
export * from './acceptance-criteria.js'
export * from './functional-requirements.js'
