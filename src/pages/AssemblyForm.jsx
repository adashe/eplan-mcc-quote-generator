import { useState } from "react";
import PageNarrow from "../components/PageNarrow.jsx";

import { KitsForm } from "../components/KitsForm.jsx";
import { KitRow } from "../components/KitRow.jsx";

import { useMcc } from "../contexts/MccContext.jsx";
import styles from "./AssemblyForm.module.css";
import LinkButton from "../components/buttons/LinkButton.jsx";
import TabNavigation from "../components/TabNavigation.jsx";
import RestartButton from "../components/buttons/RestartButton.jsx";

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
        <PageNarrow>
            <TabNavigation>
                <RestartButton />
                <LinkButton route={"/options"}>Options &rarr;</LinkButton>
            </TabNavigation>
            <h2>SMCC KITS</h2>
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
        </PageNarrow>
    );
}

export default AssemblyForm;
