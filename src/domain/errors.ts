import type { ZodIssue } from 'zod';
import type { Conflict } from './conflicts';
import type { MissingTarget } from './types';

export type AppErrorCode =
  | 'config-version'
  | 'config-invalid'
  | 'config-json'
  | 'fixtures-required'
  | 'unresolved-conflicts'
  | 'package-invalid'
  | 'generation-failed'
  | 'file-read';

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

export class ConfigVersionError extends AppError {
  readonly version: unknown;

  constructor(version: unknown) {
    super('config-version', `Unsupported config version: ${String(version)}`);
    this.name = 'ConfigVersionError';
    this.version = version;
  }
}

export class ConfigValidationError extends AppError {
  readonly issues: ZodIssue[];

  constructor(issues: ZodIssue[]) {
    super('config-invalid', 'Config does not match the schema');
    this.name = 'ConfigValidationError';
    this.issues = issues;
  }
}

export class ConfigJsonError extends AppError {
  constructor() {
    super('config-json', 'Config file is not valid JSON');
    this.name = 'ConfigJsonError';
  }
}

export class FixturesRequiredError extends AppError {
  constructor(detail: string) {
    super(
      'fixtures-required',
      `This build requires T0 fixtures before it can emit OOXML facts (${detail}).`,
    );
    this.name = 'FixturesRequiredError';
  }
}

export class UnresolvedConflictsError extends AppError {
  readonly conflicts: Conflict[];

  constructor(conflicts: Conflict[]) {
    super('unresolved-conflicts', 'Conflicts must be resolved before generating a file');
    this.name = 'UnresolvedConflictsError';
    this.conflicts = conflicts;
  }
}

export class PackageStructureError extends AppError {
  readonly problems: string[];

  constructor(problems: string[]) {
    super('package-invalid', `Base package is invalid: ${problems.join('; ')}`);
    this.name = 'PackageStructureError';
    this.problems = problems;
  }
}

export class MissingTargetsError extends AppError {
  readonly missing: MissingTarget[];

  constructor(missing: MissingTarget[]) {
    super('generation-failed', 'Config references targets that are not in the catalog');
    this.name = 'MissingTargetsError';
    this.missing = missing;
  }
}

export class InvalidCombosError extends AppError {
  readonly bindingIds: string[];

  constructor(bindingIds: string[]) {
    super('generation-failed', 'Config has key combinations that are invalid for the platform');
    this.name = 'InvalidCombosError';
    this.bindingIds = bindingIds;
  }
}
