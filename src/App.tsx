import {Routes, Route} from "react-router-dom";
import {useState} from "react";
import {Login} from "./compoment/Login.tsx";
import {List} from "./compoment/VideoList.tsx";

function App() {

    const [session, setSession] = useState<string>("");
    const [endpoint, setEndpoint] = useState<string>("http://localhost:8000");

    return (
        <div>
            <Routes>
                <Route path="/" element={<Login setSession={[session,setSession]} endpoints={[endpoint,setEndpoint]}/>}/>
                <Route path="/list" element={<List endpoint={endpoint} session={session}/>}/>
            </Routes>
        </div>

    );
}

export default App;
