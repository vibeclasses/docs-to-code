// Import types and classes
import { JsonToMarkdownConverter, MarkdownToJsonConverter } from "./converters/index.js";
import { SchemaValidator } from "./schemas/index.js";
import type { DocumentType } from "./types/index.js";

// Main package exports
export { JsonToMarkdownConverter, MarkdownToJsonConverter } from "./converters/index.js";
export { SchemaValidator } from "./schemas/index.js";
export { ProjectStructureGenerator } from "./generators/folder-structure.js";

export type {
  UserStory,
  AcceptanceCriteria,
  FunctionalRequirement,
  DocumentType,
  ValidationResult,
  ConversionOptions,
  ProjectStructure,
  CLIOptions,
} from "./types/index.js";

export {
  userStorySchema,
  acceptanceCriteriaSchema,
  functionalRequirementsSchema,
} from "./schemas/index.js";

// Main toolkit class for programmatic usage
export class AgileDocsToolkit {
  private jsonToMdConverter: JsonToMarkdownConverter;
  private mdToJsonConverter: MarkdownToJsonConverter;
  private validator: SchemaValidator;

  constructor() {
    this.jsonToMdConverter = new JsonToMarkdownConverter();
    this.mdToJsonConverter = new MarkdownToJsonConverter();
    this.validator = new SchemaValidator();
  }

  // Validation methods
  async validateDocument(data: any, type: DocumentType) {
    return this.validator.validate(data, type);
  }

  // Conversion methods
  async convertJsonToMarkdown(data: any, type: DocumentType) {
    return this.jsonToMdConverter.convert(data, {
      templateType: type,
      outputFormat: "markdown",
    });
  }

  async convertMarkdownToJson(content: string, type: DocumentType) {
    return this.mdToJsonConverter.convert(content, type);
  }

  // Bulk operations
  async validateMultiple(documents: Array<{ data: any; type: DocumentType }>) {
    return Promise.all(
      documents.map((doc) => this.validateDocument(doc.data, doc.type))
    );
  }

  async convertMultiple(documents: Array<{ data: any; type: DocumentType }>) {
    return Promise.all(
      documents.map((doc) => this.convertJsonToMarkdown(doc.data, doc.type))
    );
  }
}
