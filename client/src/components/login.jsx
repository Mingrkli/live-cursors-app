import { useState } from "react";

export function Login({ onSubmit }) {
    const [username, setUsername] = useState("");
    return (
        <>
            <h1>Welcome</h1>
            <p>What should people call you?</p>
            {/* When we submit the username form, we'll prevent default and run the onSubmit prop which is connected to the App.jsx which will setUsername to the input value */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(username);
                }}
            >
                <input
                    type="text"
                    value={username}
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input type="submit" />
            </form>
        </>
    );
}
