import { Link } from "react-router-dom";
import Button from "./Button";
import styles from "./LinkButton.module.css";

function LinkButton({ route, children }) {
    return (
        <Link to={route} className={styles.linkBtn}>
            <Button>{children}</Button>
        </Link>
    );
}

export default LinkButton;
