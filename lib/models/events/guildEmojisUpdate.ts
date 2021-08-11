import Client from '../../client.ts';
import { EmojiData, GatewayPayload } from '../../types/index.ts';
import { GuildEmojis } from '../emoji.ts';
import { Guild } from '../guild.ts';

export default (client: Client, raw: GatewayPayload) => {
  const updated = new GuildEmojis(client, raw.d.guild_id, ...(raw.d.emojis as EmojiData[]));
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  guild.emojis = updated;
  client.guilds.set(guild.id, guild);
  client.log('DEBUG', `Guild Emojis Update event received for guild with ID ${raw.d.guild_id}.`);
  client.execute('guildEmojisUpdate', guild, updated);
}