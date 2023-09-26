import {connect} from "react-redux";
import {useEffect, useState} from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";
import toplist_styles from '../styles/toplist.module.css'

const TopList = ({isAuthenticated, isLoading, user}) => {
    const [data, setData] = useState()
    const [userItemId, setUserItemId] = useState(null)
    const [currentOrdering, setCurrentOrdering] = useState(['-', 'games'])
    const getTopList = async () => {
        const ordering_by = `${currentOrdering[0]}${currentOrdering[1]}`
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/top-list/?ordering=${ordering_by}`);
            setData(res.data);
        } catch (e) {
            console.error(e)
        }
    }

    const setNewOrdering = (ordering) => {
        if (currentOrdering[1] === ordering) {
            if (currentOrdering[0] === '-') {
                setCurrentOrdering(['', ordering])
            } else {
                setCurrentOrdering(['-', ordering])
            }
        } else {
            if (ordering === 'name') {
                setCurrentOrdering(['', ordering])
            } else {
                setCurrentOrdering(['-', ordering])
            }
        }
        setData(null)
    }

    const findUser = () => {
        if (isAuthenticated && user) {
            if (isAuthenticated && user && userItemId) {
                const table = document.querySelector(`.${toplist_styles["table-wrapper"]}`);
                const userRow = document.querySelector(`.${toplist_styles.user_row}`);
                if (table && userRow) {
                    table.scrollTop = userRow.offsetTop - table.offsetTop;
                }
            }
        }
    }

    useEffect(() => {
        if (!isLoading && !data) {
            getTopList()
        }
    }, [isLoading, isAuthenticated, data]);

    useEffect(() => {
        if (!isLoading && data && isAuthenticated && user) {
            setUserItemId(user.id)
        }
    }, [isLoading, data, isAuthenticated, user])


    if (data && !isLoading) {
        return (
            <div className={toplist_styles.wrapper}>
                {isAuthenticated &&
                    <div className={toplist_styles.find_btn_wrap}>
                        <button className={toplist_styles.find_btn} onClick={findUser}>Find me
                        </button>
                    </div>}
                <div className={toplist_styles['table-wrapper']}>
                    <table className={toplist_styles["top-list-table"]}>
                        <thead>
                        <tr>
                            <th onClick={() => setNewOrdering('name')}>Name</th>
                            <th onClick={() => setNewOrdering('games')}>Games</th>
                            <th onClick={() => setNewOrdering('wins')}>Wins</th>
                            <th onClick={() => setNewOrdering('win_rate')}>Winrate</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map(item => (
                            <tr key={item.id} className={userItemId === item.id ? toplist_styles.user_row : ''}>
                                <td>{item.name}</td>
                                <td>{item.games}</td>
                                <td>{item.wins}</td>
                                <td>{item.win_rate}%</td>
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
