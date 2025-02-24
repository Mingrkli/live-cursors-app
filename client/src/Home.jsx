import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";

export function Home({ username }) {
    const WS_URL = "ws://localhost:8000";
    const { sendJsonMessage } = useWebSocket(WS_URL, {
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
        window.addEventListener("mousemove", (e) => {
            sendJsonMessageThrottled.current({
                x: e.clientX,
                y: e.clientY,
            });
        });
    }, []);

    return <h1>Hello, {username}</h1>;
}
