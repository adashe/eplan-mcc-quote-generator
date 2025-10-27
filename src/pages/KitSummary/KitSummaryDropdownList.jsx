import styles from "./KitSummaryDropdownList.module.css";

function KitSummaryDropdownList({ kit }) {
    return (
        <ul>
            <li className={styles.listItem}>HP: {kit.hp}hp</li>
            <li className={styles.listItem}>Type: {kit.type}</li>
            <li className={styles.listItem}>Shoe Size: {kit.shoeMM}mm</li>
            <li className={styles.listItem}>Macro: {kit.macro}</li>
        </ul>
    );
}

export default KitSummaryDropdownList;
