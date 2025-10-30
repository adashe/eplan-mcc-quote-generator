import { createContext, useState, useContext } from "react";

import kitsData from "../data/v460mccKits.json";

const MccContext = createContext();

// Build initial assembly object based on kits in kitsData
const initialAssembly = kitsData.reduce((prev, curr) => {
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

// Build initial interlock object based on kits in kitsData
const initialInterlock = kitsData.reduce((prev, curr) => {
    prev[curr.id] = false;
    return prev;
}, {});

function MccProvider({ children }) {
    const [assembly, setAssembly] = useState(initialAssembly);
    const [projectInfo, setProjectInfo] = useState(initialProjectInfo);
    const [interlock, setInterlock] = useState(initialInterlock);

    function handleReset() {
        setAssembly(initialAssembly);
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

    function handleChangeProjectInfo(e) {
        const { name, value } = e.target;

        setProjectInfo((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleChangeInterlock(e) {
        const { name } = e.target;

        setInterlock((previous) => ({
            ...previous,
            [name]: !interlock[name],
        }));
    }

    return (
        <MccContext.Provider
            value={{
                kitsData,
                assembly,
                projectInfo,
                interlock,
                handleReset,
                handleChangeAssembly,
                handleIncrementAssembly,
                handleChangeProjectInfo,
                handleChangeInterlock,
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
