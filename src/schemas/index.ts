import Ajv from 'ajv'
import * as ajvFormats from 'ajv-formats'
import { userStorySchema } from './user-story.schema.js'
import { acceptanceCriteriaSchema } from './acceptance-criteria.schema.js'
import { functionalRequirementsSchema } from './functional-requirements.schema.js'
import type { DocumentType, ValidationResult } from '../types/index.js'

export class SchemaValidator {
  private ajv: any // Using any to avoid type issues with AJV in Node.js 22
  private schemas: Map<DocumentType, any>

  constructor() {
    // Create a new Ajv instance with proper configuration
    this.ajv = new Ajv({
      allErrors: true,
      strict: false,
      strictTypes: false,
      strictTuples: false,
      strictRequired: false,
    })
    // Add format validation for date, date-time, etc.
    ajvFormats.default(this.ajv)
    this.schemas = new Map()
    this.loadSchemas()
  }

  private loadSchemas(): void {
    this.schemas.set('user-story', this.ajv.compile(userStorySchema))
    this.schemas.set(
      'acceptance-criteria',
      this.ajv.compile(acceptanceCriteriaSchema),
    )
    this.schemas.set(
      'functional-requirements',
      this.ajv.compile(functionalRequirementsSchema),
    )
  }

  validate(data: any, documentType: DocumentType): ValidationResult {
    const validator = this.schemas.get(documentType)
    if (!validator) {
      return {
        valid: false,
        errors: [
          { path: 'root', message: `Unknown document type: ${documentType}` },
        ],
        warnings: [],
      }
    }

    // For Node.js 22 compatibility, ensure we're using the right validation approach
    const valid = validator(data)

    // Debug validation errors if any
    if (!valid && validator.errors) {
      console.log(
        `Validation errors for ${documentType}:`,
        JSON.stringify(validator.errors, null, 2),
      )
    }

    const errors =
      validator.errors?.map((error: any) => ({
        path: error.instancePath || error.schemaPath,
        message: error.message || 'Validation error',
        value: error.data,
      })) || []

    const warnings = this.generateWarnings(data, documentType)

    return {
      valid,
      errors,
      warnings,
    }
  }

  private generateWarnings(data: any, documentType: DocumentType): any[] {
    const warnings: any[] = []

    // Add business logic warnings
    if (documentType === 'user-story') {
      if (!data.businessValue) {
        warnings.push({
          path: 'businessValue',
          message: 'Business value not specified',
          suggestion: 'Consider adding business value to justify the story',
        })
      }

      if (
        data.storyPoints &&
        typeof data.storyPoints === 'number' &&
        data.storyPoints > 13
      ) {
        warnings.push({
          path: 'storyDetails.storyPoints',
          message: 'Story points exceed recommended maximum',
          suggestion: 'Consider breaking this story into smaller pieces',
        })
      }
    }

    return warnings
  }
}

export {
  userStorySchema,
  acceptanceCriteriaSchema,
  functionalRequirementsSchema,
}
