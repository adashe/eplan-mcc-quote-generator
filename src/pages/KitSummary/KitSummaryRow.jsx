import { useState } from "react";
import { useMcc } from "../../contexts/MccContext";
import styles from "./KitSummaryRow.module.css";

import KitSummaryDropdownList from "./KitSummaryDropdownList";

function KitSummaryRow({ kit }) {
    const { assembly, baseAssembly } = useMcc();
    const [isOpen, setIsOpen] = useState(false);

    const quantity = assembly[kit.id] || baseAssembly[kit.id];

    function handleOpen() {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            <div className={styles.headerRow} onClick={handleOpen}>
                <div className={styles.kitDesc}>{kit.description}</div>
                <div className={styles.kitCol}>Qty: {quantity}</div>
                <div className={styles.kitCol}>FLA: {kit.fla}A</div>
                <div className={styles.kitCol}>
                    Total FLA: {(kit.fla * quantity).toFixed(1)}A
                </div>

                {isOpen ? (
                    <span className={styles.materialSymbolsOutlined}>
                        keyboard_arrow_up
                    </span>
                ) : (
                    <span className={styles.materialSymbolsOutlined}>
                        keyboard_arrow_down
                    </span>
                )}
            </div>

            <div>
                {isOpen ? (
                    <div>
                        <KitSummaryDropdownList kit={kit} />
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}

export default KitSummaryRow;
