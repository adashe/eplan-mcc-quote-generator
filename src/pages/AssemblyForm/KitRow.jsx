import { useMcc } from "../../contexts/MccContext";
import styles from "./KitsForm.module.css";

// Select the entire value when user clicks in the input box (for easier editing)
function handleSelect(e) {
    e.target.select();
}

export function KitRow({ kit }) {
    const {
        assembly,
        handleChangeAssembly,
        handleIncrementAssembly,
        calcKitPrice,
    } = useMcc();

    return (
        <div className={styles.row}>
            <div className={styles.column}>
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
                    <span className={styles.kitRowDesc}>{kit.description}</span>
                </label>
            </div>

            <div className={styles.column}>
                ${calcKitPrice(kit.id).toFixed(2)}
            </div>
        </div>
    );
}
