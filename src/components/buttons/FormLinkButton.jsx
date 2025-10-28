import styles from "./LinkButton.module.css";

import { Link } from "react-router-dom";
import FormButton from "./FormButton";

function FormLinkButton({ route, children }) {
    return (
        <Link to={route} className={styles.linkBtn}>
            <FormButton>{children}</FormButton>
        </Link>
    );
}

export default FormLinkButton;
