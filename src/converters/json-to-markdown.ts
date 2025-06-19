import Handlebars from 'handlebars'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { DocumentType, ConversionOptions } from '@types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class JsonToMarkdownConverter {
  private templates: Map<DocumentType, HandlebarsTemplateDelegate>

  constructor() {
    this.templates = new Map()
    this.loadTemplates()
    this.registerHelpers()
  }

  private loadTemplates(): void {
    const templatesDir = join(__dirname, '../templates')

    const templateFiles: Record<DocumentType, string> = {
      'user-story': 'user-story.hbs',
      'acceptance-criteria': 'acceptance-criteria.hbs',
      'functional-requirements': 'functional-requirements.hbs',
      'bug-report': 'bug-report.hbs',
      'tech-debt': 'tech-debt.hbs',
    }

    for (const [type, filename] of Object.entries(templateFiles)) {
      try {
        const templatePath = join(templatesDir, filename)
        const templateSource = readFileSync(templatePath, 'utf8')
        const template = Handlebars.compile(templateSource)
        this.templates.set(type as DocumentType, template)
      } catch (error) {
        console.warn(`Warning: Template not found for ${type}: ${filename}`)
      }
    }
  }

  private registerHelpers(): void {
    Handlebars.registerHelper(
      'ifEquals',
      function (
        this: any,
        arg1: any,
        arg2: any,
        options: Handlebars.HelperOptions,
      ) {
        return arg1 === arg2 ? options.fn(this) : options.inverse(this)
      },
    )

    Handlebars.registerHelper('increment', function (value: number) {
      return value + 1
    })

    Handlebars.registerHelper('formatDate', function (dateString: string) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString()
    })

    Handlebars.registerHelper(
      'join',
      function (array: string[], separator: string = ', ') {
        return Array.isArray(array) ? array.join(separator) : ''
      },
    )

    Handlebars.registerHelper('upper', function (str: string) {
      return typeof str === 'string' ? str.toUpperCase() : str
    })

    Handlebars.registerHelper('lower', function (str: string) {
      return typeof str === 'string' ? str.toLowerCase() : str
    })

    Handlebars.registerHelper(
      'default',
      function (value: any, defaultValue: any) {
        return value != null ? value : defaultValue
      },
    )
  }

  convert(jsonData: any, options: ConversionOptions): string {
    const template = this.templates.get(options.templateType)
    if (!template) {
      throw new Error(
        `Template not found for document type: ${options.templateType}`,
      )
    }

    try {
      return template(jsonData)
    } catch (error) {
      throw new Error(
        `Failed to convert JSON to Markdown: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      )
    }
  }

  getAvailableTemplates(): DocumentType[] {
    return Array.from(this.templates.keys())
  }
}
