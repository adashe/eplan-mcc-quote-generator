import { utils, writeFile } from "xlsx";
import { useMcc } from "../../contexts/MccContext";
import Button from "./Button";

function EECButton() {
    const { kitsData, assembly, projectInfo, interlock, calcTotalFLA } =
        useMcc();

    // Helper function to generate an array of motors descriptions
    function generateMotorDescArr(arrayofMotorObjects) {
        let arr = [];
        arrayofMotorObjects.forEach((motor) => {
            arr.push(motor.description);
        });
        return arr;
    }

    // Generate array of interlocked motor types
    function generateInterlockedMotors() {
        let interlockedMotors = [];
        for (const k in interlock) {
            if (interlock[k] === true) {
                const kit = kitsData.filter((kit) => kit.id === k)[0];
                interlockedMotors.push(kit);
            }
        }
        return interlockedMotors;
    }

    // Helper function to calculate the FLA of an array of motors
    function calcGroupFLA(arrayOfMotorObjects) {
        let fla = 0;
        arrayOfMotorObjects.forEach((motor) => {
            fla += motor?.fla || 0;
        });
        return fla;
    }

    // Calculate largest motor hp
    function calcLargestMotor() {
        // Build an array of all included motor HP values from assembly
        let hpArr = [];

        for (const k in assembly) {
            const kit = kitsData.filter((kit) => kit.id === k)[0];
            hpArr.push(kit.hp);
        }

        return Math.max(...hpArr);
    }

    // Generate boolean if the machine includes any VFDs
    function checkVfdMachine() {
        // Build an array of all included motor objects from assembly
        let motorsArr = [];
        for (const k in assembly) {
            const kit = kitsData.filter((kit) => kit.id === k)[0];
            motorsArr.push(kit);
        }

        // Add vfds to a separate array
        const vfdsArr = motorsArr.filter(
            (motor) => motor.type === "vfd-1" || motor.type === "vfd-2"
        );

        return vfdsArr.length > 0;
    }

    function buildOnBuss() {
        let bussbarCapacity = 21;
        let onBussMotors = [];
        let offBussMotors = [];

        // console.log("|||||||||||||||||BEGIN BUSSBAR CALC||||||||||||||||||||");

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

        // Sort vfds in order of HP descending
        vfdsArr.sort((a, b) => b.hp - a.hp);
        vfdsArr.forEach((motor) => {
            offBussMotors = [...offBussMotors, motor];
        });

        // CHECK: print vfds pulled from motorsArr
        // console.log("removed vfds", generateMotorDescArr(offBussMotors));

        // Remove vfds from motorsArr
        const noVfdMotorsArr = motorsArr.filter(
            (motor) => motor.type !== "vfd-1" && motor.type !== "vfd-2"
        );

        // Add conveyors to conveyorsArr from motorsArr
        const conveyorsArr = noVfdMotorsArr.filter(
            (motor) => motor.type === "conveyor"
        );

        // CHECK: print conveyors pulled from motorsArr
        // console.log("removed conveyors", generateMotorDescArr(conveyorsArr));

        // Remove conveyors from motorsArr
        const noVfdNoConveyorMotorsArr = noVfdMotorsArr.filter(
            (motor) => motor.type !== "conveyor"
        );

        // CHECK: print initial motors array
        // console.log("filtered motors", generateMotorDescArr(noVfdNoConveyorMotorsArr));

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
        console.log({ motorsGroupedByType });

        // Add whole groups to bussbar
        console.log("-------------1st iteration WHOLE GROUPS-------------");
        priorityArr.forEach((type) => {
            const typeGroup = motorsGroupedByType[type];
            // console.log(type, { typeGroup });

            if (typeGroup) {
                // Sort in order of HP descdending so onBussMotors is sorted
                typeGroup.sort((a, b) => b.hp - a.hp);
                console.log(type, { typeGroup });
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
                    // Will later individually remove motors from offBussMotors in the next iteration
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
        });

        // Add individual motors to bussbar in descending order of type, then HP
        if (bussbarCapacity > 0) {
            console.log("------------2nd iteration PARTIAL GROUPS----------");
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
                            // console.log(
                            //     "・ :*:・ﾟ☆.・ ゜-: ✧ :- ⋇⋆✦⋆⋇⭒❃BUSSBAR COMPLETE.✮ :▹‧͙⁺ ˚*・༓ ☾.｡*ﾟ+. *."
                            // );
                        }
                    });
                }
            });
        }

        // CHECK: print on buss motor list
        console.log("ON BUSS", generateMotorDescArr(onBussMotors));

        return { conveyorsArr, onBussMotors, offBussMotors };
    }

    function buildOffBuss(offBussMotors) {
        // Subdivide offbuss by size    // Ignores 72mm

        // Build offbuss 45mm LSA groups
        console.log("-------------------45MM OFF BUSS--------------------");
        const offBussMotors45 = offBussMotors.filter(
            (motor) => motor.shoeMM == 45
        );
        const lsaGroups45 = buildLSAGroups(offBussMotors45);

        // Build offbuss 54mm LSA groups
        console.log("-------------------54MM OFF BUSS--------------------");
        const offBussMotors54 = offBussMotors.filter(
            (motor) => motor.shoeMM == 54
        );

        let lsaGroups54 = buildLSAGroups(offBussMotors54);

        // 54mm motors are wired separately if there are not more than 3 on the link bar
        const tooSmall54s = lsaGroups54.filter((group) => group.length <= 3);

        let unplacedMotors = [];
        tooSmall54s.forEach((group) => {
            unplacedMotors = [...unplacedMotors, ...group];
        });

        console.log("UNPLACED", unplacedMotors);

        // Omit groups smaller than 3 from the 54mm LSA groups
        const filteredLsaGroups54 = lsaGroups54.filter(
            (group) => group.length > 3
        );
        console.log("FINAL OFF BUSS 54mm", filteredLsaGroups54);

        return { lsaGroups45, filteredLsaGroups54, unplacedMotors };
    }

    function buildLSAGroups(offBussSubgroup) {
        // CHECK: print off buss motor list
        console.log("OFF BUSS", generateMotorDescArr(offBussSubgroup));

        // Initialize an array of arrays that will represent each group
        let lsaGroups = [[]];

        // Empty motor object to use for double VFD spacing
        const emptyMotor = {
            id: "empty",
            description: "EMPTY",
            fla: 0,
            type: "empty",
            colorCode: null,
            hp: 0,
            shoeMM: 45,
            macro: "empty",
        };

        // Initialize index for LSA groups
        let lsaIndex = 0;

        // Iterate over motors and add to lsa groups
        offBussSubgroup.forEach((motor) => {
            // Check if the current lsa group has available space or FLA capacity
            // Add a new lsa group if not
            if (
                lsaGroups[lsaIndex]?.length >= 9 ||
                63 - calcGroupFLA(lsaGroups[lsaIndex]) < motor.fla
            ) {
                lsaIndex++;
                lsaGroups[lsaIndex] = [];
            }

            // Add motor to lsa group as a single or double VFD (with empty placeholder) according to type
            if (
                // If double motor and the lsa group has at least two spaces, add the motor and a blank to the LSA group
                motor.type == "vfd-2" &&
                lsaGroups[lsaIndex].length <= 7
            ) {
                // console.log("double!", motor);
                lsaGroups[lsaIndex] = [
                    ...lsaGroups[lsaIndex],
                    motor,
                    emptyMotor,
                ];
            } else if (
                // If double motor at the last index of the LSA array, only add the single motor
                // (to avoid overflowing 9 motor limit)
                motor.type == "vfd-2" &&
                lsaGroups[lsaIndex].length >= 8
            ) {
                // console.log("double at end!", motor);
                lsaGroups[lsaIndex] = [...lsaGroups[lsaIndex], motor];
            } else {
                // If single motor, add the motor to the LSA group
                lsaGroups[lsaIndex] = [...lsaGroups[lsaIndex], motor];
            }
        });

        // Organize arrays so that same-page pairs do not equal more than 14, and add empty arrays if they do
        organizeOffBussPages(lsaGroups);

        // CHECK: print lsa groups
        console.log("LSA GROUPS", lsaGroups);

        return lsaGroups;
    }

    // Organize off buss link bar groups into pages containing <= 14 circuits
    function organizeOffBussPages(lsaGroups) {
        // lsaGroups is an array with arrays of motor objects

        const pageMax = 14;

        // iterate over the groups in increments of 2 and check if i + i+1 is fewer than 14
        for (let i = 0; i < lsaGroups.length + 1; i += 2) {
            // if the sum is greater than 14, insert an empty array
            const sum = lsaGroups[i]?.length + (lsaGroups[i + 1]?.length | 0);
            if (sum > pageMax) {
                lsaGroups.splice(i + 1, 0, []);
            }
        }

        return lsaGroups;
    }

    function buildCSV() {
        const { conveyorsArr, onBussMotors, offBussMotors } = buildOnBuss();
        const { lsaGroups45, filteredLsaGroups54, unplacedMotors } =
            buildOffBuss(offBussMotors);

        // FINALLY Generate the CSV rows
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
                    value: projectInfo.productionOrderNumber,
                    type: "String",
                },
                {
                    name: "SalesOrderNumber",
                    value: projectInfo.salesOrderNumber,
                    type: "String",
                },
                {
                    name: "NP_BuildStandard",
                    value: "ANDY",
                    type: "String",
                },
                {
                    name: "NP_DrawingNumber",
                    value: projectInfo.drawingNumber,
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
                    value: calcLargestMotor(),
                    type: "String",
                },
                {
                    name: "NP_Phase",
                    value: "JOHN",
                    type: "String",
                },
                {
                    name: "NP_SalesOrder",
                    value: projectInfo.salesOrderNumber,
                    type: "String",
                },
                {
                    name: "NP_ServiceVoltage",
                    value: "ERNESTO",
                    type: "String",
                },
                {
                    name: "NP_TotalPanelFLC",
                    value: calcTotalFLA(assembly).toFixed(2),
                    type: "String",
                },
                {
                    name: "NP_Wire",
                    value: "BILL",
                    type: "String",
                },
                {
                    name: "b_PMR",
                    value: projectInfo.phaseMonitorRelay,
                    type: "Boolean",
                },
                {
                    name: "b_VT",
                    value: projectInfo.voltageTester,
                    type: "Boolean",
                },
                {
                    name: "i_NumXFMR",
                    value: projectInfo.numXFMR | 1,
                    type: "Integer",
                },
                {
                    name: "i_SystemVoltage",
                    value: 480,
                    type: "Integer",
                },
                {
                    name: "b_VFD_Machine",
                    value: checkVfdMachine(),
                    type: "Integer",
                },
            ];

            rows = [...rows, ...projRows];

            // Add conveyor labels and macros
            conveyorsArr.forEach((conveyor) => {
                let row = {
                    name: "c_Conveyors_Labels",
                    value: conveyor.description,
                    type: "String",
                };
                rows = [...rows, row];
            });

            conveyorsArr.forEach((conveyor) => {
                let row = {
                    name: "c_Conveyors_Macros",
                    value: conveyor.macro,
                    type: "String",
                };
                rows = [...rows, row];
            });

            // Add onbuss motor labels and macros
            onBussMotors.forEach((motor) => {
                let row = {
                    name: "c_OnBuss_Labels",
                    value: motor.description,
                    type: "String",
                };
                rows = [...rows, row];
            });

            onBussMotors.forEach((motor) => {
                let row = {
                    name: "c_OnBuss_Macros",
                    value: motor.macro,
                    type: "String",
                };
                rows = [...rows, row];
            });

            // Add offbuss 45mm motor labels and macros
            lsaGroups45.forEach((group, i) => {
                group.forEach((motor) => {
                    let row = {
                        name: `c_LSA_SubList_45_${parseInt(i) + 1}_Labels`,
                        value: motor.description,
                        type: "String",
                    };
                    rows = [...rows, row];
                });

                group.forEach((motor) => {
                    let row = {
                        name: `c_LSA_SubList_45_${parseInt(i) + 1}_Macros`,
                        value: motor.macro,
                        type: "String",
                    };
                    rows = [...rows, row];
                });
            });

            // Add offbuss 54mm motor labels and macros
            filteredLsaGroups54.forEach((group, i) => {
                group.forEach((motor) => {
                    let row = {
                        name: `c_LSA_SubList_54_${parseInt(i) + 1}_Labels`,
                        value: motor.description,
                        type: "String",
                    };
                    rows = [...rows, row];
                });

                group.forEach((motor) => {
                    let row = {
                        name: `c_LSA_SubList_54_${parseInt(i) + 1}_Macros`,
                        value: motor.macro,
                        type: "String",
                    };
                    rows = [...rows, row];
                });
            });

            // Add unplaced 54mm motor labels
            unplacedMotors.forEach((motor) => {
                let row = {
                    name: "c_Unplaced_Motors_Labels",
                    value: motor.description,
                    type: "String",
                };
                rows = [...rows, row];
            });

            // Add interlocked motor types (labels)
            const interlockedMotors = generateInterlockedMotors();

            interlockedMotors.forEach((motor) => {
                let row = {
                    name: "c_Interlocked_Motors_Labels",
                    value: motor.description,
                    type: "String",
                };
                rows = [...rows, row];
            });

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
