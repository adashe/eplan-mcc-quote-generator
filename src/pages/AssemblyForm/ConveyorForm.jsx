import { useState } from "react";
import { useMcc } from "../../contexts/MccContext.jsx";
import styles from "./AssemblyForm.module.css";

import PageMedium from "../../components/PageMedium.jsx";
import TabNavigation from "../../components/TabNavigation.jsx";

import { KitsForm } from "./KitsForm.jsx";
import { KitRow } from "./KitRow.jsx";
import LinkButton from "../../components/buttons/LinkButton.jsx";
import ResetButton from "../../components/buttons/ResetButton.jsx";

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
                <LinkButton route={"/assembly"}>&larr; Kits</LinkButton>
                <ResetButton />
                <LinkButton route={"/projectInfo"}>
                    Project Info &rarr;
                </LinkButton>
            </TabNavigation>
            <h2>MCC KITS</h2>

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
