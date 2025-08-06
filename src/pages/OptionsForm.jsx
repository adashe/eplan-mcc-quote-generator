import PageNarrow from "../components/PageNarrow";
import { useMcc } from "../contexts/MccContext";
import TabNavigation from "../components/TabNavigation";
import LinkButton from "../components/buttons/LinkButton";

function OptionsForm() {
    const { options, handleChangeOptions } = useMcc();

    return (
        <PageNarrow>
            <TabNavigation>
                <LinkButton route={"/assembly"}>&larr; KITS</LinkButton>
                <LinkButton route={"/kitSummary"}>SUBMIT &rarr;</LinkButton>
            </TabNavigation>
            <h2>SMCC OPTIONS</h2>
            <form>
                <div>
                    <label>
                        Size:
                        <select
                            name="size"
                            value={options.size || "..."}
                            onChange={handleChangeOptions}
                        >
                            <option disabled="disabled" value="...">
                                ...
                            </option>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                            <option value="xlarge">Extra Large</option>
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        STC:
                        <select
                            name="stc"
                            value={options.stc || "..."}
                            onChange={handleChangeOptions}
                        >
                            <option disabled="disabled" value="...">
                                ...
                            </option>
                            <option value="STC-32">32</option>
                            <option value="STC-48">48</option>
                            <option value="STC-64">64</option>
                            <option value="STC-80">80</option>
                            <option value="STC-96">96</option>
                            <option value="STC-112">112</option>
                            <option value="STC-128">128</option>
                        </select>
                    </label>
                </div>
            </form>
        </PageNarrow>
    );
}

export default OptionsForm;
