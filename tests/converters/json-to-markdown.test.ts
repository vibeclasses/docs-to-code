import { describe, it } from 'node:test'
import assert from 'node:assert'
import { JsonToMarkdownConverter } from '../../src/converters/index.js'

describe('JsonToMarkdownConverter', () => {
  const converter = new JsonToMarkdownConverter()

  describe('User Story Conversion', () => {
    it.skip('should convert user story JSON to markdown', async () => {
      const userStoryJson = {
        id: 'US-001',
        title: 'User Login Feature',
        storyStatement: {
          userType: 'Registered User',
          goal: 'log into the application',
          reason: 'access my personalized dashboard',
        },
        storyDetails: {
          epic: 'User Authentication',
          priority: 'High',
          storyPoints: 5,
        },
        metadata: {
          createdBy: 'product.owner@company.com',
          createdDate: '2025-06-18',
          version: '1.0',
          status: 'Draft',
        },
      }

      const markdown = await converter.convert(userStoryJson, {
        templateType: 'user-story',
        outputFormat: 'markdown',
      })

      // Basic validation of markdown output
      assert.ok(
        markdown.includes('# User Login Feature'),
        'Title should be in markdown',
      )
      assert.ok(
        markdown.includes('As a Registered User'),
        'User story format should be present',
      )
      assert.ok(
        markdown.includes('Epic: User Authentication'),
        'Epic should be in markdown',
      )
      assert.ok(
        markdown.includes('Priority: High'),
        'Priority should be in markdown',
      )
      assert.ok(
        markdown.includes('Story Points: 5'),
        'Story points should be in markdown',
      )
      assert.ok(
        markdown.includes('Created By: product.owner@company.com'),
        'Metadata should be in markdown',
      )
    })
  })

  describe('Acceptance Criteria Conversion', () => {
    it.skip('should convert acceptance criteria JSON to markdown', async () => {
      const acceptanceCriteriaJson = {
        id: 'AC-001',
        title: 'User Login Acceptance Criteria',
        userStoryRef: 'US-001',
        scenarios: [
          {
            title: 'Successful Login',
            given: 'User is on the login page',
            when: 'User enters valid credentials and clicks login',
            then: 'User is redirected to their dashboard',
          },
          {
            title: 'Failed Login',
            given: 'User is on the login page',
            when: 'User enters invalid credentials and clicks login',
            then: 'User sees an error message',
          },
        ],
        metadata: {
          createdBy: 'qa.tester@company.com',
          createdDate: '2025-06-18',
          version: '1.0',
          status: 'Draft',
        },
      }

      const markdown = await converter.convert(acceptanceCriteriaJson, {
        templateType: 'acceptance-criteria',
        outputFormat: 'markdown',
      })

      // Basic validation of markdown output
      assert.ok(
        markdown.includes('# User Login Acceptance Criteria'),
        'Title should be in markdown',
      )
      assert.ok(
        markdown.includes('User Story: US-001'),
        'User story reference should be in markdown',
      )
      assert.ok(
        markdown.includes('## Scenario: Successful Login'),
        'Scenario title should be in markdown',
      )
      assert.ok(
        markdown.includes('**Given** User is on the login page'),
        'Given statement should be in markdown',
      )
      assert.ok(
        markdown.includes('**When** User enters valid credentials'),
        'When statement should be in markdown',
      )
      assert.ok(
        markdown.includes('**Then** User is redirected'),
        'Then statement should be in markdown',
      )
    })
  })

  describe('Functional Requirements Conversion', () => {
    it.skip('should convert functional requirements JSON to markdown', async () => {
      const functionalRequirementsJson = {
        id: 'FR-001',
        title: 'User Authentication Requirements',
        userStoryRefs: ['US-001'],
        requirements: {
          inputRequirements: [
            {
              element: 'Email Address',
              dataType: 'String',
              format: 'Valid email format',
              validationRules: 'Must be registered in system',
              source: 'User input',
            },
          ],
          processingRequirements: [
            {
              step: 'Validate Input',
              description: 'Check email format and password complexity',
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
        metadata: {
          createdBy: 'system.analyst@company.com',
          createdDate: '2025-06-18',
          version: '1.0',
          status: 'Draft',
        },
      }

      const markdown = await converter.convert(functionalRequirementsJson, {
        templateType: 'functional-requirements',
        outputFormat: 'markdown',
      })

      // Basic validation of markdown output
      assert.ok(
        markdown.includes('# User Authentication Requirements'),
        'Title should be in markdown',
      )
      assert.ok(
        markdown.includes('User Stories: US-001'),
        'User story references should be in markdown',
      )
      assert.ok(
        markdown.includes('## Input Requirements'),
        'Input requirements section should be in markdown',
      )
      assert.ok(
        markdown.includes('| Email Address | String |'),
        'Input requirements table should be in markdown',
      )
      assert.ok(
        markdown.includes('## Processing Requirements'),
        'Processing requirements section should be in markdown',
      )
      assert.ok(
        markdown.includes('## Output Requirements'),
        'Output requirements section should be in markdown',
      )
    })
  })

  describe('Error Handling', () => {
    it.skip('should handle invalid document types', () => {
      try {
        converter.convert(
          {},
          {
            templateType: 'invalid-type' as any,
            outputFormat: 'markdown',
          },
        )
        assert.fail('Should have thrown an error for invalid document type')
      } catch (error: any) {
        assert.ok(
          error.message.includes('No template found'),
          'Error message should indicate missing template',
        )
      }
    })
  })
})
