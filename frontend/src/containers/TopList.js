import {connect} from "react-redux";
import {useEffect, useState} from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";
import base_styles from '../styles/base.module.css'
import toplist_styles from '../styles/toplist.module.css'

const TopList = ({isAuthenticated, isLoading, user}) => {
    const [data, setData] = useState()
    const getTopList = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_toplist/`);
            // setData(res.data);
            setData([
                    {"id": 1, "name": "Player1", "games": 53, "wins": 26, "win_rate": 49.1},
                    {"id": 2, "name": "Player2", "games": 82, "wins": 37, "win_rate": 45.1},
                    {"id": 3, "name": "Player3", "games": 64, "wins": 28, "win_rate": 43.8},
                    {"id": 4, "name": "Player4", "games": 19, "wins": 6, "win_rate": 31.6},
                    {"id": 5, "name": "Player5", "games": 91, "wins": 42, "win_rate": 46.2},
                    {"id": 6, "name": "Player6", "games": 75, "wins": 34, "win_rate": 45.3},
                    {"id": 7, "name": "Player7", "games": 37, "wins": 14, "win_rate": 37.8},
                    {"id": 8, "name": "Player8", "games": 60, "wins": 23, "win_rate": 38.3},
                    {"id": 9, "name": "Player9", "games": 42, "wins": 19, "win_rate": 45.2},
                    {"id": 10, "name": "Player10", "games": 69, "wins": 30, "win_rate": 43.5},
                    {"id": 11, "name": "Player11", "games": 27, "wins": 11, "win_rate": 40.7},
                    {"id": 12, "name": "Player12", "games": 48, "wins": 21, "win_rate": 43.8},
                    {"id": 13, "name": "Player13", "games": 88, "wins": 40, "win_rate": 45.5},
                    {"id": 14, "name": "Player14", "games": 55, "wins": 24, "win_rate": 43.6},
                    {"id": 15, "name": "Player15", "games": 34, "wins": 14, "win_rate": 41.2},
                    {"id": 16, "name": "Player16", "games": 76, "wins": 32, "win_rate": 42.1},
                    {"id": 17, "name": "Player17", "games": 43, "wins": 18, "win_rate": 41.9},
                    {"id": 18, "name": "Player18", "games": 61, "wins": 26, "win_rate": 42.6},
                    {"id": 19, "name": "Player19", "games": 22, "wins": 9, "win_rate": 40.9},
                    {"id": 20, "name": "Player20", "games": 95, "wins": 43, "win_rate": 45.3}
                ]
            )
            console.log(res.data[0])
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        if (!isLoading && !data) {
            getTopList()
        }
    }, [isLoading, isAuthenticated, data]);

    if (data) {
        return (
            <div className={toplist_styles.wrapper}>
                <div className={toplist_styles['table-wrapper']}>
                    <table className={toplist_styles["top-list-table"]}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Games</th>
                            <th>Wins</th>
                            <th>Win Rate</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.games}</td>
                                <td>{item.wins}</td>
                                <td>{item.win_rate}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    } else {
        return <LoadingSpinner/>
    }
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    user: state.auth.user,
});

export default connect(mapStateToProps, {})(TopList);
