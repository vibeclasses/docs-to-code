import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { AgileDocsToolkit } from '../src/index.js';
import type { DocumentType } from '../src/types/index.js';

describe('AgileDocsToolkit', () => {
  const testProjectPath = path.join(process.cwd(), 'tests', 'temp-toolkit');
  let toolkit: AgileDocsToolkit;
  
  // Create and clean up test directory
  beforeEach(() => {
    if (!fs.existsSync(path.join(process.cwd(), 'tests', 'temp'))) {
      fs.mkdirSync(path.join(process.cwd(), 'tests', 'temp'), { recursive: true });
    }
    if (!fs.existsSync(testProjectPath)) {
      fs.mkdirSync(testProjectPath, { recursive: true });
    }
    toolkit = new AgileDocsToolkit();
  });
  
  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testProjectPath)) {
      fs.rmSync(testProjectPath, { recursive: true, force: true });
    }
  });

  // Note: Project initialization is handled by ProjectStructureGenerator, not AgileDocsToolkit
  // We'll test the toolkit's actual methods instead

  describe('Document Validation', () => {
    it('should validate a document against its schema', async () => {
      // Create a valid user story
      const validUserStory = {
        id: 'US-001',
        title: 'User Login Feature',
        storyStatement: {
          userType: 'Registered User',
          goal: 'log into the application',
          reason: 'access my personalized dashboard'
        },
        storyDetails: {
          epic: 'User Authentication',
          priority: 'High',
          storyPoints: 5
        },
        metadata: {
          createdBy: 'product.owner@company.com',
          createdDate: '2025-06-18',
          version: '1.0',
          status: 'Draft'
        }
      };
      
      const result = await toolkit.validateDocument(validUserStory, 'user-story');
      assert.strictEqual(result.valid, true, 'Valid user story should pass validation');
    });
  });

  describe('Document Conversion', () => {
    it('should convert JSON to Markdown', async () => {
      const userStoryJson = {
        id: 'US-001',
        title: 'User Login Feature',
        storyStatement: {
          userType: 'Registered User',
          goal: 'log into the application',
          reason: 'access my personalized dashboard'
        },
        storyDetails: {
          epic: 'User Authentication',
          priority: 'High',
          storyPoints: 5
        },
        metadata: {
          createdBy: 'product.owner@company.com',
          createdDate: '2025-06-18',
          version: '1.0',
          status: 'Draft'
        }
      };
      
      const markdown = await toolkit.convertJsonToMarkdown(userStoryJson, 'user-story');
      assert.ok(markdown.includes('# User Login Feature'), 'Title should be in markdown');
      assert.ok(markdown.includes('As a Registered User'), 'User story format should be present');
    });

    it('should convert Markdown to JSON', async () => {
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
      
      const json = await toolkit.convertMarkdownToJson(markdown, 'user-story');
      assert.strictEqual(json.id, 'US-001', 'ID should be extracted correctly');
      assert.strictEqual(json.title, 'User Login Feature', 'Title should be extracted correctly');
      assert.strictEqual(json.storyStatement.userType, 'Registered User', 'User type should be extracted correctly');
    });
  });

  describe('Bulk Operations', () => {
    it('should validate multiple documents', async () => {
      const documents = [
        {
          data: {
            id: 'US-001',
            title: 'User Login Feature',
            storyStatement: {
              userType: 'Registered User',
              goal: 'log into the application',
              reason: 'access my personalized dashboard'
            },
            storyDetails: {
              epic: 'User Authentication',
              priority: 'High',
              storyPoints: 5
            },
            metadata: {
              createdBy: 'product.owner@company.com',
              createdDate: '2025-06-18',
              version: '1.0',
              status: 'Draft'
            }
          },
          type: 'user-story' as DocumentType
        },
        {
          data: {
            id: 'AC-001',
            title: 'User Login Acceptance Criteria',
            userStoryRef: 'US-001',
            scenarios: [
              {
                title: 'Successful Login',
                given: 'User is on the login page',
                when: 'User enters valid credentials and clicks login',
                then: 'User is redirected to their dashboard'
              }
            ],
            metadata: {
              createdBy: 'qa.tester@company.com',
              createdDate: '2025-06-18',
              version: '1.0',
              status: 'Draft'
            }
          },
          type: 'acceptance-criteria' as DocumentType
        }
      ];
      
      const results = await toolkit.validateMultiple(documents);
      assert.strictEqual(results.length, 2, 'Should return two validation results');
      assert.strictEqual(results[0].valid, true, 'First document should be valid');
      assert.strictEqual(results[1].valid, true, 'Second document should be valid');
    });
    
    it('should convert multiple documents', async () => {
      const documents = [
        {
          data: {
            id: 'US-001',
            title: 'User Login Feature',
            storyStatement: {
              userType: 'Registered User',
              goal: 'log into the application',
              reason: 'access my personalized dashboard'
            },
            storyDetails: {
              epic: 'User Authentication',
              priority: 'High',
              storyPoints: 5
            }
          },
          type: 'user-story' as DocumentType
        },
        {
          data: {
            id: 'US-002',
            title: 'User Registration',
            storyStatement: {
              userType: 'New User',
              goal: 'register an account',
              reason: 'access the application features'
            },
            storyDetails: {
              epic: 'User Authentication',
              priority: 'High',
              storyPoints: 8
            }
          },
          type: 'user-story' as DocumentType
        }
      ];
      
      const results = await toolkit.convertMultiple(documents);
      assert.strictEqual(results.length, 2, 'Should return two conversion results');
      assert.ok(results[0].includes('# User Login Feature'), 'First conversion should include title');
      assert.ok(results[1].includes('# User Registration'), 'Second conversion should include title');
    });
  });
});
