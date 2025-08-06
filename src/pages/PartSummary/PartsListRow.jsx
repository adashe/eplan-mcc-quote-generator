import styles from "./PartsListRow.module.css";

export function PartsListRow({ part, partsList }) {
    return (
        <li className={styles.listItem}>
            <div className={styles.qtyCol}>{partsList[part.id]}</div>
            <div className={styles.partNumCol}>{part.id}</div>
            <div className={styles.partDescCol}>{part.description}</div>
            <div>{part.manufacturer}</div>
            <div>${part.price.toFixed(2)}</div>
            <div>${(part.price * partsList[part.id]).toFixed(2)}</div>
        </li>
    );
}
