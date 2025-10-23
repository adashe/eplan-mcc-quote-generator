import { useMcc } from "../contexts/MccContext";

import PageNarrow from "../components/PageNarrow";
import TabNavigation from "../components/TabNavigation";

import LinkButton from "../components/buttons/LinkButton";
import ResetButton from "../components/buttons/ResetButton";

function OptionsForm() {
    const { options, handleChangeOptions } = useMcc();

    return (
        <PageNarrow>
            <TabNavigation>
                <LinkButton route={"/assembly"}>&larr; Kits</LinkButton>
                <LinkButton route={"/kitSummary"}>Submit &rarr;</LinkButton>
            </TabNavigation>
            <h2>MCC OPTIONS</h2>
            <form>
                <div>
                    <label>
                        Controller:
                        <select
                            name="control"
                            value={options.control || "..."}
                            onChange={handleChangeOptions}
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
                            <option value="photoEye">Other - Photo Eye</option>
                        </select>
                    </label>
                </div>
            </form>
        </PageNarrow>
    );
}

export default OptionsForm;
