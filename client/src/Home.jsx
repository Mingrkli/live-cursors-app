import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { Cursor } from "./components/Cursor";

const renderCursor = (users) => {
    return Object.keys(users).map((uuid) => {
        const user = users[uuid];

        return <Cursor key={uuid} point={[user.state.x, user.state.y]} />;
    });
};

const renderUsersList = (users) => {
    return (
        <ul>
            {Object.keys(users).map((uuid) => {
                return <li key={uuid}>{JSON.stringify(users[uuid])}</li>;
            })}
        </ul>
    );
};

export function Home({ username }) {
    const WS_URL = "ws://localhost:8000";
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
        queryParams: { username },
    });

    // Makes it so that the function don't get called more than once in this amount of milliseconds no matter how many times it could have run
    const THROTTLE = 50;
    // useRef when wrapping a function, returns an object with property called current that represents the method
    const sendJsonMessageThrottled = useRef(
        throttle(sendJsonMessage, THROTTLE)
    );

    // Run first time when the component is rendered
    useEffect(() => {
        // ask the server to send everyone's state the second we load the components
        sendJsonMessage({
            x: 0,
            y: 0,
        });
        window.addEventListener("mousemove", (e) => {
            sendJsonMessageThrottled.current({
                x: e.clientX,
                y: e.clientY,
            });
        });
    }, []);

    if (lastJsonMessage) {
        return (
            <>
                {renderCursor(lastJsonMessage)}
                {renderUsersList(lastJsonMessage)}
            </>
        );
    }
    return <h1>Hello, {username}</h1>;
}
