import { createContext, useState, useContext } from "react";

import kitsData from "../data/v208mccKits.json";
import optionsData from "../data/mccOptionsKits.json";
import partsData from "../data/mccParts";

const MccContext = createContext();

// Build initial assembly object based on kits in kitsData
const initialAssembly = kitsData.reduce((prev, curr) => {
    prev[curr.id] = 1;
    return prev;
}, {});

const initialOptions = {};

// Build initial options assembly object based on kits in kitsData
const initialBaseAssembly = optionsData.reduce((prev, curr) => {
    prev[curr.id] = 0;
    return prev;
}, {});

const initialProjectInfo = {};

// Calculate total assembly FLA
function calcTotalFLA(assembly) {
    let sum = 0;

    const kArr = kitsData.filter((kit) => assembly[kit.id] > 0);

    kArr.forEach((kit) => {
        sum += kit.fla * assembly[kit.id];
    });

    return sum;
}

function MccProvider({ children }) {
    const [assembly, setAssembly] = useState(initialAssembly);
    // options stores the selections in the options form that will make up the baseAssembly object
    const [options, setOptions] = useState(initialOptions);
    // baseAssembly is the assembly object built out of selected options
    const [baseAssembly, setBaseAssembly] = useState(initialBaseAssembly);
    const [projectInfo, setProjectInfo] = useState(initialProjectInfo);

    function handleReset() {
        setAssembly(initialAssembly);
        setOptions(initialOptions);
        setBaseAssembly(initialBaseAssembly);
        setProjectInfo(initialProjectInfo);
    }

    function handleChangeAssembly(e) {
        const { name, value } = e.target;

        setAssembly((previous) => ({
            ...previous,
            [name]: Number(value),
        }));
    }

    function handleIncrementAssembly(kitID, value) {
        if (assembly[kitID] + value < 0) {
            return;
        }
        setAssembly((previous) => ({
            ...previous,
            [kitID]: assembly[kitID] + value,
        }));
    }

    function handleChangeOptions(e) {
        const { name, value } = e.target;

        // Use setOptions to control the dropdown form element
        setOptions((previous) => ({
            ...previous,
            [name]: value,
        }));

        // setAssembly with size and stc kits, resetting mutually exclusive options to 0
        if (name === "size") {
            setBaseAssembly((previous) => ({
                ...previous,
                ["small"]: 0,
                ["medium"]: 0,
                ["large"]: 0,
                ["xlarge"]: 0,
                ["spareShippedLoose"]: 1,
                [value]: 1,
            }));
        } else if (name === "stc") {
            setBaseAssembly((previous) => ({
                ...previous,
                ["stc32"]: 0,
                ["stc48"]: 0,
                ["stc64"]: 0,
                ["stc80"]: 0,
                ["stc96"]: 0,
                ["stc112"]: 0,
                ["stc128"]: 0,
                ["spareShippedLoose"]: 1,
                [value]: 1,
            }));
        }
    }

    function handleChangeProjectInfo(e) {
        const { name, value } = e.target;

        setProjectInfo((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    return (
        <MccContext.Provider
            value={{
                kitsData,
                optionsData,
                partsData,
                assembly,
                options,
                baseAssembly,
                projectInfo,
                handleReset,
                handleChangeAssembly,
                handleIncrementAssembly,
                handleChangeOptions,
                handleChangeProjectInfo,
                calcTotalFLA,
            }}
        >
            {children}
        </MccContext.Provider>
    );
}

function useMcc() {
    const context = useContext(MccContext);
    if (context === undefined)
        throw new Error("MccContext was used outside of the MccProvider");
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { MccProvider, useMcc };
