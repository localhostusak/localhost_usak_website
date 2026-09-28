import * as migration_20260920_011155_initial_schema from './20260920_011155_initial_schema';
import * as migration_20260920_034150_add_reset_password_requested_at from './20260920_034150_add_reset_password_requested_at';
import * as migration_20260928_192652_reconcile_schema_drift from './20260928_192652_reconcile_schema_drift';

export const migrations = [
  {
    up: migration_20260920_011155_initial_schema.up,
    down: migration_20260920_011155_initial_schema.down,
    name: '20260920_011155_initial_schema',
  },
  {
    up: migration_20260920_034150_add_reset_password_requested_at.up,
    down: migration_20260920_034150_add_reset_password_requested_at.down,
    name: '20260920_034150_add_reset_password_requested_at',
  },
  {
    up: migration_20260928_192652_reconcile_schema_drift.up,
    down: migration_20260928_192652_reconcile_schema_drift.down,
    name: '20260928_192652_reconcile_schema_drift'
  },
];
