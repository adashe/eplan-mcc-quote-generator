import { useMcc } from "../contexts/MccContext";
import styles from "./ProjectInfo.module.css";

import PageNarrow from "../components/PageNarrow";
import TabNavigation from "../components/TabNavigation";

import LinkButton from "../components/buttons/LinkButton";
import ImxButton from "../components/buttons/ImxButton";

function ProjectInfo() {
    const { projectInfo, handleChangeProjectInfo } = useMcc();

    return (
        <PageNarrow>
            <TabNavigation>
                <LinkButton route={"/kitSummary"}>&larr; Summary</LinkButton>
                <ImxButton />
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
                        Library Name:
                        <input
                            type="text"
                            name="libraryName"
                            value={projectInfo.libraryName || ""}
                            onChange={handleChangeProjectInfo}
                        />
                    </label>
                    <div className={styles.exampleText}>
                        ex. "ConstructionKit_208VMCC"
                    </div>
                </div>
            </form>
        </PageNarrow>
    );
}

export default ProjectInfo;
