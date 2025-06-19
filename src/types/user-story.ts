import { BaseDocument } from '@types'

export interface UserStory extends BaseDocument {
  storyStatement: {
    userType: string
    goal: string
    reason: string
  }
  storyDetails: {
    epic: string
    priority: 'High' | 'Medium' | 'Low'
    storyPoints: number | string
    sprint?: string
  }
  userContext: {
    primaryPersona: string
    userJourneyStage:
      | 'Awareness'
      | 'Consideration'
      | 'Purchase'
      | 'Usage'
      | 'Advocacy'
    frequencyOfUse: 'Daily' | 'Weekly' | 'Monthly' | 'Rarely'
    technicalSkillLevel: 'Beginner' | 'Intermediate' | 'Advanced'
  }
  detailedRequirements: {
    userNeeds: string[]
    successCriteria: string[]
  }
  businessValue?: {
    revenueImpact?: string
    userExperienceImprovement?: string
    operationalEfficiency?: string
    strategicAlignment?: string
  }
  dependencies?: {
    technical?: string[]
    content?: string[]
    team?: string[]
  }
  definitionOfReady?: Array<{
    item: string
    completed: boolean
  }>
  acceptanceCriteria: Array<{
    scenario: string
    given: string
    when: string
    then: string
    and?: string[]
  }>
  notes?: string[]
}
