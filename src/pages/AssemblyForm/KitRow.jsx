import { useMcc } from "../../contexts/MccContext";
import styles from "./KitsForm.module.css";

// Select the entire value when user clicks in the input box (for easier editing)
function handleSelect(e) {
    e.target.select();
}

export function KitRow({ kit }) {
    const {
        assembly,
        interlock,
        handleChangeAssembly,
        handleIncrementAssembly,
        handleChangeInterlock,
    } = useMcc();

    return (
        <div className={styles.row}>
            <div className={styles.columnXWide}>
                <label className={styles.kitRowLabel}>
                    <span
                        className={styles.materialSymbolsOutlined}
                        onClick={() => handleIncrementAssembly(kit.id, -1)}
                    >
                        remove
                    </span>
                    <input
                        className={styles.kitRowInput}
                        type="number"
                        name={kit.id}
                        value={Number(assembly[kit.id]).toString()}
                        onChange={handleChangeAssembly}
                        onFocus={handleSelect}
                        min={0}
                    />
                    <span
                        className={styles.materialSymbolsOutlined}
                        onClick={() => handleIncrementAssembly(kit.id, 1)}
                    >
                        add
                    </span>
                    <span
                        className={`${styles.kitRowDesc} 
                        ${kit.colorCode === "vfd-1" ? styles.vfd1Row : ""} 
                        ${kit.colorCode === "vfd-2" ? styles.vfd2Row : ""} 
                        ${kit.colorCode === "vacuum" ? styles.vacuumRow : ""} 
                        ${kit.colorCode === "breaker" ? styles.breakerRow : ""} 
                        ${kit.colorCode === "prepGun" ? styles.prepGunRow : ""} 
                        ${kit.colorCode === "vacuum-ss" ? styles.ssRow : ""}`}
                    >
                        {kit.description}
                    </span>
                </label>
            </div>

            <div className={styles.column}>{kit.fla}A</div>
            <div className={styles.column}>
                <input
                    className={styles.kitRowCheckbox}
                    name={kit.id}
                    value={interlock[kit.id]}
                    checked={interlock[kit.id]}
                    onChange={handleChangeInterlock}
                    type="checkbox"
                />
            </div>
        </div>
    );
}
