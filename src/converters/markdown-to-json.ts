import { marked } from 'marked'
import type { TokensList, Tokens } from 'marked'
import type {
  DocumentType,
  UserStory,
  AcceptanceCriteria,
  FunctionalRequirement,
} from '@types'

export class MarkdownToJsonConverter {
  convert(markdownContent: string, documentType: DocumentType): unknown {
    const tokens = marked.lexer(markdownContent)

    switch (documentType) {
      case 'user-story':
        return this.parseUserStory(tokens)
      case 'acceptance-criteria':
        return this.parseAcceptanceCriteria(tokens)
      case 'functional-requirements':
        return this.parseFunctionalRequirements(tokens)
      default:
        throw new Error(`Unsupported document type: ${documentType}`)
    }
  }

  private extractMetadata(tokens: TokensList): Record<string, unknown> {
    const metadata: Record<string, unknown> = {}

    // Find metadata section
    let inMetadataSection = false

    for (const token of tokens) {
      if (token.type === 'heading' && token.text.toLowerCase() === 'metadata') {
        inMetadataSection = true
        continue
      }

      if (inMetadataSection && token.type === 'list') {
        for (const item of token.items) {
          const text = item.tokens
            .filter((t: Tokens.Generic) => t.type === 'text')
            .map((t: Tokens.Generic) => (t as Tokens.Text).text)
            .join(' ')
            .trim()

          // Extract key-value pairs from format: "**Key:** Value"
          const match = text.match(/\*\*([^:]+):\*\*\s*(.+)/)
          if (match) {
            const key = match[1].trim().toLowerCase()
            const value = match[2].trim()

            // Convert specific fields to appropriate types
            if (key === 'id') {
              metadata.id = value
            } else if (key === 'created date' || key === 'createddate') {
              metadata.createdDate = value
            } else if (key === 'created by' || key === 'createdby') {
              metadata.createdBy = value
            } else if (key === 'version') {
              metadata.version = value
            } else if (key === 'status') {
              metadata.status = value
            }
          }
        }
      }

      // Exit metadata section when we hit another heading
      if (inMetadataSection && token.type === 'heading') {
        inMetadataSection = false
      }
    }

    return metadata
  }

  private parseUserStory(tokens: TokensList): Partial<UserStory> {
    const userStory: Partial<UserStory> = {
      acceptanceCriteria: [],
      detailedRequirements: {
        userNeeds: [],
        successCriteria: [],
      },
    }

    // Extract metadata
    const metadata = this.extractMetadata(tokens)
    if (metadata.id) userStory.id = metadata.id
    if (
      metadata.createdBy ||
      metadata.createdDate ||
      metadata.version ||
      metadata.status
    ) {
      userStory.metadata = {
        createdBy: metadata.createdBy || '',
        createdDate: metadata.createdDate || '',
        version: metadata.version || '',
        status: metadata.status || '',
      }
    }

    let currentSection = ''
    let currentSubsection = ''

    for (const token of tokens) {
      switch (token.type) {
        case 'heading':
          if (token.depth === 1) {
            userStory.title = token.text.replace('User Story: ', '')
          } else if (token.depth === 2) {
            currentSection = this.normalizeSection(token.text)
          } else if (token.depth === 3) {
            currentSubsection = this.normalizeSection(token.text)
          }
          break

        case 'paragraph':
          if (currentSection === 'story-statement') {
            const storyStatement = this.parseStoryStatement(token.text)
            if (storyStatement) {
              userStory.storyStatement = storyStatement
            }
          }
          break

        case 'list':
          if (currentSection === 'detailed-requirements') {
            if (currentSubsection === 'user-needs') {
              userStory.detailedRequirements!.userNeeds = this.extractListItems(
                token as Tokens.List,
              )
            } else if (currentSubsection === 'success-criteria') {
              userStory.detailedRequirements!.successCriteria =
                this.extractListItems(token as Tokens.List)
            }
          } else if (currentSection === 'acceptance-criteria') {
            const criteria = this.parseAcceptanceCriteriaSection(
              token as Tokens.List,
            )
            if (criteria) {
              userStory.acceptanceCriteria!.push(criteria)
            }
          }
          break

        case 'table':
          // Handle tables if needed
          break
      }
    }

    return userStory
  }

  private parseAcceptanceCriteria(
    tokens: TokensList,
  ): Partial<AcceptanceCriteria> {
    const acceptanceCriteria: Partial<AcceptanceCriteria> = {
      scenarios: [],
    }

    // Extract metadata
    const metadata = this.extractMetadata(tokens)
    if (metadata.id) acceptanceCriteria.id = metadata.id
    if (
      metadata.createdBy ||
      metadata.createdDate ||
      metadata.version ||
      metadata.status
    ) {
      acceptanceCriteria.metadata = {
        createdBy: metadata.createdBy || '',
        createdDate: metadata.createdDate || '',
        version: metadata.version || '',
        status: metadata.status || '',
      }
    }

    let currentSection = ''

    // Extract user story reference
    for (const token of tokens) {
      if (token.type === 'paragraph') {
        const text = token.text
        const userStoryMatch = text.match(/User Story:\s*([\w-]+)/i)
        if (userStoryMatch) {
          // Use userStoryRef instead of userStoryId to match test expectations
          ;(acceptanceCriteria as Record<string, unknown>).userStoryRef = userStoryMatch[1].trim()
          break
        }
      }
    }

    // If we didn't find the userStoryRef in a paragraph, try to extract it from the title
    if (!(acceptanceCriteria as Record<string, unknown>).userStoryRef) {
      for (const token of tokens) {
        if (token.type === 'heading' && token.depth === 1) {
          const titleMatch = token.text.match(/US-\d+/i)
          if (titleMatch) {
            ;(acceptanceCriteria as Record<string, unknown>).userStoryRef = titleMatch[0].trim()
            break
          }
        }
      }
    }

    for (const token of tokens) {
      switch (token.type) {
        case 'heading':
          if (token.depth === 1) {
            acceptanceCriteria.title = token.text.replace(
              'Acceptance Criteria for ',
              '',
            )
          } else if (token.depth === 2) {
            currentSection = this.normalizeSection(token.text)
          } else if (token.depth === 3) {
            // Handle scenario parsing
            const scenario = this.parseScenarioHeading(token.text)
            if (scenario && currentSection === 'scenarios') {
              acceptanceCriteria.scenarios!.push(scenario)
            }
          }
          break

        case 'paragraph':
          if (
            currentSection === 'scenarios' &&
            acceptanceCriteria.scenarios!.length > 0
          ) {
            const lastScenario =
              acceptanceCriteria.scenarios![
                acceptanceCriteria.scenarios!.length - 1
              ]
            this.parseGivenWhenThen(token.text, lastScenario)
          }
          break
      }
    }

    return acceptanceCriteria
  }

  private parseFunctionalRequirements(
    tokens: TokensList,
  ): Partial<FunctionalRequirement> {
    const functionalReq: Partial<FunctionalRequirement> = {
      acceptanceCriteria: [],
      // Add requirements property to match test expectations using type assertion
      ...({
        requirements: {
          inputRequirements: [],
          processingRequirements: [],
          outputRequirements: [],
        },
      } as Record<string, unknown>),
      // Keep detailedSpecifications for type compatibility
      detailedSpecifications: {
        inputRequirements: [],
        processingRequirements: [],
        outputRequirements: [],
      },
    }

    // Extract metadata
    const metadata = this.extractMetadata(tokens)
    if (metadata.id) functionalReq.id = metadata.id
    if (
      metadata.createdBy ||
      metadata.createdDate ||
      metadata.version ||
      metadata.status
    ) {
      functionalReq.metadata = {
        createdBy: metadata.createdBy || '',
        createdDate: metadata.createdDate || '',
        version: metadata.version || '',
        status: metadata.status || '',
      }
    }

    let currentSection = ''
    let currentSubsection = ''

    // Extract user story references
    for (const token of tokens) {
      if (token.type === 'paragraph') {
        const text = token.text
        const userStoryMatch = text.match(/User Stor(?:y|ies):\s*([\w\s,-]+)/i)
        if (userStoryMatch) {
          // Use type assertion to handle the property that might not exist in the type
          ;(functionalReq as Record<string, unknown>).userStoryRefs = userStoryMatch[1]
            .split(',')
            .map((ref: string) => ref.trim())
            .filter((ref: string) => ref.length > 0)
          break
        }
      }
    }

    for (const token of tokens) {
      switch (token.type) {
        case 'heading':
          if (token.depth === 1) {
            functionalReq.title = token.text.replace(
              'Functional Requirement: ',
              '',
            )
          } else if (token.depth === 2) {
            currentSection = this.normalizeSection(token.text)
          } else if (token.depth === 3) {
            currentSubsection = this.normalizeSection(token.text)
          }
          break

        case 'list':
          if (currentSection === 'detailed-specifications') {
            if (currentSubsection === 'input-requirements') {
              const inputReqs = this.parseInputRequirements(
                token as Tokens.List,
              )
              functionalReq.detailedSpecifications!.inputRequirements =
                inputReqs
              // Also set on requirements to match test expectations
              ;(functionalReq as Record<string, unknown>).requirements.inputRequirements = inputReqs
            } else if (currentSubsection === 'processing-requirements') {
              const processingReqs = this.parseProcessingRequirements(
                token as Tokens.List,
              )
              functionalReq.detailedSpecifications!.processingRequirements =
                processingReqs
              // Also set on requirements to match test expectations
              ;(functionalReq as Record<string, unknown>).requirements.processingRequirements =
                processingReqs
            } else if (currentSubsection === 'output-requirements') {
              const outputReqs = this.parseOutputRequirements(
                token as Tokens.List,
              )
              functionalReq.detailedSpecifications!.outputRequirements =
                outputReqs
              // Also set on requirements to match test expectations
              ;(functionalReq as Record<string, unknown>).requirements.outputRequirements =
                outputReqs
            }
          } else if (currentSection === 'acceptance-criteria') {
            const criteria = this.parseAcceptanceCriteriaSection(
              token as Tokens.List,
            )
            if (criteria) {
              functionalReq.acceptanceCriteria!.push(criteria)
            }
          }
          break
      }
    }

    return functionalReq
  }

  private parseStoryStatement(
    text: string,
  ): UserStory['storyStatement'] | null {
    const storyRegex =
      /\*\*As a\*\*\s+(.+?)\s+\*\*I want\*\*\s+(.+?)\s+\*\*So that\*\*\s+(.+)/i
    const match = text.match(storyRegex)

    if (match) {
      return {
        userType: match[1].trim(),
        goal: match[2].trim(),
        reason: match[3].trim(),
      }
    }

    return null
  }

  private parseGivenWhenThen(text: string, scenario: Record<string, unknown>): void {
    const givenMatch = text.match(
      /\*\*Given\*\*\s+(.+?)(?=\s+\*\*When\*\*|\s+\*\*Then\*\*|$)/i,
    )
    const whenMatch = text.match(
      /\*\*When\*\*\s+(.+?)(?=\s+\*\*Then\*\*|\s+\*\*And\*\*|$)/i,
    )
    const thenMatch = text.match(/\*\*Then\*\*\s+(.+?)(?=\s+\*\*And\*\*|$)/i)
    const andMatches = text.match(/\*\*And\*\*\s+(.+?)(?=\s+\*\*And\*\*|$)/gi)

    if (givenMatch) scenario.given = givenMatch[1].trim()
    if (whenMatch) scenario.when = whenMatch[1].trim()
    if (thenMatch) scenario.then = thenMatch[1].trim()
    if (andMatches) {
      scenario.and = andMatches.map((match) =>
        match.replace(/\*\*And\*\*\s+/i, '').trim(),
      )
    }
  }

  private parseAcceptanceCriteriaSection(token: Tokens.List): Record<string, unknown> | null {
    // Extract the first item as the criteria title
    if (token.items.length === 0) return null

    const firstItem = token.items[0]
    const titleText = firstItem.tokens
      .filter((t: Tokens.Generic) => t.type === 'text')
      .map((t: Tokens.Generic) => (t as Tokens.Text).text)
      .join(' ')
      .trim()

    // Extract criteria ID and title
    const criteriaMatch = titleText.match(/AC-(\d+):\s+(.+)/i)
    if (!criteriaMatch) return null

    return {
      id: `AC-${criteriaMatch[1].padStart(3, '0')}`,
      title: criteriaMatch[2].trim(),
      description: '', // Can be populated from other items if needed
    }
  }

  private parseInputRequirements(token: Tokens.List): Array<{
    element: string
    dataType: string
    format: string
    validationRules: string
    source: string
  }> {
    // Check if this is a table by looking for pipe characters in the text
    const fullText = token.items
      .map((item) => {
        return item.tokens
          .filter((t: Tokens.Generic) => t.type === 'text')
          .map((t: Tokens.Generic) => (t as Tokens.Text).text)
          .join(' ')
          .trim()
      })
      .join('\n')

    if (fullText.includes('|')) {
      // This is likely a table, parse it as such
      const rows = fullText.split('\n').filter((row) => row.trim().length > 0)

      // Skip header and separator rows if they exist
      const dataRows = rows.filter((row) => !row.includes('---'))

      return dataRows.map((row) => {
        const cells = row.split('|').filter((cell) => cell.trim().length > 0)
        if (cells.length >= 5) {
          return {
            element: cells[0].trim(),
            dataType: cells[1].trim(),
            format: cells[2].trim(),
            validationRules: cells[3].trim(),
            source: cells[4].trim(),
          }
        }
        return {
          element: '',
          dataType: '',
          format: '',
          validationRules: '',
          source: '',
        }
      })
    }

    // Default handling for non-table lists
    const requirements = []

    for (const item of token.items) {
      const text = item.tokens
        .filter((t: Tokens.Generic) => t.type === 'text')
        .map((t: Tokens.Generic) => (t as Tokens.Text).text)
        .join(' ')
        .trim()

      // Parse the format: "Element: value | DataType: value | Format: value | Validation: value | Source: value"
      const parts = text.split('|').map((part) => part.trim())
      const requirement: Record<string, string> = {
        element: '',
        dataType: '',
        format: '',
        validationRules: '',
        source: '',
      }

      for (const part of parts) {
        if (part.startsWith('Element:')) {
          requirement.element = part.replace('Element:', '').trim()
        } else if (part.startsWith('DataType:')) {
          requirement.dataType = part.replace('DataType:', '').trim()
        } else if (part.startsWith('Format:')) {
          requirement.format = part.replace('Format:', '').trim()
        } else if (part.startsWith('Validation:')) {
          requirement.validationRules = part.replace('Validation:', '').trim()
        } else if (part.startsWith('Source:')) {
          requirement.source = part.replace('Source:', '').trim()
        }
      }

      requirements.push(requirement)
    }

    return requirements
  }

  private parseProcessingRequirements(token: Tokens.List): Array<{
    step: string
    description: string
    conditions?: string
  }> {
    const requirements = []

    for (const item of token.items) {
      const text = item.tokens
        .filter((t) => t.type === 'text')
        .map((t) => (t as Tokens.Text).text)
        .join(' ')
        .trim()

      // Parse the format: "Step: value | Description: value | Conditions: value"
      const parts = text.split('|').map((part) => part.trim())
      const requirement: Record<string, string> = {
        step: '',
        description: '',
      }

      for (const part of parts) {
        if (part.startsWith('Step:')) {
          requirement.step = part.replace('Step:', '').trim()
        } else if (part.startsWith('Description:')) {
          requirement.description = part.replace('Description:', '').trim()
        } else if (part.startsWith('Conditions:')) {
          requirement.conditions = part.replace('Conditions:', '').trim()
        }
      }

      requirements.push(requirement)
    }

    return requirements
  }

  private parseOutputRequirements(token: Tokens.List): Array<{
    element: string
    dataType: string
    format: string
    destination: string
    timing: string
  }> {
    // Check if this is a table by looking for pipe characters in the text
    const fullText = token.items
      .map((item) => {
        return item.tokens
          .filter((t: Tokens.Generic) => t.type === 'text')
          .map((t: Tokens.Generic) => (t as Tokens.Text).text)
          .join(' ')
          .trim()
      })
      .join('\n')

    if (fullText.includes('|')) {
      // This is likely a table, parse it as such
      const rows = fullText.split('\n').filter((row) => row.trim().length > 0)

      // Skip header and separator rows if they exist
      const dataRows = rows.filter((row) => !row.includes('---'))

      return dataRows.map((row) => {
        const cells = row.split('|').filter((cell) => cell.trim().length > 0)
        if (cells.length >= 5) {
          return {
            element: cells[0].trim(),
            dataType: cells[1].trim(),
            format: cells[2].trim(),
            destination: cells[3].trim(),
            timing: cells[4].trim(),
          }
        }
        return {
          element: '',
          dataType: '',
          format: '',
          destination: '',
          timing: '',
        }
      })
    }

    // Default handling for non-table lists
    const requirements = []

    for (const item of token.items) {
      const text = item.tokens
        .filter((t: Tokens.Generic) => t.type === 'text')
        .map((t: Tokens.Generic) => (t as Tokens.Text).text)
        .join(' ')
        .trim()

      // Parse the format: "Element: value | DataType: value | Format: value | Destination: value | Timing: value"
      const parts = text.split('|').map((part) => part.trim())
      const requirement: Record<string, string> = {
        element: '',
        dataType: '',
        format: '',
        destination: '',
        timing: '',
      }

      for (const part of parts) {
        if (part.startsWith('Element:')) {
          requirement.element = part.replace('Element:', '').trim()
        } else if (part.startsWith('DataType:')) {
          requirement.dataType = part.replace('DataType:', '').trim()
        } else if (part.startsWith('Format:')) {
          requirement.format = part.replace('Format:', '').trim()
        } else if (part.startsWith('Destination:')) {
          requirement.destination = part.replace('Destination:', '').trim()
        } else if (part.startsWith('Timing:')) {
          requirement.timing = part.replace('Timing:', '').trim()
        }
      }

      requirements.push(requirement)
    }

    return requirements
  }

  private normalizeSection(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  private extractListItems(token: Tokens.List): string[] {
    return token.items.map((item) =>
      item.tokens
        .filter((t: Tokens.Generic) => t.type === 'text')
        .map((t: Tokens.Generic) => (t as Tokens.Text).text)
        .join(' ')
        .trim(),
    )
  }

  private parseScenarioHeading(text: string): Record<string, unknown> | null {
    const scenarioMatch = text.match(
      /Scenario\s+(\d+):\s+(.+?)(?:\s+\((.+?)\s+Priority\))?/i,
    )
    if (scenarioMatch) {
      return {
        id: `SC-${scenarioMatch[1].padStart(3, '0')}`,
        title: scenarioMatch[2].trim(),
        priority: scenarioMatch[3] || 'Medium',
        type: 'happy_path', // Default type
      }
    }
    return null
  }
}
