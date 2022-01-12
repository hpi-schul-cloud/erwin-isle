# ErWIn Conventions

The following is a collection of development guidelines inclduing documentation and code conventions.
Follow the [ReadMe](../README.md) to get started with install and setup of the project.

## Programming Model

### Layers (Controller, Services, Presistance)

### Transport Objects

### Authentification

### Error Handling (Exceptions)

### Logging

## Coding Guidelines

### Imports (index.ts)

The root path is set to _src_, so you can use `@root` in paths. If the module is in the same package, use relative paths in imports.

### Linter settings (ESlint / Prettier)

ESLint with Prettier ensures consistent code formatting and static code analysis to pass.  
For configuration details see [.eslintrc.js](../.eslintrc.js) and [.prettierrc.js](../.prettierrc.js).

#### TypeScript Keywords

## Testing

Unit tests are strictly separated from integration/E2E tests.  
Unit test files end on `.unit-spec.ts`.  
Integration test files end on `.integration-spec.ts`.  
E2E test files end on `.e2e-spec.ts`.

### Levels

#### Unit Tests

Unit tests have no dependencies on other systems. If other systems are necessary, these are mocked.

#### Integration Tests

Integration tests have dependencies on other systems like database or Keycloak.

#### System Tests

#### End-To-End Tests

WIP

### Quality Criteria

### Automation (CI/CD)

## Documentation

### README.md

### APIs

### User and Admin Manual
