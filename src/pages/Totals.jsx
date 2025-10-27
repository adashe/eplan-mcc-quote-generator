import { useMcc } from "../contexts/MccContext";
import styles from "./Totals.module.css";

import PageWide from "../components/PageWide";
import TabNavigation from "../components/TabNavigation";

import Button from "../components/buttons/Button";
import LinkButton from "../components/buttons/LinkButton";

function Totals() {
    const { assembly, calcTotalFLA, projectInfo } = useMcc();

    const totalFLA = calcTotalFLA(assembly).toFixed(1);

    const motorCountArr = Object.values(assembly);
    const motorCount = motorCountArr.reduce((acc, curr) => acc + curr, 0);

    return (
        <PageWide>
            <TabNavigation>
                <LinkButton route={"/assembly"}>Edit Inputs</LinkButton>
                <LinkButton route={"/kitSummary"}>Kit Summary</LinkButton>
                <Button isActive={false}>Totals</Button>
                <LinkButton route={"/relaySchedule"}>Relay Schedule</LinkButton>
                <LinkButton route={"/projectInfo"}>Prepare CSV</LinkButton>
            </TabNavigation>
            <h2>TOTALS</h2>
            <h3 className={styles.partNum}>
                MCC-460V-{totalFLA}-{motorCount}
            </h3>
            <div className={styles.twoCol}>
                <div>
                    <ul className={styles.totalsUl}>
                        <li className={styles.totalsLi}>
                            PROJECT NAME: {projectInfo.projectName}
                        </li>
                        <li className={styles.totalsLi}>
                            PRODUCTION ORDER NUMBER: {projectInfo.projectName}
                        </li>
                        <li className={styles.totalsLi}>
                            SALES ORDER NUMBER: {projectInfo.salesOrderNumber}
                        </li>
                        <li className={styles.totalsLi}>
                            DRAWING NUMBER: {projectInfo.drawingNumber}
                        </li>
                        <li className={styles.totalsLi}>
                            CONTROLLER: {projectInfo.control}
                        </li>
                        <li className={styles.totalsLi}>
                            INSTALL:
                            {projectInfo.install}
                        </li>
                        <li className={styles.totalsLi}>
                            NUMBER TRANSFORMERS: {projectInfo.numXFMR}
                        </li>
                    </ul>
                </div>

                <div>
                    <ul className={styles.totalsUl}>
                        <li className={styles.totalsLi}>VOLTAGE: 460V</li>
                        <li className={styles.totalsLi}>
                            CONTROL VOLTAGE: {projectInfo.controlVoltage}
                        </li>
                        <li className={styles.totalsLi}>
                            SOLENOID VOLTAGE: {projectInfo.solenoidVoltage}
                        </li>
                        <li className={styles.totalsLi}>
                            TOTAL FLA: {totalFLA}A
                        </li>
                        <li className={styles.totalsLi}>
                            MOTOR COUNT: {motorCount}
                        </li>
                        <li className={styles.totalsLi}>
                            PHASE MONITOR: {projectInfo.phaseMonitorRelay}
                        </li>
                        <li className={styles.totalsLi}>
                            VOLTAGE TESTER: {projectInfo.voltageTester}
                        </li>
                    </ul>
                </div>
            </div>
        </PageWide>
    );
}

export default Totals;
