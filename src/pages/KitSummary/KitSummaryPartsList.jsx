import styles from "./KitSummaryPartsList.module.css";

function KitSummaryPartsList({ kit }) {
    return (
        <ul>
            <li className={styles.listItem}>MSP: {kit.msp}</li>
            <li className={styles.listItem}>Cont: {kit.msp}</li>
        </ul>
    );
}

export default KitSummaryPartsList;
