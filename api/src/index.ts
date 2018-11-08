import { App } from "./server";

const server = new App();

server.app.listen(3001, async () => {
    console.log('Bonjour le port 3001');
})