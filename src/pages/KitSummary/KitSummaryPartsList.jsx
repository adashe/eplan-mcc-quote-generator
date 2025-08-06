import { useMcc } from "../../contexts/MccContext";
import styles from "./KitSummaryPartsListItem.module.css";

import KitSummaryPartsListItem from "./KitSummaryPartsListItem";

function KitSummaryPartsList({ parts, kitQuantity }) {
    const { partsData } = useMcc();

    // Build a list of parts in each kit from the kit.parts array with the part numbers and their quantities
    let kitParts = {};

    parts.forEach((part) => {
        const partID = Object.keys(part)[0];
        const qty = Object.values(part)[0];

        kitParts[partID] = kitParts[partID] + qty || qty;
    });

    // Use the kitBom object to filter the partsData array
    const selectedPartsArr = partsData.filter((part) => kitParts[part.id] > 0);

    return (
        <ul>
            <li className={styles.listItem}>
                <div className={styles.qtyCol}>QTY</div>
                <div className={styles.partNumCol}>PART NUM</div>
                <div className={styles.partDescCol}>DESCRIPTION</div>
                <div>MANU</div>
                <div>PRICE</div>
                <div>TOTAL</div>
            </li>
            {selectedPartsArr.map((part, i) => (
                <KitSummaryPartsListItem
                    part={part}
                    quantity={kitParts[part.id]}
                    kitQuantity={kitQuantity}
                    key={i}
                />
            ))}
        </ul>
    );
}

export default KitSummaryPartsList;
