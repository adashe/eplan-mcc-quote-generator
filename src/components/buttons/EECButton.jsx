import { utils, writeFile } from "xlsx";
import { useMcc } from "../../contexts/MccContext";
import Button from "./Button";

function EECButton() {
    const { kitsData, assembly, projectInfo } = useMcc();

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

    // Calculate total panel FLA
    function calcTotalPanelFLA() {
        // Build an array of all included motor objects from assembly
        let motorsArr = [];

        for (const k in assembly) {
            const kit = kitsData.filter((kit) => kit.id === k)[0];

            // Include duplicate motors in the array
            for (let i = 0; i < assembly[kit.id]; i++) {
                motorsArr.push(kit);
            }
        }

        return calcGroupFLA(motorsArr);
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

        vfdsArr.sort((a, b) => b.hp - a.hp);
        vfdsArr.forEach((motor) => {
            offBussMotors = [...offBussMotors, motor];
        });

        // CHECK: print vfds pulled from motorsArr
        // console.log("removed vfds", checkMotors(offBussMotors));

        // Remove vfds from motorsArr
        const noVfdMotorsArr = motorsArr.filter(
            (motor) => motor.type !== "vfd-1" && motor.type !== "vfd-2"
        );

        // Add conveyors to conveyorsArr from motorsArr
        const conveyorsArr = noVfdMotorsArr.filter(
            (motor) => motor.type === "conveyor"
        );

        // CHECK: print conveyors pulled from motorsArr
        // console.log("removed conveyors", checkMotors(conveyorsArr));

        // Remove conveyors from motorsArr
        const noVfdNoConveyorMotorsArr = noVfdMotorsArr.filter(
            (motor) => motor.type !== "conveyor"
        );

        // CHECK: print initial motors array
        // console.log("filtered motors", checkMotors(noVfdNoConveyorMotorsArr));

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
        // console.log("-------------1st iteration WHOLE GROUPS-------------");
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
                        // console.log(
                        //     "added",
                        //     type,
                        //     "typeCount",
                        //     typeGroup.length,
                        //     "bussCapacity",
                        //     bussbarCapacity
                        // );
                    } else {
                        // Add motors to offBuss if the whole group won't fit
                        // Will later individually remove motors from this arr
                        // in the next iteration
                        // console.log(
                        //     "not added",
                        //     type,
                        //     "typeCount",
                        //     typeGroup.length,
                        //     "bussCapacity",
                        //     bussbarCapacity
                        // );
                        offBussMotors = [...offBussMotors, ...typeGroup];
                    }
                } else {
                    // console.log("none", type);
                }
            } else {
                // console.log(
                //     "・ :*:・ﾟ☆.・ ゜-: ✧ :- ⋇⋆✦⋆⋇⭒❃BUSSBAR COMPLETE.✮ :▹‧͙⁺ ˚*・༓ ☾.｡*ﾟ+. *."
                // );
            }
        });

        // Add individual motors to bussbar in descending order of type, then HP
        if (bussbarCapacity > 0) {
            // console.log(
            //     "----------------2nd iteration PARTIAL GROUPS--------------"
            // );
            priorityArr.forEach((type) => {
                const typeGroup = motorsGroupedByType[type];

                if (typeGroup) {
                    // Sort motors within the group by HP
                    typeGroup.sort((a, b) => b.hp - a.hp);
                    // console.log(type, { typeGroup });

                    // Add individual motors to onBussMotors
                    typeGroup.forEach((motor) => {
                        if (bussbarCapacity > 0) {
                            onBussMotors = [...onBussMotors, motor];
                            bussbarCapacity -= 1;
                            // console.log(
                            //     "added",
                            //     motor.description,
                            //     "bussCapacity",
                            //     bussbarCapacity
                            // );

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
        console.log("ON BUSS", checkMotors(onBussMotors));

        return { conveyorsArr, onBussMotors, offBussMotors };
    }

    function buildOffBuss(offBussMotors) {
        // CHECK: print off buss motor list
        console.log("OFF BUSS", checkMotors(offBussMotors));

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
        };

        // Initialize index for LSA groups
        let lsaIndex = 0;

        // Iterate over motors and add to lsa groups
        offBussMotors.forEach((motor) => {
            // Check if the current lsa group has quantity or FLA capacity
            // Add a new lsa group if not
            if (
                lsaGroups[lsaIndex]?.length >= 9 ||
                63 - calcGroupFLA(lsaGroups[lsaIndex]) < motor.fla
            ) {
                lsaIndex++;
                lsaGroups[lsaIndex] = [];
            }

            // Add motor to lsa group as a single or double according to type
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

        const onBussArr = checkMotors(onBussMotors);

        // Subdivide offbuss by size                    // Omits 72mm
        const offBussMotors45 = offBussMotors.filter(
            (motor) => motor.shoeMM == 45
        );
        const offBussMotors54 = offBussMotors.filter(
            (motor) => motor.shoeMM == 54
        );

        // Build offbuss groups
        console.log("-------------------45MM OFF BUSS--------------------");
        const lsaGroups45 = buildOffBuss(offBussMotors45);
        console.log("-------------------54MM OFF BUSS--------------------");
        let lsaGroups54 = buildOffBuss(offBussMotors54);

        // Break down 54mm motors into singles if there are not more than 3 on the link bar
        const tooSmall54s = lsaGroups54.filter((group) => group.length <= 3);

        let unplacedMotors = [];
        tooSmall54s.forEach((group) => {
            unplacedMotors = [...unplacedMotors, ...group];
        });

        console.log("UNPLACED", unplacedMotors);
        const unplacedMotorsArr = checkMotors(unplacedMotors);

        // Omit groups smaller than 3 from the 54mm LSA groups
        const filteredLsaGroups54 = lsaGroups54.filter(
            (group) => group.length > 3
        );
        console.log("FINAL OFF BUSS 54mm", filteredLsaGroups54);

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
                    value: calcTotalPanelFLA(),
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

            // Add onbuss motors
            onBussArr.forEach((motor) => {
                let row = {
                    name: "c_OnBussMotors",
                    value: motor,
                    type: "String",
                };
                rows = [...rows, row];
            });

            // Add offbuss 45mm motors
            lsaGroups45.forEach((group, i) => {
                const LsaArr = checkMotors(lsaGroups45[i]);
                LsaArr.forEach((motor) => {
                    let row = {
                        name: `c_LSA_SubList_45_${parseInt(i) + 1}`,
                        value: motor,
                        type: "String",
                    };
                    rows = [...rows, row];
                });
            });

            // Add offbuss 54mm motors
            filteredLsaGroups54.forEach((group, i) => {
                const LsaArr = checkMotors(lsaGroups54[i]);
                LsaArr.forEach((motor) => {
                    let row = {
                        name: `c_LSA_SubList_54_${parseInt(i) + 1}`,
                        value: motor,
                        type: "String",
                    };
                    rows = [...rows, row];
                });
            });

            // Add unplaced 54mm motors
            unplacedMotorsArr.forEach((motor) => {
                let row = {
                    name: "c_Unplaced_Motor",
                    value: motor,
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
