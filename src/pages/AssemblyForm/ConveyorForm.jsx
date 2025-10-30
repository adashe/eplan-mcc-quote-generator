import { useState } from "react";
import { useMcc } from "../../contexts/MccContext.jsx";
import styles from "./AssemblyForm.module.css";

import PageMedium from "../../components/PageMedium.jsx";
import TabNavigation from "../../components/TabNavigation.jsx";

import { KitsForm } from "./KitsForm.jsx";
import { KitRow } from "./KitRow.jsx";
import FormLinkButton from "../../components/buttons/FormLinkButton.jsx";
import FormButton from "../../components/buttons/FormButton.jsx";

function ConveyorForm() {
    const { kitsData } = useMcc();
    const [filter, setFilter] = useState("");

    function handleUpdateFilter(e) {
        e.preventDefault();
        setFilter(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    const conveyorsData = kitsData.filter((kit) =>
        kit.description.includes("Conveyor")
    );

    const filteredData = conveyorsData.filter((kit) =>
        kit.description.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <PageMedium>
            <TabNavigation>
                <FormLinkButton route={"/assembly"}>Kits</FormLinkButton>
                <FormButton isActive={false}>Conveyors</FormButton>
                <FormLinkButton route={"/projectInfo"}>
                    Project Info
                </FormLinkButton>
                <FormLinkButton route={"/kitSummary"}>
                    Summary &rarr;
                </FormLinkButton>
            </TabNavigation>
            <h2>CONVEYORS</h2>

            <form onSubmit={handleSubmit}>
                <input
                    className={styles.searchBar}
                    name="search"
                    type="text"
                    onChange={handleUpdateFilter}
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

export default ConveyorForm;
