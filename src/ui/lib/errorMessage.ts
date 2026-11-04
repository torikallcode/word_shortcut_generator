import { AppError } from '@/domain/errors';

export function errorMessageKey(error: unknown): string {
  if (error instanceof AppError) {
    switch (error.code) {
      case 'config-version':
        return 'errors.unknownVersion';
      case 'config-invalid':
        return 'errors.invalidConfig';
      case 'config-json':
        return 'errors.invalidJson';
      case 'fixtures-required':
        return 'errors.fixturesRequired';
      case 'unresolved-conflicts':
        return 'errors.unresolved';
      case 'file-read':
        return 'errors.fileRead';
      case 'generation-failed':
      case 'package-invalid':
        return 'errors.generationFailed';
      default:
        return 'errors.generationFailed';
    }
  }
  return 'errors.generationFailed';
}
