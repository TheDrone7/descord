import { Guild } from '../models/model.ts';
import { Collection } from '../utils/util.ts';
class GuildManager extends Collection<string, Guild> {
  constructor() {
    super();
  }
}
export default GuildManager;
