import { useMcc } from "../../contexts/MccContext";
import styles from "./KitSummaryRow.module.css";

import PageMedium from "../../components/PageMedium";
import TabNavigation from "../../components/TabNavigation";

import KitSummaryRow from "./KitSummaryRow";
import Button from "../../components/buttons/Button";
import LinkButton from "../../components/buttons/LinkButton";
import EECButton from "../../components/buttons/EECButton";

function KitSummary() {
    const { kitsData, assembly } = useMcc();

    // Filter kitsData to include only kits selected by user
    const selectedKitsArr = kitsData.filter((kit) => assembly[kit.id] > 0);

    return (
        <PageMedium>
            <TabNavigation>
                <LinkButton route={"/assembly"}>&larr; Edit Inputs</LinkButton>
                <Button isActive={false}>Starters Summary</Button>
                <LinkButton route={"/mccSummary"}>MCC SUMMARY</LinkButton>
                <EECButton />
            </TabNavigation>
            <h2>STARTERS SUMMARY</h2>

            <div className={styles.headerRow}>
                <div className={styles.headerRowWide}>STARTERS</div>
                <div className={styles.headerRowNarrow}>QTY</div>
                <div className={styles.headerRowNarrow}>FLA</div>
                <div className={styles.headerRowNarrow}>TOTAL FLA</div>
            </div>
            {selectedKitsArr.map((kit, i) => (
                <KitSummaryRow kit={kit} key={i} />
            ))}
        </PageMedium>
    );
}

export default KitSummary;
