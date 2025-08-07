import { Link } from "react-router-dom";
import BackButton from "../components/buttons/BackButton";
import Button from "../components/buttons/Button";
import PageNarrow from "../components/PageNarrow";
import { useMcc } from "../contexts/MccContext";
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
                        Project Number:
                        <input
                            type="text"
                            name="projectNumber"
                            value={projectInfo.p21Num || ""}
                            onChange={handleChangeProjectInfo}
                        />
                    </label>
                </div>

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
            </form>
        </PageNarrow>
    );
}

export default ProjectInfo;
