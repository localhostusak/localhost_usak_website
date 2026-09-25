import * as migration_20260920_011155_initial_schema from './20260920_011155_initial_schema';
import * as migration_20260920_034150_add_reset_password_requested_at from './20260920_034150_add_reset_password_requested_at';
import * as migration_20260925_035500_add_vision_messages from './20260925_035500_add_vision_messages';

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
    up: migration_20260925_035500_add_vision_messages.up,
    down: migration_20260925_035500_add_vision_messages.down,
    name: '20260925_035500_add_vision_messages',
  },
];
