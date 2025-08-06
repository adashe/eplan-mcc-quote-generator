import styles from "./KitSummaryPartsListItem.module.css";

function KitSummaryPartsListItem({ part, quantity, kitQuantity }) {
    return (
        <li className={styles.listItem}>
            <div className={styles.qtyCol}>{quantity * kitQuantity}</div>
            <div className={styles.partNumCol}>{part?.id || part}</div>
            <div className={styles.partDescCol}>
                {part?.description || "Item not found in parts database"}
            </div>
            <div>{part?.manufacturer}</div>
            <div>${part?.price.toFixed(2) || 0.0}</div>
            <div>
                ${(part?.price * quantity * kitQuantity).toFixed(2) || 0.0}
            </div>
        </li>
    );
}

export default KitSummaryPartsListItem;
