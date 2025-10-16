import { useMcc } from "../contexts/MccContext";
import styles from "./ProjectInfo.module.css";

import PageNarrow from "../components/PageNarrow";
import TabNavigation from "../components/TabNavigation";

import LinkButton from "../components/buttons/LinkButton";
import EECButton from "../components/buttons/EECButton";

function ProjectInfo() {
    const { projectInfo, handleChangeProjectInfo } = useMcc();

    return (
        <PageNarrow>
            <TabNavigation>
                <LinkButton route={"/kitSummary"}>&larr; Summary</LinkButton>
                <EECButton />
            </TabNavigation>
            <h2>PROJECT DETAILS</h2>
            <form>
                <div className={styles.formDiv}>
                    <label>
                        Project Name:
                        <input
                            type="text"
                            name="projectName"
                            value={projectInfo.projectName || ""}
                            onChange={handleChangeProjectInfo}
                        />
                    </label>
                    <div className={styles.exampleText}>
                        ex. "WestRiver208V"
                    </div>
                </div>
                <div className={styles.formDiv}>
                    <label>
                        Production Order Number:
                        <input
                            type="text"
                            name="productionOrderNumber"
                            value={projectInfo.productionOrderNumber || ""}
                            onChange={handleChangeProjectInfo}
                        />
                    </label>
                </div>
                <div className={styles.formDiv}>
                    <label>
                        Sales Order Number:
                        <input
                            type="text"
                            name="salesOrderNumber"
                            value={projectInfo.salesOrderNumber || ""}
                            onChange={handleChangeProjectInfo}
                        />
                    </label>
                </div>
                <div className={styles.formDiv}>
                    <label>
                        Drawing Number:
                        <input
                            type="text"
                            name="drawingNumber"
                            value={projectInfo.drawingNumber || ""}
                            onChange={handleChangeProjectInfo}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Number of Transformers:
                        <select
                            name="numXFMR"
                            value={projectInfo.numXFMR || "..."}
                            onChange={handleChangeProjectInfo}
                        >
                            <option disabled="disabled" value="...">
                                ...
                            </option>
                            <option value="1">1</option>
                        </select>
                    </label>
                </div>
            </form>
        </PageNarrow>
    );
}

export default ProjectInfo;
