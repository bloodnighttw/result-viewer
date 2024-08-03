import {useEffect, useState} from "react";
import {fetch} from "@tauri-apps/plugin-http";
import '../main.css'

interface Props{
    endpoint:string,
    session:string,
}

export function List(props:Props){

    const [page,setPage] = useState(0);
    const [pageMax,setPageMax] = useState(0);
    const [videos,setVideos] = useState([]);

    const reload = ()=>{
        fetch(props.endpoint + "/video/count",{
            method:"GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': props.session
            }
        }).then((res)=>{
            if(res.status == 200){
                res.json().then((args)=>{
                    setPageMax(args.count)
                    console.log(args)
                })
            }
        }).catch(console.error)

        fetch(props.endpoint + "/video/list/"+page,{
            method:"GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': props.session
            }
        })
            .then((res)=> res.status == 200 ? res.json() : null)
            .then((json)=>{
                setVideos(json)
                console.log(json)
            })
            .catch(console.error)
    }

    const markReady = (id:number)=>{
        fetch(props.endpoint + "/video/mark/"+id+"/ready",{
            method:"POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': props.session
            }
        })
            .then((res)=> res.status == 200 ? res.json() : null)
            .then(reload)
            .catch(console.error)

    }

    const markNotDetect = (id:number)=>{
        fetch(props.endpoint + "/video/mark/"+id+"/complete",{
            method:"POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': props.session
            }
        })
            .then((res)=> res.status == 200 ? res.json() : null)
            .then(reload)
            .catch(console.error)
        
    }

    useEffect(()=>{
        reload()
    },[setPageMax,setVideos])

    return <div className="container p-2">
        <div>
            <label>MAX Page:{Math.ceil(pageMax/100)}. Each page has 100 element at most. PAGE:</label>
            <input type="text" onChange={(e)=>setPage(+e.target.value)} value={page}/>
            <button onClick={reload}>Reload</button>
        </div>

        <table className="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col" className="">image</th>
                <th scope="col">title</th>
                <th scope="col">description</th>
                <th scope="col">mark</th>

            </tr>
            </thead>
            <tbody>
            {videos.map((x) => (
                <tr>
                    <th scope="row">{x["id"]}</th>
                    <th><img src={x["thumbnail_url"]} className="img-sm"/></th>
                    <td>{x["title"]}</td>
                    <td>{x["description"]}</td>
                    <td>
                        <button disabled={x["is_reviewed"]!== null || x["is_complete"]} onClick={()=>markReady(x["id"])}>Mark Ready</button>
                        <button disabled={x["is_complete"]} onClick={()=>markNotDetect(x["id"])}>Mark not to detect</button>
                    </td>

                </tr>
            ))}
            </tbody>
        </table>

    </div>
}