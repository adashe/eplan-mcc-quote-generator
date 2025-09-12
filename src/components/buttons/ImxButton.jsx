import { useMcc } from "../../contexts/MccContext";
import Button from "./Button";

function ImxButton() {
    const { kitsData, assembly } = useMcc();

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

        // TEST: print vfds pulled from motorsArr
        const offBussVfds = [];
        offBussMotors.forEach((motor) => offBussVfds.push(motor.description));
        console.log("removed vfds", offBussVfds);

        // Remove vfds from motorsArr
        const filteredMotorsArr = motorsArr.filter(
            (motor) => motor.type !== "vfd-1" && motor.type !== "vfd-2"
        );

        // TEST: print initial motors
        let initialMotorsArr = [];
        filteredMotorsArr.forEach((motor) =>
            initialMotorsArr.push(motor.description)
        );
        console.log("initial motors arr", initialMotorsArr);

        // Build prioritized array of function groups to iterate over hp groups
        const priorityArr = [
            "blower",
            "conveyor",
            "wrap",
            "topBrush",
            "otherSpare",
            "omni",
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
            filteredMotorsArr,
            ({ type }) => type
        );
        // console.log({ motorsGroupedByType });

        // Add whole groups to bussbar
        console.log(
            "------------------1st iteration WHOLE GROUPS------------------"
        );
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

        // TEST: print results
        const onBussDesc = [];
        onBussMotors.forEach((motor) => onBussDesc.push(motor.description));
        console.log("ON BUSS", onBussDesc);

        buildOffBuss(offBussMotors);
    }

    function buildOffBuss(offBussMotors) {
        const offBussDesc = [];
        offBussMotors.forEach((motor) => offBussDesc.push(motor.description));
        console.log("OFF BUSS", offBussDesc);

        // count up total off buss FLA (reusable calculation)

        // calculate number of containers by dividing FLA by 63 (max amps per group) and rounding up

        // calculate average FLA per container by dividing off buss FLA by the number of containers

        // create arrays to represent each container

        // sort offbuss list by function

        // sort off buss function groups by size from largest to smallest

        // add whole function groups to containers from largest to smallest into containers
        // up to the "ideal" FLA limit

        // add partial function groups to remaining containers up to 63 FLA
    }

    buildOnBuss();

    function downloadImx() {
        if (window.confirm("Are you sure you want to download this file?")) {
            const projName = "208VMCC"; // placeholder for input from proj info form
            const libName = "ConstructionKit_208VMCC"; // placeholder for input from proj info form

            // placeholder for conversion from assembly object
            const projParams = `<mo name="${projName}" typeClass="${libName}.Machine.${projName}">
                <parameter name="AxisAmount" type="Integer" value="3"/>
                <parameter name="DCFuse" type="String" value="MCCB"/>
                <parameter name="GlobalConfiguration" type="String" value="AxisControl"/>
                <parameter name="GlobalDistance" type="Double" value="1.0"/> 
                <parameter name="GlobalWeight" type="Integer" value="10"/>
            </mo>`;

            const imxStr = `<?xml version="1.0" encoding="utf-8"?>
<imx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xi="http://www.w3.org/2001/XInclude" version="1.0">
    <project name="${projName}" save="true" >
        <libraries>
            <add type="String" value="${libName}"/>
        </libraries>
        ${projParams}
    </project>
</imx>`;

            console.log(imxStr);

            const element = document.createElement("a");
            const file = new Blob([imxStr], {
                type: "text/plain",
            });
            element.href = URL.createObjectURL(file);
            element.download = "ImportFile.imx";
            document.body.appendChild(element);
            element.click();
        }
    }
    return (
        <Button className="active" onClick={downloadImx}>
            DOWNLOAD IMX
        </Button>
    );
}

export default ImxButton;
