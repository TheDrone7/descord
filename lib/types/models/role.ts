export interface RoleData {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags?: RoleTagData;
}

export interface RoleTagData {
  bot_id?: string;
  integration_id?: string;
  premium_subscriber?: null;
}