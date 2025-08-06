import styles from "./PageNarrow.module.css";
import { Header } from "./Header";

function PageNarrow({ children }) {
    return (
        <div className={styles.page}>
            <Header>MCC Quote Generator</Header>
            {children}
        </div>
    );
}

export default PageNarrow;
