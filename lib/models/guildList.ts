import { List } from "../util/util.ts";
import { Guild } from './models.ts';

export default class GuildList extends List<string, Guild> {
    constructor(...guilds: Guild[]) { super(...guilds); }
}