import { useState } from "react";
import { useMcc } from "../../contexts/MccContext";
import styles from "./KitSummaryRow.module.css";

function KitSummaryRow({ kit }) {
    const { assembly, baseAssembly } = useMcc();
    const [isOpen, setIsOpen] = useState(false);

    const quantity = assembly[kit.id] || baseAssembly[kit.id];

    function handleOpen() {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            <div className={styles.kitRow} onClick={handleOpen}>
                <div className={styles.kitDesc}>{kit.description}</div>
                <div className={styles.kitCol}>{quantity}</div>
                <div className={styles.kitCol}>{kit.fla}A</div>
                <div className={styles.kitCol}>
                    {(kit.fla * quantity).toFixed(1)}A
                </div>
            </div>
        </div>
    );
}

export default KitSummaryRow;
