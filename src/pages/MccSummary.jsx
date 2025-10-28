import { useMcc } from "../contexts/MccContext";
import styles from "./MccSummary.module.css";

import PageWide from "../components/PageWide";
import TabNavigation from "../components/TabNavigation";

import Button from "../components/buttons/Button";
import LinkButton from "../components/buttons/LinkButton";
import EECButton from "../components/buttons/EECButton";

function MccSummary() {
    const { assembly, calcTotalFLA, projectInfo } = useMcc();

    const totalFLA = calcTotalFLA(assembly).toFixed(1);
    const motorCount = Object.values(assembly).reduce(
        (acc, curr) => acc + curr,
        0
    );

    return (
        <PageWide>
            <TabNavigation>
                <LinkButton route={"/assembly"}>Edit Inputs</LinkButton>
                <LinkButton route={"/kitSummary"}>Kit Summary</LinkButton>
                <Button isActive={false}>MCC SUMMARY</Button>
                <LinkButton route={"/relaySchedule"}>Relay Schedule</LinkButton>
                <EECButton />
            </TabNavigation>
            <h2>MCC SUMMARY</h2>
            <div className={styles.twoCol}>
                <div>
                    <ul className={styles.totalsUl}>
                        <li className={styles.totalsLi}>
                            {projectInfo.projectName || "N/A"}
                            <div className={styles.totalsLabel}>
                                PROJECT NAME
                            </div>
                        </li>
                        <li className={styles.totalsLi}>
                            {projectInfo.productionOrderNumber || "N/A"}
                            <div className={styles.totalsLabel}>
                                PRODUCTION ORDER NUMBER
                            </div>
                        </li>
                        <li className={styles.totalsLi}>
                            {projectInfo.salesOrderNumber || "N/A"}
                            <div className={styles.totalsLabel}>
                                SALES ORDER NUMBER
                            </div>
                        </li>
                        <li className={styles.totalsLi}>
                            {projectInfo.drawingNumber || "N/A"}
                            <div className={styles.totalsLabel}>
                                DRAWING NUMBER
                            </div>
                        </li>
                        <li className={styles.totalsLi}>
                            {projectInfo.control || "N/A"}
                            <div className={styles.totalsLabel}>CONTROLLER</div>
                        </li>
                        <li className={styles.totalsLi}>
                            {projectInfo.install ? " Install" : " Standard"}
                            <div className={styles.totalsLabel}>INSTALL</div>
                        </li>
                        <li className={styles.totalsLi}>
                            {projectInfo.numXFMR | "1"}
                            <div className={styles.totalsLabel}>
                                NUMBER TRANSFORMERS
                            </div>
                        </li>
                    </ul>
                </div>

                <div>
                    <ul className={styles.totalsUl}>
                        <li className={styles.totalsLi}>
                            460V
                            <div className={styles.totalsLabel}>
                                SYSTEM VOLTAGE
                            </div>
                        </li>
                        <li className={styles.totalsLi}>
                            {projectInfo.controlVoltage || "N/A"}
                            <div className={styles.totalsLabel}>
                                CONTROL VOLTAGE
                            </div>
                        </li>
                        <li className={styles.totalsLi}>
                            {projectInfo.solenoidVoltage || "N/A"}
                            <div className={styles.totalsLabel}>
                                SOLENOID VOLTAGE
                            </div>
                        </li>
                        <li className={styles.totalsLi}>
                            {totalFLA}A
                            <div className={styles.totalsLabel}>TOTAL FLA</div>
                        </li>
                        <li className={styles.totalsLi}>
                            {motorCount}
                            <div className={styles.totalsLabel}>
                                MOTOR COUNT
                            </div>
                        </li>
                        <li className={styles.totalsLi}>
                            {projectInfo.phaseMonitorRelay ? " Yes" : " No"}
                            <div className={styles.totalsLabel}>
                                PHASE MONITOR
                            </div>
                        </li>
                        <li className={styles.totalsLi}>
                            {projectInfo.voltageTester ? " Yes" : " No"}
                            <div className={styles.totalsLabel}>
                                VOLTAGE TESTER
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </PageWide>
    );
}

export default MccSummary;
