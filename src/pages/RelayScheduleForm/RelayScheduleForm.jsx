import { useState } from "react";
// import { useMcc } from "../../contexts/MccContext.jsx";

import PageWide from "../../components/PageWide.jsx";
import TabNavigation from "../../components/TabNavigation.jsx";
import styles from "./RelayScheduleForm.module.css";

import LinkButton from "../../components/buttons/LinkButton.jsx";
import Button from "../../components/buttons/Button.jsx";

import { Autocomplete, TextField } from "@mui/material";

import relayOptions from "../../data/relaySchedule.json";
import EECButton from "../../components/buttons/EECButton.jsx";

const initialValues = { relayNumber: "0", description: "", controlVoltage: "" };

function RelayScheduleForm() {
    // const { options } = useMcc();
    const [values, setValues] = useState(initialValues);
    const [relaySchedule, setRelaySchedule] = useState({});

    // Identifies the  number of available relays based on STC selection
    // const numRelays = Number(options?.stc?.slice(4) || 0);
    const numRelays = 128;

    // Creates an array of numRelays values to use in the Relay Number selector
    let relaysArr = [];
    for (let i = 0; i < numRelays; i++) {
        relaysArr.push((i + 1).toString());
    }

    const controlVoltageArr = ["24VAC", "24VDC", "120VAC"];

    // Add new relay item to the relaySchedule object
    function handleSubmit(e) {
        e.preventDefault();
        const { relayNumber, description, controlVoltage } = values;
        e.preventDefault();

        setRelaySchedule((previous) => ({
            ...previous,
            [relayNumber]: { description, controlVoltage },
        }));
    }

    // Build array with submmitted values to iterate over to create li tags
    const completedRelaysArr = relaysArr.filter(
        (relay) => relaySchedule[relay]
    );

    return (
        <PageWide>
            <TabNavigation>
                <LinkButton route={"/assembly"}>&larr; Edit Inputs</LinkButton>
                <LinkButton route={"/kitSummary"}>Kit Summary</LinkButton>
                <LinkButton route={"/mccSummary"}>MCC Summary</LinkButton>
                <Button isActive={false}>Relay Schedule</Button>
                <EECButton />
            </TabNavigation>
            <h2>RELAY SCHEDULE</h2>
            <form className={styles.relayForm}>
                <Autocomplete
                    className={styles.autocompleteInput}
                    onChange={(event, newValue) => {
                        setValues((previous) => ({
                            ...previous,
                            relayNumber: newValue,
                        }));
                    }}
                    value={values.relayNumber}
                    options={relaysArr}
                    renderInput={(params) => (
                        <TextField {...params} label="Relay Number" />
                    )}
                />
                <Autocomplete
                    className={`${styles.autocompleteInput} ${styles.wideInput}`}
                    onChange={(event, newValue) => {
                        setValues((previous) => ({
                            ...previous,
                            description: newValue,
                        }));
                    }}
                    onInputChange={(event, newValue) => {
                        setValues((previous) => ({
                            ...previous,
                            description: newValue,
                        }));
                    }}
                    value={values.description}
                    options={relayOptions.sort((a, b) => -b.localeCompare(a))}
                    groupBy={(option) => option.firstLetter}
                    renderInput={(params) => (
                        <TextField {...params} label="Description" />
                    )}
                />
                <Autocomplete
                    className={`${styles.autocompleteInput} ${styles.medInput}`}
                    onChange={(event, newValue) => {
                        setValues((previous) => ({
                            ...previous,
                            controlVoltage: newValue,
                        }));
                    }}
                    value={values.controlVoltage}
                    options={controlVoltageArr}
                    renderInput={(params) => (
                        <TextField {...params} label="Control Voltage" />
                    )}
                />
                <button className={styles.relayFormBtn} onClick={handleSubmit}>
                    Add
                </button>
            </form>

            <ul className={styles.relayUl}>
                {completedRelaysArr.map((relay) => (
                    <li key={relay} className={styles.relayLi}>
                        <div>Relay {relay}</div>
                        <div className={styles.relayLiDesc}>
                            {relaySchedule[relay].description}
                        </div>
                        <div>{relaySchedule[relay].controlVoltage}</div>
                    </li>
                ))}
            </ul>
        </PageWide>
    );
}

export default RelayScheduleForm;
