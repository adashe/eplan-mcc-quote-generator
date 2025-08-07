import { useMcc } from "../contexts/MccContext";
import styles from "./Totals.module.css";

import PageWide from "../components/PageWide";
import TabNavigation from "../components/TabNavigation";

import Button from "../components/buttons/Button";
import LinkButton from "../components/buttons/LinkButton";

function Totals() {
    const { assembly, calcTotalFLA } = useMcc();

    const totalFLA = calcTotalFLA(assembly).toFixed(2);

    const motorCountArr = Object.values(assembly);
    const motorCount = motorCountArr.reduce((acc, curr) => acc + curr, 0);

    return (
        <PageWide>
            <TabNavigation>
                <LinkButton route={"/assembly"}>Edit Inputs</LinkButton>
                <LinkButton route={"/kitSummary"}>Kit Summary</LinkButton>
                <Button isActive={false}>Totals</Button>
                <LinkButton route={"/projectInfo"}>Prepare IMX</LinkButton>
            </TabNavigation>
            <h2>Totals</h2>
            <h3 className={styles.partNum}>
                MCC-208V-{totalFLA}-{motorCount}
            </h3>
            <ul className={styles.totalsUl}>
                <li className={styles.totalsLi}>VOLTAGE: 208V</li>
                <li className={styles.totalsLi}>TOTAL FLA: {totalFLA}A</li>
                <li className={styles.totalsLi}>MOTOR COUNT: {motorCount}</li>
                <li className={styles.totalsLi}>MCC TYPE: STANDARD</li>
            </ul>
        </PageWide>
    );
}

export default Totals;
