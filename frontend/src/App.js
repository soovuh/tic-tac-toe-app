import axios from "axios";
import {useState} from "react";

function App() {
    const [data, setData] = useState([]);
    axios.get('http://localhost:8000/api/test/').then(res => {
        const data = res.data;
        setData(data)
    })

    return (
        data.map(obj => (
                <div>
                    <h1>{obj.first_name}</h1>
                    <h2>{obj.last_name}</h2>
                    <h3>{obj.created_at}</h3>
                </div>
            )
        )
    )
}

export default App;
