import { FaSpinner } from 'react-icons/fa';
import styles from '../styles/spinner.module.css'

const LoadingSpinner = () => {
    return (
        <div className={styles["loading-spinner"]}>
            <FaSpinner className={styles.spin} />
        </div>
    );
};

export default LoadingSpinner;