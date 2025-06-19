export const userStorySchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  title: 'User Story Schema',
  description: 'Schema for validating user story documents',
  required: [
    'id',
    'title',
    'storyStatement',
    'storyDetails',
    'userContext',
    'detailedRequirements',
    'acceptanceCriteria',
  ],
  properties: {
    id: {
      type: 'string',
      pattern: '^US-[0-9]+$',
      description: 'Unique user story identifier',
    },
    title: {
      type: 'string',
      minLength: 5,
      maxLength: 100,
      description: 'Brief descriptive title',
    },
    storyStatement: {
      type: 'object',
      required: ['userType', 'goal', 'reason'],
      properties: {
        userType: {
          type: 'string',
          minLength: 3,
          description: 'Specific user type or persona',
        },
        goal: {
          type: 'string',
          minLength: 5,
          description: 'What the user wants to accomplish',
        },
        reason: {
          type: 'string',
          minLength: 5,
          description: 'Why the user needs this capability',
        },
      },
    },
    storyDetails: {
      type: 'object',
      required: ['epic', 'priority', 'storyPoints'],
      properties: {
        epic: {
          type: 'string',
          description: 'Parent epic name or ID',
        },
        priority: {
          type: 'string',
          enum: ['High', 'Medium', 'Low'],
        },
        storyPoints: {
          type: ['integer', 'string'],
          description: 'Story point estimation',
        },
        sprint: {
          type: 'string',
          description: 'Target sprint',
        },
      },
    },
    userContext: {
      type: 'object',
      required: [
        'primaryPersona',
        'userJourneyStage',
        'frequencyOfUse',
        'technicalSkillLevel',
      ],
      properties: {
        primaryPersona: {
          type: 'string',
          description: 'Detailed user type',
        },
        userJourneyStage: {
          type: 'string',
          enum: ['Awareness', 'Consideration', 'Purchase', 'Usage', 'Advocacy'],
        },
        frequencyOfUse: {
          type: 'string',
          enum: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
        },
        technicalSkillLevel: {
          type: 'string',
          enum: ['Beginner', 'Intermediate', 'Advanced'],
        },
      },
    },
    detailedRequirements: {
      type: 'object',
      required: ['userNeeds', 'successCriteria'],
      properties: {
        userNeeds: {
          type: 'array',
          items: {
            type: 'string',
            minLength: 5,
          },
          minItems: 1,
        },
        successCriteria: {
          type: 'array',
          items: {
            type: 'string',
            minLength: 5,
          },
          minItems: 1,
        },
      },
    },
    businessValue: {
      type: 'object',
      properties: {
        revenueImpact: {
          type: 'string',
          description: 'Direct or indirect revenue effect',
        },
        userExperienceImprovement: {
          type: 'string',
          description: 'Specific UX enhancement',
        },
        operationalEfficiency: {
          type: 'string',
          description: 'Process improvement',
        },
        strategicAlignment: {
          type: 'string',
          description: 'How this supports business goals',
        },
      },
    },
    dependencies: {
      type: 'object',
      properties: {
        technical: {
          type: 'array',
          items: { type: 'string' },
        },
        content: {
          type: 'array',
          items: { type: 'string' },
        },
        team: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    definitionOfReady: {
      type: 'array',
      items: {
        type: 'object',
        required: ['item', 'completed'],
        properties: {
          item: { type: 'string' },
          completed: { type: 'boolean' },
        },
      },
    },
    acceptanceCriteria: {
      type: 'array',
      items: {
        type: 'object',
        required: ['scenario', 'given', 'when', 'then'],
        properties: {
          scenario: { type: 'string' },
          given: { type: 'string' },
          when: { type: 'string' },
          then: { type: 'string' },
          and: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
    notes: {
      type: 'array',
      items: { type: 'string' },
    },
    metadata: {
      type: 'object',
      properties: {
        createdBy: { type: 'string' },
        createdDate: { type: 'string', format: 'date' },
        lastModified: { type: 'string', format: 'date-time' },
        version: { type: 'string' },
        status: {
          type: 'string',
          enum: [
            'Draft',
            'Under Review',
            'Approved',
            'Implemented',
            'Deprecated',
          ],
        },
      },
    },
  },
} as const
