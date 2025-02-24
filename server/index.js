// First steps on creating a WebSocket server is to create a http server
import http from "http";
import { WebSocketServer } from "ws";
import url from "url";
import { v4 as uuidv4 } from "uuid";

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const connections = {};
const users = {};

// Here we can use one to one or one to many and etc. but for this example, we are going to be using one to many as a broadcast
const broadcast = () => {
    Object.keys(connections).forEach((uuid) => {
        const connection = connections[uuid];
        const message = JSON.stringify(users);
        connection.send(message);
    });
};

// updates the user state for the mouse cursor position
const handleMessage = (bytes, uuid) => {
    const message = JSON.parse(bytes.toString());
    const user = users[uuid];
    // You can use user.state.x = message.x but since we are changing x and y which are the only things in the state, we can use user.state = message instead
    user.state = message;

    // Every time we handleMessage, we'll broadcast it
    broadcast();

    // console.log(message); // {"x": 0, "y": 0}
    console.log(
        `${user.username} updated their state: ${JSON.stringify(user.state)}`
    );
};

// Delete the user and connection from the dictionary when closed
const handleClose = (uuid) => {
    console.log(`${users[uuid].username} disconnected`);

    delete connections[uuid];
    delete users[uuid];

    // broadcast it so that the clients can see who isn't connected
    // In an actual production app, maybe send some kind of message that a user has disconnected or something like that.
    broadcast();
};

wsServer.on("connection", (connection, req) => {
    // User postman to check, ws://localhost:8000?username=Ming for example
    // Identify the user by parsing the query string
    const { username } = url.parse(req.url, true).query;
    const uuid = uuidv4();
    console.log(username);
    console.log(uuid); // Incase same username, we can use the uuid to generate a unique id

    // broadcast or fan out is when you send something out to every connection

    // Every time there is a new connection, we'll store it in the connections dictionary where the uuid is the the unique identifryer
    connections[uuid] = connection;

    // We don't save it to connection.username is because it's messy and we want to JSON.stringify(user) later which will give us a clean Json back then the entire connection.
    users[uuid] = {
        // username: username, is there username
        // we can simplify this with just username since the property and value is the same name
        username,
        // state, is going to be the position of the mouse cursor
        state: {
            // x: 0,
            // y: 0,
            // presence (any kind meta data) depending what your building
            // For example, typing: true, onlineStatus: "online",
        },
    };

    // For this project, every time the user moves the cursor, it'll send a message which we'll handleMessage
    connection.on("message", (message) => handleMessage(message, uuid));
    // When the connection is lost
    connection.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
});
