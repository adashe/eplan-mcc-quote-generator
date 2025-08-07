import styles from "./KitsForm.module.css";

export function KitsForm({ children }) {
    return (
        <form>
            <div className={styles.row}>
                <div className={`${styles.column} ${styles.columnHeader}`}>
                    Quantity
                </div>
                <div className={`${styles.column} ${styles.columnHeader}`}>
                    Starters
                </div>
                <div className={`${styles.column} ${styles.columnHeader}`}>
                    FLA
                </div>
            </div>
            {children}
        </form>
    );
}
