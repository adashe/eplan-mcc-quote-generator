import styles from "./PageWide.module.css";
import { Header } from "./Header";

function PageWide({ children }) {
    return (
        <div className={styles.page}>
            <Header>MCC Quote Generator</Header>
            {children}
        </div>
    );
}

export default PageWide;
