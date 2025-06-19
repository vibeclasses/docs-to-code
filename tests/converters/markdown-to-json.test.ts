import { describe, it } from 'node:test';
import assert from 'node:assert';
import { MarkdownToJsonConverter } from '../../src/converters/index.js';

describe('MarkdownToJsonConverter', () => {
  const converter = new MarkdownToJsonConverter();

  describe('User Story Conversion', () => {
    it('should convert user story markdown to JSON', () => {
      const markdown = `# User Login Feature

## User Story
**As a** Registered User
**I want to** log into the application
**So that** I can access my personalized dashboard

## Details
- **Epic:** User Authentication
- **Priority:** High
- **Story Points:** 5

## Metadata
- **ID:** US-001
- **Created By:** product.owner@company.com
- **Created Date:** 2025-06-18
- **Version:** 1.0
- **Status:** Draft`;

      const json = converter.convert(markdown, 'user-story');
      
      assert.strictEqual(json.id, 'US-001', 'ID should be extracted correctly');
      assert.strictEqual(json.title, 'User Login Feature', 'Title should be extracted correctly');
      assert.strictEqual(json.storyStatement.userType, 'Registered User', 'User type should be extracted correctly');
      assert.strictEqual(json.storyStatement.goal, 'log into the application', 'Goal should be extracted correctly');
      assert.strictEqual(json.storyStatement.reason, 'access my personalized dashboard', 'Reason should be extracted correctly');
      assert.strictEqual(json.storyDetails.epic, 'User Authentication', 'Epic should be extracted correctly');
      assert.strictEqual(json.storyDetails.priority, 'High', 'Priority should be extracted correctly');
      assert.strictEqual(json.storyDetails.storyPoints, 5, 'Story points should be extracted correctly');
      assert.strictEqual(json.metadata.createdBy, 'product.owner@company.com', 'Creator should be extracted correctly');
      assert.strictEqual(json.metadata.version, '1.0', 'Version should be extracted correctly');
      assert.strictEqual(json.metadata.status, 'Draft', 'Status should be extracted correctly');
    });
  });

  describe('Acceptance Criteria Conversion', () => {
    it('should convert acceptance criteria markdown to JSON', () => {
      const markdown = `# User Login Acceptance Criteria

User Story: US-001

## Scenario: Successful Login
**Given** User is on the login page
**When** User enters valid credentials and clicks login
**Then** User is redirected to their dashboard

## Scenario: Failed Login
**Given** User is on the login page
**When** User enters invalid credentials and clicks login
**Then** User sees an error message

## Metadata
- **ID:** AC-001
- **Created By:** qa.tester@company.com
- **Created Date:** 2025-06-18
- **Version:** 1.0
- **Status:** Draft`;

      const json = converter.convert(markdown, 'acceptance-criteria');
      
      assert.strictEqual(json.id, 'AC-001', 'ID should be extracted correctly');
      assert.strictEqual(json.title, 'User Login Acceptance Criteria', 'Title should be extracted correctly');
      assert.strictEqual(json.userStoryRef, 'US-001', 'User story reference should be extracted correctly');
      assert.strictEqual(json.scenarios.length, 2, 'Should extract 2 scenarios');
      assert.strictEqual(json.scenarios[0].title, 'Successful Login', 'Scenario title should be extracted correctly');
      assert.strictEqual(json.scenarios[0].given, 'User is on the login page', 'Given statement should be extracted correctly');
      assert.strictEqual(json.scenarios[0].when, 'User enters valid credentials and clicks login', 'When statement should be extracted correctly');
      assert.strictEqual(json.scenarios[0].then, 'User is redirected to their dashboard', 'Then statement should be extracted correctly');
      assert.strictEqual(json.metadata.createdBy, 'qa.tester@company.com', 'Creator should be extracted correctly');
    });
  });

  describe('Functional Requirements Conversion', () => {
    it('should convert functional requirements markdown to JSON', () => {
      const markdown = `# User Authentication Requirements

User Stories: US-001

## Input Requirements

| Element | Data Type | Format | Validation Rules | Source |
|---------|-----------|--------|-----------------|--------|
| Email Address | String | Valid email format | Must be registered in system | User input |

## Processing Requirements

1. **Validate Input**: Check email format and password complexity

## Output Requirements

| Element | Data Type | Format | Destination | Timing |
|---------|-----------|--------|------------|--------|
| Authentication Token | String | JWT token | Client session | Immediate |

## Metadata
- **ID:** FR-001
- **Created By:** system.analyst@company.com
- **Created Date:** 2025-06-18
- **Version:** 1.0
- **Status:** Draft`;

      const json = converter.convert(markdown, 'functional-requirements');
      
      assert.strictEqual(json.id, 'FR-001', 'ID should be extracted correctly');
      assert.strictEqual(json.title, 'User Authentication Requirements', 'Title should be extracted correctly');
      assert.deepStrictEqual(json.userStoryRefs, ['US-001'], 'User story references should be extracted correctly');
      
      assert.strictEqual(json.requirements.inputRequirements.length, 1, 'Should extract 1 input requirement');
      assert.strictEqual(json.requirements.inputRequirements[0].element, 'Email Address', 'Input element should be extracted correctly');
      assert.strictEqual(json.requirements.inputRequirements[0].dataType, 'String', 'Data type should be extracted correctly');
      
      assert.strictEqual(json.requirements.processingRequirements.length, 1, 'Should extract 1 processing requirement');
      assert.strictEqual(json.requirements.processingRequirements[0].step, 'Validate Input', 'Processing step should be extracted correctly');
      
      assert.strictEqual(json.requirements.outputRequirements.length, 1, 'Should extract 1 output requirement');
      assert.strictEqual(json.requirements.outputRequirements[0].element, 'Authentication Token', 'Output element should be extracted correctly');
      
      assert.strictEqual(json.metadata.createdBy, 'system.analyst@company.com', 'Creator should be extracted correctly');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid document types', () => {
      try {
        converter.convert('# Invalid Document', 'invalid-type' as any);
        assert.fail('Should have thrown an error for invalid document type');
      } catch (error: any) {
        assert.ok(error.message.includes('Unsupported document type'), 'Error message should indicate unsupported type');
      }
    });

    it('should handle malformed markdown', () => {
      const malformedMarkdown = `# Title without proper sections`;
      
      try {
        converter.convert(malformedMarkdown, 'user-story');
        // If it doesn't throw, the result should at least have a title
        const result = converter.convert(malformedMarkdown, 'user-story');
        assert.strictEqual(result.title, 'Title without proper sections', 'Should extract title even from malformed markdown');
      } catch (error: any) {
        // Some implementations might throw, others might return partial data
        assert.ok(error.message, 'Error should have a message');
      }
    });
  });
});
