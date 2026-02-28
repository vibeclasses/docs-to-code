import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import type { DocumentType } from '../types/index.js'

export interface ProjectConfig {
  projectName: string
  createExamples: boolean
  documentTypes: DocumentType[]
  outputPath: string
}

export class ProjectStructureGenerator {
  async generateProject(config: ProjectConfig): Promise<void> {
    const projectPath = join(config.outputPath, config.projectName)

    // Create main project directory
    mkdirSync(projectPath, { recursive: true })

    // Create folder structure
    const folders = [
      'features',
      'tasks',
      'bugs',
      'tech-debts',
      'non-functional-requirements',
      'acceptance-criteria',
      'docs',
      'templates',
      'schemas',
    ]

    folders.forEach((folder) => {
      mkdirSync(join(projectPath, folder), { recursive: true })
    })

    // Generate main index file
    await this.generateMainIndex(projectPath, config)

    // Generate configuration file
    await this.generateConfigFile(projectPath, config)

    // Create example documents if requested
    if (config.createExamples) {
      await this.generateExamples(projectPath, config.documentTypes)
    }

    // Generate templates and schemas
    await this.generateTemplates(projectPath)
    await this.generateSchemas(projectPath)

    // Create README - ensure this is done synchronously to avoid test timing issues
    this.generateReadme(projectPath, config)

    // Verify README was created (for debugging)
    const readmePath = join(projectPath, 'README.md')
    if (!existsSync(readmePath)) {
      console.error(`README.md was not created at ${readmePath}`)
    }
  }

  async generateMainIndex(
    projectPath?: string,
    config?: ProjectConfig,
  ): Promise<void> {
    const basePath = projectPath || process.cwd()
    const mainIndexContent = this.createMainIndexTemplate(
      config?.projectName || 'Agile Documentation',
    )

    writeFileSync(join(basePath, 'main.md'), mainIndexContent)
  }

  private createMainIndexTemplate(projectName: string): string {
    return `# ${projectName} - Agile Documentation

## Project Overview
This project contains comprehensive Agile documentation managed using structured JSON data and automated Markdown generation.

## Document Structure

### 📋 Features
User stories and feature specifications
- [View all features](./features/)

### ✅ Tasks  
Development tasks and implementation details
- [View all tasks](./tasks/)

### 🐛 Bugs
Bug reports and defect tracking
- [View all bugs](./bugs/)

### 🔧 Technical Debt
Technical debt items and improvement opportunities
- [View all technical debt](./tech-debts/)

### ⚡ Non-Functional Requirements
Performance, security, and quality requirements
- [View all non-functional requirements](./non-functional-requirements/)

### 🎯 Acceptance Criteria
Detailed acceptance criteria for features and stories
- [View all acceptance criteria](./acceptance-criteria/)

## Documentation Workflow

### 1. Create JSON Documents
Create structured JSON documents in the appropriate folders using the provided schemas.

### 2. Validate Documents
Run validation to ensure all documents follow the correct schema:
\`\`\`bash
docs-to-code validate
\`\`\`

### 3. Generate Markdown
Convert JSON documents to human-readable Markdown:
\`\`\`bash
docs-to-code convert
\`\`\`

### 4. Build Complete Site
Generate the complete documentation site:
\`\`\`bash
docs-to-code build
\`\`\`

## Document Types

- **User Stories** (\`user-story\`): Feature requests in user story format
- **Acceptance Criteria** (\`acceptance-criteria\`): Detailed acceptance criteria with Given/When/Then format
- **Functional Requirements** (\`functional-requirements\`): Detailed functional specifications
- **Bug Reports** (\`bug-report\`): Bug tracking and resolution
- **Technical Debt** (\`tech-debt\`): Technical debt management

## Links and Cross-References

- [Project Templates](./templates/)
- [JSON Schemas](./schemas/)
- [Generated Documentation](./docs/)

---
*Generated on ${
      new Date().toISOString().split('T')[0]
    } using Agile Documentation Toolkit*
`
  }

  private async generateConfigFile(
    projectPath: string,
    config: ProjectConfig,
  ): Promise<void> {
    const configContent = {
      projectName: config.projectName,
      documentTypes: config.documentTypes,
      validation: {
        strict: true,
        warningsAsErrors: false,
      },
      output: {
        markdownDir: './docs',
        templateDir: './templates',
      },
      crossReferences: {
        enabled: true,
        autoLink: true,
      },
    }

    writeFileSync(
      join(projectPath, 'docs-to-code.config.json'),
      JSON.stringify(configContent, null, 2),
    )
  }

  private async generateExamples(
    projectPath: string,
    documentTypes: DocumentType[],
  ): Promise<void> {
    // Define examples with proper type annotation
    const examples: Partial<Record<DocumentType, unknown>> = {
      'user-story': {
        id: 'US-001',
        title: 'User Login Feature',
        storyStatement: {
          userType: 'registered user',
          goal: 'log into my account securely',
          reason: 'I can access my personalized content and settings',
        },
        storyDetails: {
          epic: 'Authentication System',
          priority: 'High',
          storyPoints: 5,
        },
        userContext: {
          primaryPersona: 'Regular user with basic technical skills',
          userJourneyStage: 'Usage',
          frequencyOfUse: 'Daily',
          technicalSkillLevel: 'Intermediate',
        },
        detailedRequirements: {
          userNeeds: [
            'Enter email and password to authenticate',
            'Receive feedback on login success or failure',
            'Stay logged in for a reasonable period',
          ],
          successCriteria: [
            'User can log in with valid credentials in under 3 seconds',
            'Invalid credentials show clear error message',
            'Session remains active for 24 hours',
          ],
        },
        acceptanceCriteria: [
          {
            scenario: 'Successful Login',
            given: 'I am a registered user with valid credentials',
            when: 'I enter my email and password and click login',
            then: 'I am logged in and redirected to my dashboard',
            and: [
              'I see a welcome message',
              'My session is active for 24 hours',
            ],
          },
        ],
        metadata: {
          createdBy: 'product.owner@company.com',
          createdDate: new Date().toISOString().split('T')[0],
          version: '1.0',
          status: 'Draft',
        },
      },

      'acceptance-criteria': {
        id: 'AC-001',
        userStoryId: 'US-001',
        title: 'User Login Acceptance Criteria',
        scenarios: [
          {
            id: 'SC-001',
            title: 'Successful Login',
            type: 'happy_path',
            priority: 'Critical',
            given:
              "I am a registered user with email 'user@example.com' and password 'SecurePass123'",
            when: 'I enter my credentials and click the login button',
            then: 'I am successfully logged in and redirected to my dashboard',
            and: [
              'I see a welcome message with my name',
              'My session is active for 24 hours',
              'I can access all authenticated features',
            ],
          },
        ],
        crossScenarioRequirements: {
          performance: ['Login must complete within 3 seconds'],
          security: [
            'Passwords must be encrypted',
            'Failed attempts must be logged',
          ],
          accessibility: [
            'Form must be keyboard navigable',
            'Screen reader compatible',
          ],
        },
        metadata: {
          createdBy: 'qa.engineer@company.com',
          createdDate: new Date().toISOString().split('T')[0],
          version: '1.0',
        },
      },

      'functional-requirements': {
        id: 'FR-AUTH-001',
        title: 'User Authentication System',
        requirementStatement: {
          priority: 'Must Have',
          complexity: 'Medium',
          userStoryFormat: {
            userType: 'system user',
            capability: 'authenticate securely using email and password',
            benefit: 'only authorized users can access the system',
          },
          functionalDescription:
            'The system must provide secure user authentication using email and password credentials with session management.',
        },
        detailedSpecifications: {
          inputRequirements: [
            {
              element: 'Email Address',
              dataType: 'String',
              format: 'Valid email format',
              validationRules: 'Must be registered in system',
              source: 'User input',
            },
            {
              element: 'Password',
              dataType: 'String',
              format: '8-128 characters',
              validationRules: 'Must meet complexity requirements',
              source: 'User input',
            },
          ],
          processingRequirements: [
            {
              step: 'Validate Input',
              description: 'Check email format and password complexity',
            },
            {
              step: 'Authenticate User',
              description: 'Verify credentials against user database',
            },
            {
              step: 'Create Session',
              description: 'Generate secure session token',
            },
          ],
          outputRequirements: [
            {
              element: 'Authentication Token',
              dataType: 'String',
              format: 'JWT token',
              destination: 'Client session',
              timing: 'Immediate',
            },
          ],
        },
        businessRules: {
          businessLogicRules: [
            {
              category: 'Security',
              rule: 'Maximum 5 failed login attempts before account lockout',
            },
          ],
        },
        acceptanceCriteria: [
          {
            flow: 'Successful Authentication',
            given: 'I have valid user credentials',
            when: 'I submit the login form',
            then: 'I receive an authentication token and access to the system',
          },
        ],
        metadata: {
          createdBy: 'business.analyst@company.com',
          createdDate: new Date().toISOString().split('T')[0],
          version: '1.0',
          status: 'Draft',
        },
      },
      'bug-report': {
        id: 'BUG-001',
        title: 'Login form submission error',
        bugDetails: {
          severity: 'High',
          priority: 'Medium',
          reportedBy: 'qa.tester@company.com',
          assignedTo: 'developer@company.com',
          affectedVersion: '1.2.3',
          environment: 'Production',
        },
        description:
          'When submitting the login form with valid credentials, an error occurs and users cannot log in.',
        stepsToReproduce: [
          'Navigate to login page',
          'Enter valid email and password',
          'Click submit button',
        ],
        expectedBehavior:
          'User should be logged in and redirected to dashboard',
        actualBehavior: 'Form submission fails with 500 error',
        metadata: {
          createdBy: 'qa.tester@company.com',
          createdDate: new Date().toISOString().split('T')[0],
          version: '1.0',
          status: 'Open',
        },
      },
      'tech-debt': {
        id: 'TD-001',
        title: 'Refactor authentication service',
        debtDetails: {
          category: 'Code Quality',
          impact: 'Medium',
          effort: 'High',
          priority: 'Medium',
        },
        description:
          'The authentication service has grown organically and needs refactoring to improve maintainability.',
        proposedSolution:
          'Extract authentication logic into smaller, more focused classes following SOLID principles.',
        benefits: [
          'Improved code maintainability',
          'Easier testing',
          'Better separation of concerns',
        ],
        risks: ['Potential regression issues during refactoring'],
        metadata: {
          createdBy: 'developer@company.com',
          createdDate: new Date().toISOString().split('T')[0],
          version: '1.0',
          status: 'Identified',
        },
      },
    }

    // Create directories for each document type
    for (const docType of documentTypes) {
      if (examples[docType]) {
        const folderMap: Record<DocumentType, string> = {
          'user-story': 'features',
          'acceptance-criteria': 'acceptance-criteria',
          'functional-requirements': 'non-functional-requirements',
          'bug-report': 'bugs',
          'tech-debt': 'techDebts',
        }

        const folder = folderMap[docType] || docType
        const filename = `${docType}-example-001.json`
        const filepath = join(projectPath, folder, filename)

        writeFileSync(filepath, JSON.stringify(examples[docType], null, 2))
      }
    }
  }

  private async generateTemplates(projectPath: string): Promise<void> {
    const templatesPath = join(projectPath, 'templates')
    mkdirSync(templatesPath, { recursive: true })

    // Copy template files from package
    // This would copy the .hbs template files to the project
    // Implementation depends on how templates are packaged
  }

  private async generateSchemas(projectPath: string): Promise<void> {
    const schemasPath = join(projectPath, 'schemas')
    mkdirSync(schemasPath, { recursive: true })

    // Copy schema files from package
    // This would copy the JSON schema files to the project
  }

  private async generateReadme(
    projectPath: string,
    config: ProjectConfig,
  ): Promise<void> {
    const readmeContent = `# ${config.projectName}

This project uses the Agile Documentation Toolkit for managing structured documentation.

## Quick Start

1. **Validate documents:**
   \`\`\`bash
   npx docs-to-code validate
   \`\`\`

2. **Convert to Markdown:**
   \`\`\`bash
   npx docs-to-code convert
   \`\`\`

3. **Build documentation site:**
   \`\`\`bash
   npx docs-to-code build
   \`\`\`

## Document Types Enabled

${config.documentTypes.map((type) => `- ${type}`).join('\n')}

## Project Structure

- \`features/\` - User stories and feature specifications
- \`acceptance-criteria/\` - Detailed acceptance criteria
- \`non-functional-requirements/\` - Functional requirements
- \`bugs/\` - Bug reports and tracking
- \`tech-debts/\` - Technical debt management
- \`docs/\` - Generated Markdown documentation
- \`templates/\` - Handlebars templates for document generation
- \`schemas/\` - JSON schemas for validation

## Documentation

See [main.md](./main.md) for complete project documentation.

---
Generated by [Agile Documentation Toolkit](https://github.com/your-org/docs-to-code-toolkit)
`

    writeFileSync(join(projectPath, 'README.md'), readmeContent)
  }
}
