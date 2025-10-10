import { utils, writeFile } from "xlsx";
import { useMcc } from "../../contexts/MccContext";
import Button from "./Button";

function EECButton() {
    const { kitsData, assembly } = useMcc();

    // Helper function to generate an array of motors descriptions
    function checkMotors(arrayofMotorObjects) {
        let arr = [];
        arrayofMotorObjects.forEach((motor) => {
            arr.push(motor.description);
        });
        return arr;
    }

    // Helper function to calculate the FLA of an array of motors
    function calcGroupFLA(arrayOfMotorObjects) {
        let fla = 0;
        arrayOfMotorObjects.forEach((motor) => {
            fla += motor?.fla || 0;
        });
        return fla;
    }

    function buildOnBuss() {
        let bussbarCapacity = 21;
        let onBussMotors = [];
        let offBussMotors = [];

        console.log(
            "|||||||||||||||||||||||BEGIN BUSSBAR CALC||||||||||||||||||||||||||||"
        );

        // Build an array of all included motor objects from assembly
        let motorsArr = [];

        for (const k in assembly) {
            const kit = kitsData.filter((kit) => kit.id === k)[0];

            // Include duplicate motors in the array
            for (let i = 0; i < assembly[kit.id]; i++) {
                motorsArr.push(kit);
            }
        }

        // Add vfds to offBussMotors
        const vfdsArr = motorsArr.filter(
            (motor) => motor.type === "vfd-1" || motor.type === "vfd-2"
        );

        vfdsArr.sort((a, b) => b.hp - a.hp);
        vfdsArr.forEach((motor) => {
            offBussMotors = [...offBussMotors, motor];
        });

        // CHECK: print vfds pulled from motorsArr
        console.log("removed vfds", checkMotors(offBussMotors));

        // Remove vfds from motorsArr
        const noVfdMotorsArr = motorsArr.filter(
            (motor) => motor.type !== "vfd-1" && motor.type !== "vfd-2"
        );

        // Add conveyors to conveyorsArr from motorsArr
        const conveyorsArr = noVfdMotorsArr.filter(
            (motor) => motor.type === "conveyor"
        );

        // CHECK: print conveyors pulled from motorsArr
        console.log("removed conveyors", checkMotors(conveyorsArr));

        // Remove conveyors from motorsArr
        const noVfdNoConveyorMotorsArr = noVfdMotorsArr.filter(
            (motor) => motor.type !== "conveyor"
        );

        // CHECK: print initial motors array
        console.log("filtered motors", checkMotors(noVfdNoConveyorMotorsArr));

        // Build prioritized array of function groups to iterate over hp groups
        const priorityArr = [
            "blower",
            "vacuum",
            "wrap",
            "topBrush",
            "otherSpare",
            "d25",
            "h25",
            "omni",
            "booster",
            "otherBrush",
            "rocker",
            "sideEquip",
            "tireShine",
            "pump",
            "pumpBreaker",
            "prepGun",
            "hydraflex",
            "otherBreaker",
            "mitter",
        ];

        const motorsGroupedByType = Object.groupBy(
            noVfdNoConveyorMotorsArr,
            ({ type }) => type
        );
        // console.log({ motorsGroupedByType });

        // Add whole groups to bussbar
        console.log("-------------1st iteration WHOLE GROUPS-------------");
        priorityArr.forEach((type) => {
            const typeGroup = motorsGroupedByType[type];
            // console.log(type, { typeGroup });

            if (bussbarCapacity > 0) {
                if (typeGroup) {
                    // Sort in order of HP descdending so onBussMotors is sorted
                    typeGroup.sort((a, b) => b.hp - a.hp);
                    // console.log(type, { typeGroup });
                    if (typeGroup.length <= bussbarCapacity) {
                        onBussMotors = [...onBussMotors, ...typeGroup];
                        bussbarCapacity -= typeGroup.length;
                        delete motorsGroupedByType[type];
                        console.log(
                            "added",
                            type,
                            "typeCount",
                            typeGroup.length,
                            "bussCapacity",
                            bussbarCapacity
                        );
                    } else {
                        // Add motors to offBuss if the whole group won't fit
                        // Will later individually remove motors from this arr
                        // in the next iteration
                        console.log(
                            "not added",
                            type,
                            "typeCount",
                            typeGroup.length,
                            "bussCapacity",
                            bussbarCapacity
                        );
                        offBussMotors = [...offBussMotors, ...typeGroup];
                    }
                } else {
                    console.log("none", type);
                }
            } else {
                console.log(
                    "・ :*:・ﾟ☆.・ ゜-: ✧ :- ⋇⋆✦⋆⋇⭒❃BUSSBAR COMPLETE.✮ :▹‧͙⁺ ˚*・༓ ☾.｡*ﾟ+. *."
                );
            }
        });

        // Add individual motors to bussbar in descending order of type, then HP
        if (bussbarCapacity > 0) {
            console.log(
                "----------------2nd iteration PARTIAL GROUPS--------------"
            );
            priorityArr.forEach((type) => {
                const typeGroup = motorsGroupedByType[type];

                if (typeGroup) {
                    // Sort motors within the group by HP
                    typeGroup.sort((a, b) => b.hp - a.hp);
                    console.log(type, { typeGroup });

                    // Add individual motors to onBussMotors
                    typeGroup.forEach((motor) => {
                        if (bussbarCapacity > 0) {
                            onBussMotors = [...onBussMotors, motor];
                            bussbarCapacity -= 1;
                            console.log(
                                "added",
                                motor.description,
                                "bussCapacity",
                                bussbarCapacity
                            );

                            // Remove motor from offbuss array
                            const index = offBussMotors.findIndex(
                                (m) => m.id === motor.id
                            );
                            offBussMotors.splice(index, 1);
                        } else {
                            console.log(
                                "・ :*:・ﾟ☆.・ ゜-: ✧ :- ⋇⋆✦⋆⋇⭒❃BUSSBAR COMPLETE.✮ :▹‧͙⁺ ˚*・༓ ☾.｡*ﾟ+. *."
                            );
                        }
                    });
                }
            });
        }

        // CHECK: print on buss motor list
        console.log("ON BUSS", checkMotors(onBussMotors));

        return { conveyorsArr, onBussMotors, offBussMotors };
    }

    function buildOffBuss(offBussMotors) {
        // CHECK: print off buss motor list
        console.log("OFF BUSS", checkMotors(offBussMotors));

        // calculate total off buss FLA
        const totalOffBussFLA = calcGroupFLA(offBussMotors);
        console.log("off buss fla", totalOffBussFLA);

        // calculate number of groups by dividing total FLA by 63 (max amps per group) and rounding up
        const numLsaGroups = Math.ceil(totalOffBussFLA / 63);
        console.log("num lsa groups", numLsaGroups);

        // create arrays to represent each group
        let lsaGroups = {};

        for (let i = 0; i < numLsaGroups; i++) {
            lsaGroups[i] = [];
        }

        console.log(lsaGroups);

        // add motors from largest to smallest into containers up to the FLA limit
        for (const key in lsaGroups) {
            while (
                lsaGroups[key].length < 9 &&
                63 - calcGroupFLA(lsaGroups[key]) >= offBussMotors[0]?.fla &&
                offBussMotors.length > 0
            ) {
                lsaGroups[key] = [...lsaGroups[key], offBussMotors.shift()];
            }
        }

        // CHECK: print lsa containers
        for (const group in lsaGroups) {
            console.log(group, lsaGroups[group]);
        }

        return lsaGroups;
    }

    function buildCSV() {
        const { conveyorsArr, onBussMotors, offBussMotors } = buildOnBuss();

        const onBussArr = checkMotors(onBussMotors);

        // Subdivide offbuss by size
        // Omits 72mm and generates 90mm (2x VFD) as 45mm
        const offBussMotors45 = offBussMotors.filter(
            (motor) => motor.shoeMM == 45
        );
        const offBussMotors54 = offBussMotors.filter(
            (motor) => motor.shoeMM == 54
        );

        // Build offbuss groups
        const lsaGroups45 = buildOffBuss(offBussMotors45);
        const lsaGroups54 = buildOffBuss(offBussMotors54);

        if (window.confirm("Are you sure you want to download this file?")) {
            let rows = [];
            // Add project info
            const projRows = [
                {
                    name: "PropId_10013",
                    value: "ANDREA",
                    type: "String",
                },
                {
                    name: "PropId_10011",
                    value: "DEMO_1",
                    type: "String",
                },
                {
                    name: "ProductionOrderNumber",
                    value: "BRENDAN",
                    type: "String",
                },
                {
                    name: "SalesOrderNumber",
                    value: "ERIC",
                    type: "String",
                },
                {
                    name: "NP_BuildStandard",
                    value: "ANDY",
                    type: "String",
                },
                {
                    name: "NP_DrawingNumber",
                    value: "FRED",
                    type: "String",
                },
                {
                    name: "NP_EnclosureRating",
                    value: "SANJA",
                    type: "String",
                },
                {
                    name: "NP_Frequency",
                    value: "DZENAN",
                    type: "String",
                },
                {
                    name: "NP_INTERRUPT_SCCR",
                    value: "BRETT",
                    type: "String",
                },
                {
                    name: "NP_LargestMotor",
                    value: "JASON",
                    type: "String",
                },
                {
                    name: "NP_Phase",
                    value: "JOHN",
                    type: "String",
                },
                {
                    name: "NP_SalesOrder",
                    value: "ROBERTO",
                    type: "String",
                },
                {
                    name: "NP_ServiceVoltage",
                    value: "ERNESTO",
                    type: "String",
                },
                {
                    name: "NP_TotalPanelFLC",
                    value: "ROMEL",
                    type: "String",
                },
                {
                    name: "NP_Wire",
                    value: "BILL",
                    type: "String",
                },
                {
                    name: "b_PMR",
                    value: "false",
                    type: "Boolean",
                },
                {
                    name: "b_VT",
                    value: "false",
                    type: "Boolean",
                },
                {
                    name: "i_NmXFMR",
                    value: 1,
                    type: "Integer",
                },
                {
                    name: "i_SystemVoltage",
                    value: 480,
                    type: "Integer",
                },
            ];

            rows = [...rows, ...projRows];

            // Add conveyors
            conveyorsArr.forEach((conveyor) => {
                let row = {
                    name: "c_Conveyors",
                    value: conveyor.description,
                    type: "String",
                };
                rows = [...rows, row];
            });

            // Add onbuss items
            onBussArr.forEach((motor) => {
                let row = {
                    name: "c_OnBussMotors",
                    value: motor,
                    type: "String",
                };
                rows = [...rows, row];
            });

            for (const key in lsaGroups45) {
                const LsaArr = checkMotors(lsaGroups45[key]);
                LsaArr.forEach((motor) => {
                    let row = {
                        name: `c_LSA_SubList_45_${parseInt(key) + 1}`,
                        value: motor,
                        type: "String",
                    };
                    rows = [...rows, row];
                });
            }

            for (const key in lsaGroups54) {
                const LsaArr = checkMotors(lsaGroups54[key]);
                LsaArr.forEach((motor) => {
                    let row = {
                        name: `c_LSA_SubList_54_${parseInt(key) + 1}`,
                        value: motor,
                        type: "String",
                    };
                    rows = [...rows, row];
                });
            }

            // generate worksheet from rows array
            const ws = utils.json_to_sheet(rows);

            // create workbook and append worksheet
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, "DEMO_CSV");

            // export to Excel as csv
            writeFile(wb, "DEMO_CSV.csv");
        }
    }

    return (
        <Button className="active" onClick={buildCSV}>
            DOWNLOAD CSV
        </Button>
    );
}

export default EECButton;
