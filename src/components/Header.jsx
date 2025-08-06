import styles from "./Header.module.css";

export function Header({ children }) {
    return (
        <div>
            <h3 className={styles.companyName}>SUN COAST CONTROLS</h3>
            <h1 className={styles.pageTitle}>{children}</h1>
        </div>
    );
}
