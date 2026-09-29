import 'server-only';

import { createClient, type Client } from '@libsql/client';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

import { SCHEMA_STATEMENTS, SEED_STATEMENTS } from './schema';

const DEFAULT_LOCAL_URL = 'file:.data/ardmore.db';

/**
 * Hosted deployments talk to Turso; local development falls back to a
 * file-backed libSQL database so there is nothing to install or sign up for.
 * Both speak the same protocol, so the query code never has to branch.
 */
function connect(): Client {
  const tursoUrl = process.env.TURSO_DATABASE_URL;

  if (tursoUrl) {
    return createClient({ url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN });
  }

  const url = process.env.LOCAL_DATABASE_URL ?? DEFAULT_LOCAL_URL;
  if (url.startsWith('file:')) {
    // libSQL will create the file but not the directory holding it.
    mkdirSync(dirname(url.slice('file:'.length)), { recursive: true });
  }

  return createClient({ url });
}

// The dev server re-evaluates modules on every edit; keep one connection and
// one migration run per process.
const cache = globalThis as unknown as {
  __ardmoreClient?: Client;
  __ardmoreReady?: Promise<Client>;
};

async function migrate(client: Client): Promise<Client> {
  for (const sql of SCHEMA_STATEMENTS) {
    await client.execute(sql);
  }

  const { rows } = await client.execute('SELECT COUNT(*) AS n FROM claims');
  if (Number(rows[0]?.n ?? 0) === 0) {
    for (const statement of SEED_STATEMENTS) {
      await client.execute(statement);
    }
  }

  return client;
}

/** Returns a migrated (and, on first run, seeded) database client. */
export function db(): Promise<Client> {
  if (!cache.__ardmoreReady) {
    cache.__ardmoreClient ??= connect();
    cache.__ardmoreReady = migrate(cache.__ardmoreClient).catch((error) => {
      // Let the next request retry instead of caching a failed migration.
      cache.__ardmoreReady = undefined;
      throw error;
    });
  }

  return cache.__ardmoreReady;
}
