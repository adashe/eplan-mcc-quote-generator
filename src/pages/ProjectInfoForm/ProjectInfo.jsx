import { useMcc } from "../../contexts/MccContext";
import styles from "./ProjectInfo.module.css";

import PageMedium from "../../components/PageMedium";
import TabNavigation from "../../components/TabNavigation";

import FormLinkButton from "../../components/buttons/FormLinkButton";

import FormButton from "../../components/buttons/FormButton";

function ProjectInfo() {
    const { projectInfo, handleChangeProjectInfo } = useMcc();

    return (
        <PageMedium>
            <TabNavigation>
                <FormLinkButton route={"/assembly"}>Kits</FormLinkButton>
                <FormLinkButton route={"/conveyor"}>Conveyors</FormLinkButton>
                <FormButton isActive={false}>Project Info</FormButton>
                <FormLinkButton route={"/kitSummary"}>
                    Summary &rarr;
                </FormLinkButton>
            </TabNavigation>

            <h2>PROJECT DETAILS</h2>
            <form className={styles.formDiv}>
                <div className={styles.twoCol}>
                    <div>
                        <label className={styles.formLabel}>
                            <input
                                type="text"
                                name="projectName"
                                value={projectInfo.projectName || ""}
                                onChange={handleChangeProjectInfo}
                                className={styles.formInput}
                            />
                            <div className={styles.formLabelText}>
                                Project Name
                            </div>
                        </label>
                    </div>
                    <div>
                        <label className={styles.formLabel}>
                            <input
                                type="text"
                                name="productionOrderNumber"
                                value={projectInfo.productionOrderNumber || ""}
                                onChange={handleChangeProjectInfo}
                                className={styles.formInput}
                            />
                            <div className={styles.formLabelText}>
                                Production Order Number
                            </div>
                        </label>
                    </div>
                    <div>
                        <label className={styles.formLabel}>
                            <input
                                type="text"
                                name="salesOrderNumber"
                                value={projectInfo.salesOrderNumber || ""}
                                onChange={handleChangeProjectInfo}
                                className={styles.formInput}
                            />
                            <div className={styles.formLabelText}>
                                Sales Order Number
                            </div>
                        </label>
                    </div>
                    <div>
                        <label className={styles.formLabel}>
                            <input
                                type="text"
                                name="drawingNumber"
                                value={projectInfo.drawingNumber || ""}
                                onChange={handleChangeProjectInfo}
                                className={styles.formInput}
                            />
                            <div className={styles.formLabelText}>
                                Drawing Number
                            </div>
                        </label>
                    </div>
                    <div>
                        <label className={styles.formLabel}>
                            <select
                                name="control"
                                value={projectInfo.control || "..."}
                                onChange={handleChangeProjectInfo}
                                className={styles.formSelect}
                            >
                                <option disabled="disabled" value="...">
                                    ...
                                </option>
                                <option value="drb">DRB</option>
                                <option value="ics">ICS</option>
                                <option value="sonnys">Sonny's</option>
                                <option value="Micrologic">MicroLogic</option>
                                <option value="tapeSwitch">
                                    Other - Tape Switch
                                </option>
                                <option value="photoEye">
                                    Other - Photo Eye
                                </option>
                            </select>
                            <div className={styles.formLabelText}>
                                Controller
                            </div>
                        </label>
                    </div>
                    <div>
                        <label className={styles.formLabel}>
                            <select
                                name="install"
                                value={projectInfo.install || "..."}
                                onChange={handleChangeProjectInfo}
                                className={styles.formSelect}
                            >
                                <option disabled="disabled" value="...">
                                    ...
                                </option>
                                <option value="true">Install</option>
                                <option value="false">Standard</option>
                            </select>
                            <div className={styles.formLabelText}>Install</div>
                        </label>
                    </div>
                </div>

                <div>
                    <div>
                        <label className={styles.formLabel}>
                            <select
                                name="controlVoltage"
                                value={projectInfo.controlVoltage || "..."}
                                onChange={handleChangeProjectInfo}
                                className={styles.formSelect}
                            >
                                <option disabled="disabled" value="...">
                                    ...
                                </option>
                                <option value="24VDC">24VDC</option>
                                <option value="120VAC">120VAC</option>
                            </select>
                            <div className={styles.formLabelText}>
                                Control Voltage
                            </div>
                        </label>
                    </div>

                    <div>
                        <label className={styles.formLabel}>
                            <select
                                name="solenoidVoltage"
                                value={projectInfo.solenoidVoltage || "..."}
                                onChange={handleChangeProjectInfo}
                                className={styles.formSelect}
                            >
                                <option disabled="disabled" value="...">
                                    ...
                                </option>
                                <option value="24VAC">24VAC</option>
                                <option value="120VAC">120VAC</option>
                            </select>
                            <div className={styles.formLabelText}>
                                Solenoid Voltage
                            </div>
                        </label>
                    </div>

                    <div>
                        <label className={styles.formLabel}>
                            <select
                                name="numXFMR"
                                value={projectInfo.numXFMR || "..."}
                                onChange={handleChangeProjectInfo}
                                className={styles.formSelect}
                            >
                                <option disabled="disabled" value="...">
                                    ...
                                </option>
                                <option value="1">1</option>
                            </select>
                            <div className={styles.formLabelText}>
                                Number of Transformers
                            </div>
                        </label>
                    </div>

                    <div>
                        <label className={styles.formLabel}>
                            <select
                                name="phaseMonitorRelay"
                                value={projectInfo.phaseMonitorRelay || "..."}
                                onChange={handleChangeProjectInfo}
                                className={styles.formSelect}
                            >
                                <option disabled="disabled" value="...">
                                    ...
                                </option>
                                <option value="true">Yes</option>
                            </select>
                            <div className={styles.formLabelText}>
                                Phase Monitor Relay
                            </div>
                        </label>
                    </div>

                    <div>
                        <label className={styles.formLabel}>
                            <select
                                name="voltageTester"
                                value={projectInfo.voltageTester || "..."}
                                onChange={handleChangeProjectInfo}
                                className={styles.formSelect}
                            >
                                <option disabled="disabled" value="...">
                                    ...
                                </option>
                                <option value="true">Yes</option>
                            </select>
                            <div className={styles.formLabelText}>
                                Voltage Tester
                            </div>
                        </label>
                    </div>
                </div>
            </form>
        </PageMedium>
    );
}

export default ProjectInfo;
