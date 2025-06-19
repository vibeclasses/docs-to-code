import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SchemaValidator } from '../../src/schemas/index.js';
import type { DocumentType } from '../../src/types/index.js';

describe('SchemaValidator', () => {
  const validator = new SchemaValidator();

  describe('User Story Schema Validation', () => {
    it('should validate a valid user story', () => {
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
        userContext: {
          primaryPersona: 'Regular User',
          userJourneyStage: 'Usage',
          frequencyOfUse: 'Daily',
          technicalSkillLevel: 'Intermediate'
        },
        detailedRequirements: {
          userNeeds: [
            'Need to access personalized content',
            'Need secure authentication'
          ],
          successCriteria: [
            'User can log in successfully',
            'User can access dashboard after login'
          ]
        },
        acceptanceCriteria: [
          {
            scenario: 'Valid Login',
            given: 'User is on the login page',
            when: 'User enters valid credentials and submits',
            then: 'User is redirected to dashboard'
          }
        ],
        metadata: {
          createdBy: 'product.owner@company.com',
          createdDate: '2025-06-18',
          version: '1.0',
          status: 'Draft'
        }
      };

      const result = validator.validate(validUserStory, 'user-story');
      assert.strictEqual(result.valid, true, 'Valid user story should pass validation');
      assert.strictEqual(result.errors.length, 0, 'No validation errors should be present');
    });

    it('should reject an invalid user story', () => {
      const invalidUserStory = {
        // Missing required fields
        id: 'US-001',
        title: 'User Login Feature',
        // Missing storyStatement
        storyDetails: {
          epic: 'User Authentication',
          // Missing priority
          storyPoints: 5
        }
      };

      const result = validator.validate(invalidUserStory as any, 'user-story');
      assert.strictEqual(result.valid, false, 'Invalid user story should fail validation');
      assert.ok(result.errors.length > 0, 'Validation errors should be present');
    });
  });

  describe('Acceptance Criteria Schema Validation', () => {
    it('should validate valid acceptance criteria', () => {
      const validAcceptanceCriteria = {
        id: 'AC-001',
        title: 'User Login Acceptance Criteria',
        userStoryId: 'US-001',
        scenarios: [
          {
            id: 'SC-001',
            title: 'Successful Login',
            type: 'happy_path',
            priority: 'Critical',
            given: 'User is on the login page',
            when: 'User enters valid credentials and clicks login',
            then: 'User is redirected to their dashboard'
          },
          {
            id: 'SC-002',
            title: 'Failed Login',
            type: 'error',
            priority: 'High',
            given: 'User is on the login page',
            when: 'User enters invalid credentials and clicks login',
            then: 'User sees an error message'
          }
        ],
        version: '1.0',
        createdAt: '2025-06-18T12:00:00Z'
      };

      const result = validator.validate(validAcceptanceCriteria, 'acceptance-criteria');
      assert.strictEqual(result.valid, true, 'Valid acceptance criteria should pass validation');
      assert.strictEqual(result.errors.length, 0, 'No validation errors should be present');
    });
  });

  describe('Functional Requirements Schema Validation', () => {
    it('should validate valid functional requirements', () => {
      const validFunctionalRequirements = {
        id: 'FR-001',
        title: 'User Authentication Requirements',
        version: '1.0',
        createdAt: '2025-06-18T12:00:00Z',
        requirementStatement: {
          relatedEpic: 'User Authentication',
          userStoryLink: 'US-001',
          priority: 'Must Have',
          complexity: 'Medium',
          userStoryFormat: {
            userType: 'Registered User',
            capability: 'log into the application',
            benefit: 'access my personalized dashboard'
          },
          functionalDescription: 'The system must authenticate users with valid credentials'
        },
        detailedSpecifications: {
          inputRequirements: [
            {
              element: 'Email Address',
              dataType: 'String',
              format: 'Valid email format',
              validationRules: 'Must be registered in system',
              source: 'User input'
            }
          ],
          processingRequirements: [
            {
              step: 'Validate Input',
              description: 'Check email format and password complexity'
            }
          ],
          outputRequirements: [
            {
              element: 'Authentication Token',
              dataType: 'String',
              format: 'JWT token',
              destination: 'Client session',
              timing: 'Immediate'
            }
          ]
        },
        businessRules: {
          businessLogicRules: [
            {
              category: 'Authentication',
              rule: 'Passwords must be hashed before storage'
            }
          ]
        },
        acceptanceCriteria: [
          {
            flow: 'Happy Path',
            scenario: 'Valid Login',
            given: 'User is on the login page',
            when: 'User enters valid credentials',
            then: 'User is authenticated and redirected to dashboard'
          }
        ]
      };

      const result = validator.validate(validFunctionalRequirements, 'functional-requirements');
      assert.strictEqual(result.valid, true, 'Valid functional requirements should pass validation');
      assert.strictEqual(result.errors.length, 0, 'No validation errors should be present');
    });
  });

  describe('Unknown Document Type', () => {
    it('should reject unknown document types', () => {
      const result = validator.validate({}, 'unknown-type' as DocumentType);
      assert.strictEqual(result.valid, false, 'Unknown document type should fail validation');
      assert.ok(result.errors.length > 0, 'Validation errors should be present');
      assert.strictEqual(result.errors[0].message, 'Unknown document type: unknown-type', 
        'Error message should indicate unknown document type');
    });
  });
});
