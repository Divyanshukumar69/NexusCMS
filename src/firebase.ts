// Firebase is no longer used in this project.
// We have migrated to a PostgreSQL + Express backend.

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error('Operation Error: ', error);
  throw new Error('Database operation failed');
}

// db export is removed as we use /api endpoints on the client side.
