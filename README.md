# descord
A discord API wrapper written using TypeScript for [deno](https://deno.land).

This library is in its pre-alpha state. For now, you can connect the discord bot to the discord servers. The library will automatically handle sharding for you. A sample bot written in the library is given below.

```typescript
// Import the client from github.
import { Client } from 'https://raw.githubusercontent.com/TheDrone7/descord/master/mod.ts';

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

