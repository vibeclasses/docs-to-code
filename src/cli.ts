#!/usr/bin/env node

import { Command } from 'commander'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname, basename } from 'path'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import { glob } from 'glob'

import { JsonToMarkdownConverter } from './converters/json-to-markdown.js'
import { MarkdownToJsonConverter } from './converters/markdown-to-json.js'
import { SchemaValidator } from './schemas/index.js'
import { ProjectStructureGenerator } from './generators/folder-structure.js'
import type { DocumentType, CLIOptions } from './types/index.js'

// Update CLIOptions interface if it doesn't include exclude property
declare module './types/index.js' {
  interface CLIOptions {
    output?: string
    verbose?: boolean
    validate?: boolean
    type?: DocumentType
    exclude?: string
  }
}

const program = new Command()

class DocsToCodeCLI {
  private jsonToMdConverter: JsonToMarkdownConverter
  private mdToJsonConverter: MarkdownToJsonConverter
  private validator: SchemaValidator
  private structureGenerator: ProjectStructureGenerator

  constructor() {
    this.jsonToMdConverter = new JsonToMarkdownConverter()
    this.mdToJsonConverter = new MarkdownToJsonConverter()
    this.validator = new SchemaValidator()
    this.structureGenerator = new ProjectStructureGenerator()
  }

  async init(options: CLIOptions): Promise<void> {
    const spinner = ora(
      'Initializing Agile Documentation project structure',
    ).start()

    try {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Project name:',
          default: basename(process.cwd()),
        },
        {
          type: 'confirm',
          name: 'createExamples',
          message: 'Create example documents?',
          default: true,
        },
        {
          type: 'checkbox',
          name: 'documentTypes',
          message: 'Select document types to include:',
          choices: [
            { name: 'User Stories', value: 'user-story', checked: true },
            {
              name: 'Acceptance Criteria',
              value: 'acceptance-criteria',
              checked: true,
            },
            {
              name: 'Functional Requirements',
              value: 'functional-requirements',
              checked: true,
            },
            { name: 'Bug Reports', value: 'bug-report', checked: false },
            { name: 'Technical Debt', value: 'tech-debt', checked: false },
          ],
        },
      ])

      await this.structureGenerator.generateProject({
        projectName: answers.projectName,
        createExamples: answers.createExamples,
        documentTypes: answers.documentTypes,
        outputPath: options.output || process.cwd(),
      })

      spinner.succeed(
        chalk.green('Project structure initialized successfully!'),
      )

      console.log(chalk.blue('\nNext steps:'))
      console.log('1. Add your JSON documents to the appropriate folders')
      console.log('2. Run `docs-to-code validate` to check your documents')
      console.log(
        '3. Run `docs-to-code convert` to generate markdown documentation',
      )
    } catch (error: unknown) {
      spinner.fail(chalk.red('Failed to initialize project'))
      console.error(error)
      process.exit(1)
    }
  }

  async validate(
    pattern: string = '**/*.json',
    options: CLIOptions,
  ): Promise<void> {
    const spinner = ora('Validating documents').start()

    try {
      // Use exclude pattern if provided
      const globOptions = { 
        cwd: process.cwd(),
        ignore: options.exclude ? [options.exclude] : ['node_modules/**']
      }
      
      // Get all files matching the pattern
      const allFiles = await glob(pattern, globOptions)
      
      // Filter out common configuration files
      const configFilesToIgnore = [
        'package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.*.json',
        '.eslintrc.json', '.prettierrc.json', 'drizzle.config.ts', 'jest.config.json'
      ]
      
      const files = allFiles.filter(file => {
        const filename = basename(file)
        // Skip configuration files
        return !configFilesToIgnore.some(pattern => {
          if (pattern.includes('*')) {
            // Simple wildcard matching for patterns like tsconfig.*.json
            const regex = new RegExp('^' + pattern.replace('*', '.*') + '$')
            return regex.test(filename)
          }
          return filename === pattern
        })
      })
      
      let totalFiles = 0
      let validFiles = 0
      let errors: string[] = []

      for (const file of files) {
        totalFiles++
        const content = readFileSync(file, 'utf8')

        try {
          const data = JSON.parse(content)
          const documentType = this.detectDocumentType(data)

          if (documentType) {
            const result = this.validator.validate(data, documentType)

            if (result.valid) {
              validFiles++
              if (options.verbose) {
                console.log(chalk.green(`✓ ${file}`))
              }
            } else {
              errors.push(
                `${file}: ${result.errors.map((e: { message: string }) => e.message).join(', ')}`,
              )
              if (options.verbose) {
                console.log(chalk.red(`✗ ${file}`))
                result.errors.forEach((error: { path: string; message: string }) => {
                  console.log(chalk.red(`  - ${error.path}: ${error.message}`))
                })
              }
            }

            // Show warnings if verbose
            if (options.verbose && result.warnings.length > 0) {
              result.warnings.forEach((warning: { path: string; message: string }) => {
                console.log(
                  chalk.yellow(`  ⚠ ${warning.path}: ${warning.message}`),
                )
              })
            }
          } else {
            errors.push(`${file}: Could not detect document type`)
          }
        } catch (parseError: unknown) {
          errors.push(`${file}: Invalid JSON format`)
        }
      }

      spinner.stop()

      if (errors.length === 0) {
        console.log(chalk.green(`✓ All ${totalFiles} documents are valid`))
      } else {
        console.log(chalk.red(`✗ ${errors.length} validation errors found:`))
        errors.forEach((error) => console.log(chalk.red(`  ${error}`)))
        process.exit(1)
      }
    } catch (error: unknown) {
      spinner.fail(chalk.red('Validation failed'))
      console.error(error)
      process.exit(1)
    }
  }

  async convert(
    inputPattern: string = '**/*.json',
    options: CLIOptions,
  ): Promise<void> {
    const spinner = ora('Converting documents').start()

    try {
      // Use exclude pattern if provided
      const globOptions = { 
        cwd: process.cwd(),
        ignore: options.exclude ? [options.exclude] : ['node_modules/**']
      }
      const files = await glob(inputPattern, globOptions)
      let convertedCount = 0

      for (const file of files) {
        const content = readFileSync(file, 'utf8')
        const data = JSON.parse(content)
        const documentType = this.detectDocumentType(data)

        if (!documentType) {
          console.warn(
            chalk.yellow(`Skipping ${file}: Could not detect document type`),
          )
          continue
        }

        // Validate before conversion if requested
        if (options.validate) {
          const result = this.validator.validate(data, documentType)
          if (!result.valid) {
            console.error(chalk.red(`Skipping ${file}: Validation failed`))
            continue
          }
        }

        const outputDir = options.output || dirname(file)
        const outputFile = join(outputDir, basename(file, '.json') + '.md')

        // Ensure output directory exists
        mkdirSync(dirname(outputFile), { recursive: true })

        const markdown = this.jsonToMdConverter.convert(data, {
          templateType: documentType,
          outputFormat: 'markdown',
        })

        writeFileSync(outputFile, markdown)
        convertedCount++

        if (options.verbose) {
          console.log(chalk.green(`Converted: ${file} → ${outputFile}`))
        }
      }

      spinner.succeed(
        chalk.green(`Converted ${convertedCount} documents to Markdown`),
      )
    } catch (error: unknown) {
      spinner.fail(chalk.red('Conversion failed'))
      console.error(error)
      process.exit(1)
    }
  }

  async convertBack(
    inputPattern: string = '**/*.md',
    options: CLIOptions,
  ): Promise<void> {
    const spinner = ora('Converting Markdown to JSON').start()

    try {
      // Use exclude pattern if provided
      const globOptions = { 
        cwd: process.cwd(),
        ignore: options.exclude ? [options.exclude] : ['node_modules/**']
      }
      const files = await glob(inputPattern, globOptions)
      let convertedCount = 0

      for (const file of files) {
        const content = readFileSync(file, 'utf8')

        // Try to detect document type from markdown content
        const documentType =
          this.detectDocumentTypeFromMarkdown(content) || options.type

        if (!documentType) {
          console.warn(
            chalk.yellow(
              `Skipping ${file}: Could not detect document type. Use --type option.`,
            ),
          )
          continue
        }

        const jsonData = this.mdToJsonConverter.convert(content, documentType)

        // Validate converted JSON if requested
        if (options.validate) {
          const result = this.validator.validate(jsonData, documentType)
          if (!result.valid) {
            console.error(chalk.red(`Validation failed for ${file}:`))
            result.errors.forEach((error: { path: string; message: string }) => {
              console.error(chalk.red(`  - ${error.path}: ${error.message}`))
            })
            continue
          }
        }

        const outputDir = options.output || dirname(file)
        const outputFile = join(outputDir, basename(file, '.md') + '.json')

        // Ensure output directory exists
        mkdirSync(dirname(outputFile), { recursive: true })

        writeFileSync(outputFile, JSON.stringify(jsonData, null, 2))
        convertedCount++

        if (options.verbose) {
          console.log(chalk.green(`Converted: ${file} → ${outputFile}`))
        }
      }

      spinner.succeed(
        chalk.green(`Converted ${convertedCount} Markdown documents to JSON`),
      )
    } catch (error: unknown) {
      spinner.fail(chalk.red('Conversion failed'))
      console.error(error)
      process.exit(1)
    }
  }

  async build(options: CLIOptions): Promise<void> {
    const spinner = ora('Building complete documentation site').start()

    try {
      // Convert all JSON to Markdown
      await this.convert('**/*.json', { ...options, validate: true })

      // Generate main index file
      await this.structureGenerator.generateMainIndex()

      // Generate cross-reference links
      if (options.verbose) {
        await this.generateCrossReferences()
      }

      spinner.succeed(chalk.green('Documentation site built successfully!'))
    } catch (error: unknown) {
      spinner.fail(chalk.red('Build failed'))
      console.error(error)
      process.exit(1)
    }
  }

  private detectDocumentType(data: Record<string, unknown>): DocumentType | null {
    if (data.storyStatement && data.userContext) return 'user-story'
    if (data.scenarios && data.userStoryId) return 'acceptance-criteria'
    if (data.requirementStatement && data.detailedSpecifications)
      return 'functional-requirements'
    if (data.bugDescription && data.stepsToReproduce) return 'bug-report'
    if (data.debtDescription && data.technicalImpact) return 'tech-debt'
    return null
  }
  private detectDocumentTypeFromMarkdown(content: string): DocumentType | null {
    if (content.includes('## Story Statement') && content.includes('**As a**'))
      return 'user-story'
    if (content.includes('## Scenarios') && content.includes('**Given**'))
      return 'acceptance-criteria'
    if (
      content.includes('## Detailed Specifications') &&
      content.includes('Input Requirements')
    )
      return 'functional-requirements'
    return null
  }

  private async generateCrossReferences(): Promise<void> {
    // Implementation for generating cross-references between documents
    console.log(chalk.blue('Generating cross-references...'))
    // TODO: Implement cross-reference generation
  }
}

// CLI Command Setup
const cli = new DocsToCodeCLI()

program
  .name('docs-to-code')
  .description('Complete toolkit for managing Agile documentation')
  .version('1.0.0')

program
  .command('init')
  .description('Initialize documentation project structure')
  .option('-o, --output <path>', 'Output directory', process.cwd())
  .action(async (options: CLIOptions) => {
    await cli.init(options)
  })

program
  .command('validate')
  .description('Validate JSON documents against schemas')
  .argument('[pattern]', 'File pattern to validate', '**/*.json')
  .option('-v, --verbose', 'Verbose output')
  .option('--exclude <pattern>', 'Exclude pattern (e.g., node_modules)', 'node_modules/**')
  .action(async (pattern: string, options: CLIOptions) => {
    await cli.validate(pattern, options)
  })

program
  .command('convert')
  .description('Convert JSON documents to Markdown')
  .argument('[pattern]', 'Input file pattern', '**/*.json')
  .option('-o, --output <path>', 'Output directory')
  .option('-v, --verbose', 'Verbose output')
  .option('--validate', 'Validate before conversion')
  .option('--exclude <pattern>', 'Exclude pattern (e.g., node_modules)', 'node_modules/**')
  .action(async (pattern: string, options: CLIOptions) => {
    await cli.convert(pattern, options)
  })

program
  .command('convert-back')
  .description('Convert Markdown documents to JSON')
  .argument('[pattern]', 'Input file pattern', '**/*.md')
  .option('-o, --output <path>', 'Output directory')
  .option('-t, --type <type>', 'Document type for conversion')
  .option('-v, --verbose', 'Verbose output')
  .option('--validate', 'Validate after conversion')
  .option('--exclude <pattern>', 'Exclude pattern (e.g., node_modules)', 'node_modules/**')
  .action(async (pattern: string, options: CLIOptions) => {
    await cli.convertBack(pattern, options)
  })

program
  .command('build')
  .description('Build complete documentation site')
  .option('-o, --output <path>', 'Output directory')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options: CLIOptions) => {
    await cli.build(options)
  })

program.parse()
