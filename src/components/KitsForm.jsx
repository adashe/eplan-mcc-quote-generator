import styles from "./KitsForm.module.css";

export function KitsForm({ children }) {
    return (
        <form>
            <div className={styles.row}>
                <div className={`${styles.column} ${styles.columnHeader}`}>
                    Quantity
                </div>
                <div className={`${styles.column} ${styles.columnHeader}`}>
                    Subassembly
                </div>
                <div className={`${styles.column} ${styles.columnHeader}`}>
                    Kit Price
                </div>
            </div>
            {children}
        </form>
    );
}
