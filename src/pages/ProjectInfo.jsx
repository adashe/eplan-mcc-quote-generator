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
                <div>
                    <label>
                        Project Name:
                        <input
                            type="text"
                            name="projectName"
                            value={projectInfo.projectName || ""}
                            onChange={handleChangeProjectInfo}
                        />
                    </label>
                </div>
                <span className={styles.exampleText}>ex. "WestRiver208V</span>

                <div>
                    <label>
                        Library Name:
                        <input
                            type="text"
                            name="libraryName"
                            value={projectInfo.libraryName || ""}
                            onChange={handleChangeProjectInfo}
                        />
                    </label>
                </div>
            </form>
        </PageNarrow>
    );
}

export default ProjectInfo;
