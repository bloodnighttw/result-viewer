import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {fetch} from "@tauri-apps/plugin-http";
import 'bootstrap/dist/css/bootstrap.css';


interface Props {
    setSession: ([string,(session:string)=>void]);
    endpoints: ([string,(endpoint:string)=>void]);
}


export function Login(props:Props){

    const navigate = useNavigate();

    const [account,setAccount] = useState("");
    const [password,setPassword] = useState("");
    const [endpoint,setEndpoints] = props.endpoints;
    const [_,setSession] = props.setSession;


    return <div>


        <div className="form-group">
            <label className="p-2">Server URL</label>
            <input type="text" className="p-2 form-control" placeholder="endpoints" value={endpoint}
                   onChange={(e) => setEndpoints(e.target.value)}
            />
        </div>

        <div>
            <label className="p-2">Account</label>
            <input type="text" className="p-2 form-control" placeholder="account"
                   onChange={(e) => setAccount(e.target.value)}
            />
        </div>

        <div>
            <label className="p-2">password</label>
            <input type="password" className="p-2 form-control" placeholder="password"
                   onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        <button className="p-2"
                onClick={(_) => {
                    fetch(endpoint + "/user/login", {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({username: account, password: password})
                    }).then((e) => {
                        if (e.status == 200) {
                            e.json().then((args) => {
                                setSession(args.token)
                                console.log("login success! token:" + args.token)
                                navigate("/list")
                            })
                        }

                    }).catch(console.log)

                }}
        >login
        </button>

    </div>
}