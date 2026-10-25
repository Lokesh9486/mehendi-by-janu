/**
 * Minimal typings for Node's built-in `node:sqlite` module
 * (available in Node 22.5+). The project is pinned to @types/node v20,
 * which does not ship these declarations yet.
 */
declare module "node:sqlite" {
  export type SQLInputValue =
    | string
    | number
    | bigint
    | null
    | Uint8Array;

  export interface StatementResultingChanges {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }

  export class StatementSync {
    run(...params: SQLInputValue[]): StatementResultingChanges;
    get(...params: SQLInputValue[]): Record<string, unknown> | undefined;
    all(...params: SQLInputValue[]): Record<string, unknown>[];
  }

  export type DatabaseSyncOptions = {
    open?: boolean;
    readOnly?: boolean;
    enableForeignKeyConstraints?: boolean;
    enableDoubleQuotedStringLiterals?: boolean;
    allowExtension?: boolean;
    timeout?: number;
  };

  export class DatabaseSync {
    constructor(path: string, options?: DatabaseSyncOptions);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
