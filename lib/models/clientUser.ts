import Client from '../client.ts';
import { ClientActivity, ClientPresence, PresenceStatus, UserData } from '../types/types.ts';
import User from './user.ts';

export default class ClientUser extends User {
    presence?: ClientPresence;

    constructor(client: Client, userData: UserData) { super(client, userData); }

    updatePresence(presence: ClientPresence) { this.client.wsSend({ op: 3, d: presence }); }
    setActivity(activity: ClientActivity) {
        let presence = this.presence || { status: 'ONLINE', since: null, activities: null, afk: false };
        presence.activities = [activity];
        this.client.wsSend({ op: 3, d: presence });
        this.presence = presence;
    }
    setStatus(status: PresenceStatus) {
        let presence = this.presence || { status: 'ONLINE', since: null, activities: null, afk: false };
        presence.status = status;
        this.client.wsSend({ op: 3, d: presence });
        this.presence = presence;
    }
    setAFK(afk: boolean) {
        let presence = this.presence || { status: 'ONLINE', since: null, activities: null, afk: false };
        presence.afk = afk;
        this.client.wsSend({ op: 3, d: presence });
        this.presence = presence;
    }
}