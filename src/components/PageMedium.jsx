import styles from "./PageMedium.module.css";
import { Header } from "./Header";

function PageMedium({ children }) {
    return (
        <div className={styles.page}>
            <Header>MCC Quote Generator</Header>
            {children}
        </div>
    );
}

export default PageMedium;
