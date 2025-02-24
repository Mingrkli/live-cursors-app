import { useState } from "react";
// import "./App.css";
import { Login } from "./components/login";
import { Home } from "./Home";

function App() {
    const [username, setUsername] = useState("");

    // If there is a username, we'll return the Home component. Otherwise we'll return the Login component
    return username ? (
        <Home username={username} />
    ) : (
        <Login onSubmit={setUsername} />
    );
}

export default App;
