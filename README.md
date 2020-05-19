# descord
A discord API wrapper written using TypeScript for [deno](https://deno.land).

This library is in its pre-alpha state. For now, you can connect the discord bot to the discord servers. The library will automatically handle sharding for you. A sample bot written in the library is given below.

```typescript
// Import the client from github.
import { Client } from 'https://raw.githubusercontent.com/TheDrone7/descord/pre-alpha/mod.ts';

// Instantiate a new client.
const client = new Client();

// Handle debug messages
client.on('debug', console.log);

// Handle raw websocket events
client.on('raw', (raw: any) => {
	console.log(`Event fired: ${raw.t}`);
});

// Handle ready event.
client.on('ready', () => {
   console.log(`Logged in as ${client.user.tag}`);
});

client.login('My bot token here!', {
    status: 'dnd'
});
```

You can also send ws messages using the `wsSend()` method of the client. For example: -
```typescript
client.wsSend({
    op: 3,
    d: {
        status: 'dnd',
        afk: false,
        game: {
            name: 'descord',
            type: 4
        }
    }
});
```

For making http request to the discord's REST API, you can use the built-in `fetch` API system or use the client's `HTTPClient` as shown below: -
```ts
let user = await client.http.get('/users/374886124126208000');
if (user.status === 200) console.log(user.body);
else console.error(user.statusText);
```