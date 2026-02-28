# docs-to-code

A CLI + TypeScript toolkit for managing **Agile documentation as structured JSON**, including:

- ✅ **JSON Schema validation** (Ajv)
- 🔁 **Bidirectional conversion**: JSON ⇄ Markdown
- 🧱 **Project scaffolding** for an 5ile for the build flow to validate + convert + generate an index

Repository: https://github.com/vibeclasses/docs-to-code

> Note: This package targets **Node.js >= 22** (see `package.json`).

---

## Install

### Use as a project dependency (recommended)
```bash
npm i @vibeclasses/docs-to-code
```

### Or clone and run from source
```bash
git clone https://github.com/vibeclasses/docs-to-code.git
cd docs-to-code
npm ci
```

---

## CLI usage

The CLI executable is:

- `docs-to-code` (via the `bin/` entrypoint)

### Help
```bash
docs-to-code --help
```

### Initialize a documentation workspace
Interactive scaffolding that creates a folder structure and (optionally) example documents:

```bash
docs-to-code init
```

Options:
- `-o, --output <path>` Output directory (defaults to current working directory)

What it generates (high-level):
- A set of folders like `features/`, `tasks/`, `bugs/`, `acceptance-criteria/`, etc.
- A `main.md` index file
- Templates/schemas copies used by the workflow
- A README for the generated workspace

### Validate JSON documents
Validate JSON files against the supported schemas. By default it validates `**/*.json` under the current directory.

```bash
docs-to-code validate
# or a custom glob pattern:
docs-to-code validate "features/**/*.json"
```

Options:
- `-v, --verbose` Verbose output (prints per-file info)
- `--exclude <pattern>` Exclude pattern (default: `node_modules/**`)

Notes:
- The validator **auto-detects document type** from JSON contents.
- The CLI intentionally ignores common config files (like `package.json`, `tsconfig*.json`, etc.) even if they match the glob.

### Convert JSON → Markdown
Convert JSON documents into Markdown using Handlebars templates.

```bash
docs-to-code convert
# or:
docs-to-code convert "features/**/*.json"
```

Options:
- `-o, --output <path>` Output directory (defaults to the input file’s folder)
- `-v, --verbose` Verbose output
- `--validate` Validate before converting
- `--exclude <pattern>` Exclude pattern (default: `node_modules/**`)

### Convert Markdown → JSON
Convert Markdown back to JSON.

```bash
docs-to-code convert-back
# or:
docs-to-code convert-back "docs/**/*.md"
```

Options:
- `-o, --output <path>` Output directory
- `-t, --type <type>` Force a document type when auto-detection can’t determine it
- `-v, --verbose` Verbose output
- `--validate` Validate after conversion
- `--exclude <pattern>` Exclude pattern (default: `node_modules/**`)

### Build documentation
Build runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ilie for the build flow to validate + convert + generate an index

Repository: https://github.com/vibeclasses/docs-to-code

> Note: This package targets **Node.js >= 22** (see `package.json`).

---

## Install

### Use as a project dependency (recommended)
```bash
npm i @vibeclasses/docs-to-code
```

### Or clone and run from source
```bash
git clone https://github.com/vibeclasses/docs-to-code.git
cd docs-to-code
npm ci
```

---

## CLI usage

The CLI executable is:

- `docs-to-code` (via the `bin/` entrypoint)

### Help
```bash
docs-to-code --help
```

### Initialize a documentation workspace
Interactive scaffolding that creates a folder structure and (optionally) example documents:

```bash
docs-to-code init
```

Options:
- `-o, --output <path>` Output directory (defaults to current working directory)

What it generates (high-level):
- A set of folders like `features/`, `tasks/`, `bugs/`, `acceptance-criteria/`, etc.
- A `main.md` index file
- Templates/schemas copies used by the workflow
- A README for the generated workspace

### Validate JSON documents
Validate JSON files against the supported schemas. By default it validates `**/*.json` under the current directory.

```bash
docs-to-code validate
# or a custom glob pattern:
docs-to-code validate "features/**/*.json"
```

Options:
- `-v, --verbose` Verbose output (prints per-file info)
- `--exclude <pattern>` Exclude pattern (default: `node_modules/**`)

Notes:
- The validator **auto-detects document type** from JSON contents.
- The CLI intentionally ignores common config files (like `package.json`, `tsconfig*.json`, etc.) even if they match the glob.

### Convert JSON → Markdown
Convert JSON documents into Markdown using Handlebars templates.

```bash
docs-to-code convert
# or:
docs-to-code convert "features/**/*.json"
```

Options:
- `-o, --output <path>` Output directory (defaults to the input file’s folder)
- `-v, --verbose` Verbose output
- `--validate` Validate before converting
- `--exclude <pattern>` Exclude pattern (default: `node_modules/**`)

### Convert Markdown → JSON
Convert Markdown back to JSON.

```bash
docs-to-code convert-back
# or:
docs-to-code convert-back "docs/**/*.md"
```

Options:
- `-o, --output <path>` Output directory
- `-t, --type <type>` Force a document type when auto-detection can’t determine it
- `-v, --verbose` Verbose output
- `--validate` Validate after conversion
- `--exclude <pattern>` Exclude pattern (default: `node_modules/**`)

### Build documentation
Build runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 5ile runs a 5ile runs a 5ile runs a 5ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile runs a 6ile for the build flow to validate + convert + generate an index

Repository: https://github.com/vibeclasses/docs-to-code

> Note: This package targets **Node.js >= 22** (see `package.json`).

---

## Install

### Use as a project dependency (recommended)
```bash
npm i @vibeclasses/docs-to-code
```

### Or clone and run from source
```bash
git clone https://github.com/vibeclasses/docs-to-code.git
cd docs-to-code
npm ci
```

---

## CLI usage

The CLI executable is:

- `docs-to-code` (via the `bin/` entrypoint)

### Help
```bash
docs-to-code --help
```

### Initialize a documentation workspace
Interactive scaffolding that creates a folder structure and (optionally) example documents:

```bash
docs-to-code init
```

Options:
- `-o, --output <path>` Output directory (defaults to current working directory)

What it generates (high-level):
- A set of folders like `features/`, `tasks/`, `bugs/`, `acceptance-criteria/`, etc.
- A `main.md` index file
- Templates/schemas copies used by the workflow
- A README for the generated workspace

### Validate JSON documents
Validate JSON files against the supported schemas. By default it validates `**/*.json` under the current directory.

```bash
docs-to-code validate
# or a custom glob pattern:
docs-to-code validate "features/**/*.json"
```

Options:
- `-v, --verbose` Verbose output (prints per-file info)
- `--exclude <pattern>` Exclude pattern (default: `node_modules/**`)

Notes:
- The validator **auto-detects document type** from JSON contents.
- The CLI intentionally ignores common config files (like `package.json`, `tsconfig*.json`, etc.) even if they match the glob.

### Convert JSON → Markdown
Convert JSON documents into Markdown using Handlebars templates.

```bash
docs-to-code convert
# or:
docs-to-code convert "features/**/*.json"
```

Options:
- `-o, --output <path>` Output directory (defaults to the input file’s folder)
- `-v, --verbose` Verbose output
- `--validate` Validate before converting
- `--exclude <pattern>` Exclude pattern (default: `node_modules/**`)

### Convert Markdown → JSON
Convert Markdown back to JSON.

```bash
docs-to-code convert-back
# or:
docs-to-code convert-back "docs/**/*.md"
```

Options:
- `-o, --output <path>` Output directory
- `-t, --type <type>` Force a document type when auto-detection can’t determine it
- `-v, --verbose` Verbose output
- `--validate` Validate after conversion
- `--exclude <pattern>` Exclude pattern (default: `node_modules/**`)

### Build documentation
Build runs a 5ile for the build flow to validate + convert + generate an index

Repository: https://github.com/vibeclasses/docs-to-code

> Note: This package targets **Node.js >= 22** (see `package.json`).

---

## Supported document types

### JSON → Markdown templates exist for:
- `user-story`
- `acceptance-criteria`
- `functional-requirements`
- `bug-report` *(template file exists but is currently empty in this repo)*
- `tech-debt` *(template file exists but is currently empty in this repo)*

### Markdown → JSON conversion currently supports:
- `user-story`
- `acceptance-criteria`
- `functional-requirements`

If you need round-trip conversion for `bug-report` and `tech-debt`, you’ll likely need to implement:
- schemas + parsing in the Markdown converter
- non-empty templates (for consistent structure)

---

## Programmatic (library) usage

The main entrypoint exports `AgileDocsToolkit` for programmatic workflows.

### Example: validate JSON
```ts
import { AgileDocsToolkit } from "@vibeclasses/docs-to-code";

const toolkit = new AgileDocsToolkit();

const userStory = {
  id: "US-001",
  title: "User Login Feature",
  storyStatement: {
    userType: "Registered User",
    goal: "log into the application",
    reason: "access my personalized dashboard"
  },
  storyDetails: {
    epic: "User Authentication",
    priority: "High",
    storyPoints: 5
  }
};

const result = await toolkit.validateDocument(userStory, "user-story");
console.log(result.valid, result.errors);
```

### Example: JSON → Markdown
```ts
import { AgileDocsToolkit } from "@vibeclasses/docs-to-code";

const toolkit = new AgileDocsToolkit();

const md = await toolkit.convertJsonToMarkdown(
  {
    id: "US-001",
    title: "User Login Feature",
    storyStatement: {
      userType: "Registered User",
      goal: "log into the application",
      reason: "access my personalized dashboard"
    }
  },
  "user-story"
);

console.log(md);
```

### Example: Markdown → JSON
```ts
import { AgileDocsToolkit } from "@vibeclasses/docs-to-code";

const toolkit = new AgileDocsToolkit();

const markdown = `# User Login Feature

## User Story
**As a** Registered User
**I want to** log into the application
**So that** I can access my personalized dashboard
`;

const json = await toolkit.convertMarkdownToJson(markdown, "user-story");
console.log(json);
```

---

## Development

### Scripts
```bash
npm run start        # runs CLI from source
npm run dev          # watch mode
npm test             # runs tests with tsx + node:test
npm run lint         # eslint on src/**/*.ts
npm run format       # prettier on src/**/*.ts
```

### Requirements
- Node.js >= 22

---

## Project structure (repo)

- `src/cli.ts` — Commander-based CLI implementation
- `src/index.ts` — Library exports + `AgileDocsToolkit`
- `src/converters/` — JSON⇄Markdown conversion
- `src/schemas/` — Ajv schemas + validation
- `src/generators/` — workspace scaffolding (folder structure + index generation)
- `src/templates/` — Handlebars templates used for Markdown generation
- `tests/` — node:test-based tests (`tsx --test`)

---

## Known limitations / TODOs

- Cross-reference generation in `build --verbose` is currently a placeholder.
- `bug-report` and `tech-debt` templates are present but empty, and Markdown→JSON does not support them yet.

---

## License

MIT (as declared in `package.json`).
