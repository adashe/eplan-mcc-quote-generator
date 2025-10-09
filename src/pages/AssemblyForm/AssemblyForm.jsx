import { useState } from "react";
import { useMcc } from "../../contexts/MccContext.jsx";
import styles from "./AssemblyForm.module.css";

import PageMedium from "../../components/PageMedium.jsx";
import TabNavigation from "../../components/TabNavigation.jsx";

import { KitsForm } from "./KitsForm.jsx";
import { KitRow } from "./KitRow.jsx";
import LinkButton from "../../components/buttons/LinkButton.jsx";
import ResetButton from "../../components/buttons/ResetButton.jsx";

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

    const filteredData = kitsData.filter((kit) =>
        kit.description.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <PageMedium>
            <TabNavigation>
                <LinkButton route={"/"}>&larr; Generators</LinkButton>
                <ResetButton />
                <LinkButton route={"/options"}>Options &rarr;</LinkButton>
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

export default AssemblyForm;
