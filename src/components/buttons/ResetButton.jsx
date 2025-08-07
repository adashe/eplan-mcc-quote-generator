import { useMcc } from "../../contexts/MccContext.jsx";
import styles from "./ResetButton.module.css";

function ResetButton() {
    const { handleReset } = useMcc();

    return (
        <button onClick={handleReset} className={styles.resetBtn}>
            Reset
        </button>
    );
}

export default ResetButton;
