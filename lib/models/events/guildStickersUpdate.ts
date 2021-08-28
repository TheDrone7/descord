import Client from '../../client.ts';
import { StickerData, GatewayPayload } from '../../types/index.ts';
import { GuildStickers } from '../sticker.ts';
import { Guild } from '../guild.ts';

export default (client: Client, raw: GatewayPayload) => {
  const updated = new GuildStickers(client, ...(raw.d.stickers as StickerData[]));
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  guild.stickers = updated;
  client.guilds.set(guild.id, guild);
  client.log('DEBUG', `Guild Stickers Update event received for guild with ID ${raw.d.guild_id}.`);
  client.execute('guildStickersUpdate', guild, updated);
}