import { useState } from "react";
import { useMcc } from "../../contexts/MccContext.jsx";
import styles from "./AssemblyForm.module.css";

import PageMedium from "../../components/PageMedium.jsx";
import TabNavigation from "../../components/TabNavigation.jsx";

import { KitsForm } from "./KitsForm.jsx";
import { KitRow } from "./KitRow.jsx";
import FormLinkButton from "../../components/buttons/FormLinkButton.jsx";
import FormButton from "../../components/buttons/FormButton.jsx";

function AssemblyForm() {
    const { kitsData } = useMcc();
    const [filter, setFilter] = useState("");

    function handleUpdateFilter(e) {
        e.preventDefault();
        setFilter(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    // Select the entire value when user clicks in the input box (for easier editing)
    function handleSelect(e) {
        e.target.select();
    }

    const noConveyorsData = kitsData.filter(
        (kit) => !kit.description.includes("Conveyor")
    );

    const filteredData = noConveyorsData.filter((kit) =>
        kit.description.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <PageMedium>
            <TabNavigation>
                <FormButton isActive={false}>Kits</FormButton>
                <FormLinkButton route={"/conveyor"}>Conveyors</FormLinkButton>
                <FormLinkButton route={"/projectInfo"}>
                    Project Info
                </FormLinkButton>
                <FormLinkButton route={"/relaySchedule"}>
                    Relay Schedule
                </FormLinkButton>
                <FormLinkButton route={"/kitSummary"}>
                    Summary &rarr;
                </FormLinkButton>
            </TabNavigation>
            <h2>MCC KITS</h2>

            <form onSubmit={handleSubmit}>
                <input
                    className={styles.searchBar}
                    name="search"
                    type="text"
                    onChange={handleUpdateFilter}
                    onFocus={handleSelect}
                    value={filter}
                    placeholder="Search"
                />
            </form>

            <KitsForm>
                {filteredData.map((kit) => (
                    <KitRow kit={kit} key={kit.id} />
                ))}
            </KitsForm>
        </PageMedium>
    );
}

export default AssemblyForm;
