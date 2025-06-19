import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert'
import fs from 'fs'
import path from 'path'
import { ProjectStructureGenerator } from '../../src/generators/folder-structure.js'
import type { DocumentType } from '../../src/types/index.js'

describe('ProjectStructureGenerator', () => {
  const generator = new ProjectStructureGenerator()
  const testProjectPath = path.join(process.cwd(), 'tests', 'temp-project')

  // Create and clean up test directory
  beforeEach(() => {
    if (!fs.existsSync(path.join(process.cwd(), 'tests', 'temp'))) {
      fs.mkdirSync(path.join(process.cwd(), 'tests', 'temp'), {
        recursive: true,
      })
    }
    if (!fs.existsSync(testProjectPath)) {
      fs.mkdirSync(testProjectPath, { recursive: true })
    }
  })

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testProjectPath)) {
      fs.rmSync(testProjectPath, { recursive: true, force: true })
    }
  })

  describe('Project Generation', () => {
    it('should generate a basic project structure', async () => {
      const config = {
        projectName: 'Test Project',
        createExamples: false,
        documentTypes: ['user-story', 'acceptance-criteria'] as DocumentType[],
        outputPath: testProjectPath,
      }

      await generator.generateProject(config)

      const projectFullPath = path.join(testProjectPath, config.projectName)

      // Check if main directories were created
      assert.ok(
        fs.existsSync(path.join(projectFullPath, 'features')),
        'Features directory should be created',
      )
      assert.ok(
        fs.existsSync(path.join(projectFullPath, 'acceptance-criteria')),
        'Acceptance criteria directory should be created',
      )
      assert.ok(
        fs.existsSync(path.join(projectFullPath, 'templates')),
        'Templates directory should be created',
      )
      assert.ok(
        fs.existsSync(path.join(projectFullPath, 'schemas')),
        'Schemas directory should be created',
      )

      // Check if main files were created
      assert.ok(
        fs.existsSync(path.join(projectFullPath, 'README.md')),
        'README.md should be created',
      )
      assert.ok(
        fs.existsSync(path.join(projectFullPath, 'docs-to-code.config.json')),
        'Config file should be created',
      )
    })

    it('should generate example files when requested', async () => {
      const config = {
        projectName: 'Test Project With Examples',
        createExamples: true,
        documentTypes: ['user-story', 'bug-report'] as DocumentType[],
        outputPath: testProjectPath,
      }

      await generator.generateProject(config)

      const projectFullPath = path.join(testProjectPath, config.projectName)

      // Check if example files were created
      assert.ok(
        fs.existsSync(
          path.join(projectFullPath, 'features', 'user-story-example-001.json'),
        ),
        'User story example should be created',
      )
      assert.ok(
        fs.existsSync(
          path.join(projectFullPath, 'bugs', 'bug-report-example-001.json'),
        ),
        'Bug report example should be created',
      )
    })
  })

  describe('Project Configuration', () => {
    it('should create a project with config file', async () => {
      const config = {
        projectName: 'Config Test Project',
        createExamples: false,
        documentTypes: ['user-story', 'tech-debt'] as DocumentType[],
        outputPath: testProjectPath,
      }

      await generator.generateProject(config)

      const projectFullPath = path.join(testProjectPath, config.projectName)

      // Check if config file was created
      assert.ok(
        fs.existsSync(path.join(projectFullPath, 'docs-to-code.config.json')),
        'Config file should be created',
      )

      // Verify config content
      const configContent = fs.readFileSync(
        path.join(projectFullPath, 'docs-to-code.config.json'),
        'utf-8',
      )
      const parsedConfig = JSON.parse(configContent)

      assert.strictEqual(
        parsedConfig.projectName,
        'Config Test Project',
        'Project name should match',
      )
      assert.strictEqual(
        parsedConfig.documentTypes.length,
        2,
        'Should have 2 document types',
      )
    })
  })

  describe('README Generation', () => {
    it('should generate a README with project information', async () => {
      const config = {
        projectName: 'README Test Project',
        createExamples: false,
        documentTypes: [
          'user-story',
          'functional-requirements',
        ] as DocumentType[],
        outputPath: testProjectPath,
      }

      await generator.generateProject(config)

      const projectFullPath = path.join(testProjectPath, config.projectName)

      // Check if README was created
      assert.ok(
        fs.existsSync(path.join(projectFullPath, 'README.md')),
        'README.md should be created',
      )

      // Verify README content
      const readmeContent = fs.readFileSync(
        path.join(projectFullPath, 'README.md'),
        'utf-8',
      )

      assert.ok(
        readmeContent.includes('# README Test Project'),
        'README should contain project name',
      )
      assert.ok(
        readmeContent.includes('Document Types Enabled'),
        'README should contain document types section',
      )
      assert.ok(
        readmeContent.includes('non-functional-requirements'),
        'README should mention functional requirements folder',
      )
    })
  })
})
