import { useMcc } from "../../contexts/MccContext";
import styles from "./PartsListRow.module.css";

import PageWide from "../../components/PageWide";
import TabNavigation from "../../components/TabNavigation";

import { PartsListRow } from "./PartsListRow";
import Button from "../../components/buttons/Button";
import LinkButton from "../../components/buttons/LinkButton";

function PartSummary() {
    const { kitsData, optionsData, partsData, assembly, baseAssembly } =
        useMcc();

    // Build a parts list from the assembly object with the parts numbers and their quantities
    let partsList = {};

    // Build a parts list from the assembly object with the parts numbers and their quantities
    for (const k in assembly) {
        if (assembly[k] > 0) {
            const arr = kitsData.filter((kit) => kit.id === k);
            const kit = arr[0];
            kit?.parts.forEach((part) => {
                const partID = Object.keys(part)[0];
                const qty = Object.values(part)[0];

                partsList[partID] =
                    partsList[partID] + assembly[k] * qty || assembly[k] * qty;
            });
        }
    }

    // Add parts from the baseAssembly object with the parts numbers and their quantities
    for (const k in baseAssembly) {
        if (baseAssembly[k] > 0) {
            const arr = optionsData.filter((kit) => kit.id === k);
            const kit = arr[0];
            kit?.parts.forEach((part) => {
                const partID = Object.keys(part)[0];
                const qty = Object.values(part)[0];

                partsList[partID] =
                    partsList[partID] + baseAssembly[k] * qty ||
                    baseAssembly[k] * qty;
            });
        }
    }

    // Use the partsList object to filter the partsData array
    const selectedPartsArr = partsData.filter((part) => partsList[part.id] > 0);

    return (
        <PageWide>
            <TabNavigation>
                <LinkButton route={"/assembly"}>Edit Inputs</LinkButton>
                <LinkButton route={"/kitSummary"}>Kit Summary</LinkButton>
                <Button isActive={false}>Part Summary</Button>
                <LinkButton route={"/totals"}>Totals</LinkButton>
                <LinkButton route={"/projectInfo"}>Download IMX</LinkButton>
            </TabNavigation>
            <h2>PART SUMMARY</h2>
            <ul>
                <div className={`${styles.listItem} ${styles.listHeader}`}>
                    <div className={styles.qtyCol}>Qty</div>
                    <div className={styles.partNumCol}>Part Num</div>
                    <div className={styles.partDescCol}>Description</div>
                    <div>Manu</div>
                    <div>Price</div>
                    <div>Total</div>
                </div>
                {selectedPartsArr.map((part) => (
                    <PartsListRow
                        part={part}
                        partsList={partsList}
                        key={part.id}
                    />
                ))}
            </ul>
        </PageWide>
    );
}

export default PartSummary;
