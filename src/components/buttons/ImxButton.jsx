// import { useMcc } from "../../contexts/MccContext";
import Button from "./Button";

function ImxButton() {
<<<<<<< Updated upstream
    function downloadImx() {
        // const { kitsData, assembly, projectInfo, interlock, calcTotalFLA } =
        //     useMcc();
=======
  const { kitsData, assembly, projectInfo, interlock, calcTotalFLA } = useMcc();
>>>>>>> Stashed changes

  // A Lot of this code was imported from EECButton.jsx
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
    return Number(fla.toFixed(1));
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

  // Generate array of VFD motors
  function generateVFDMotors() {
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

    return vfdsArr;
  }

  function buildOnBuss() {
    let bussbarCapacity = 21;
    let onBussMotors = [];
    let offBussMotors = [];

    // console.log("|||||||||||||||||BEGIN BUSSBAR CALC||||||||||||||||||||");

    // Build an array of all included motor objects from assembly
    let motorsArr = []; // so far, this gets the motor_id index
    let index = 1;

    for (const k in assembly) {
      const kit = kitsData.filter((kit) => kit.id === k)[0];
      // Include duplicate motors in the array
      // TODO: Add ID at this step?
      // How would I want to generate an ID? So far we create a motor_id attribute and append an index to the given id

      // assembly[kit.id] goes from kit to kit.id, finds a key, then goes to assembly to find the value at the key within assembly
      // THAT'S how much you traverse through the for loop
      for (let i = 0; i < assembly[kit.id]; i++) {
        // console.log(kit);
        const kitAndID = Object.create(kit);

        kitAndID.motor_id = `${kitAndID.id}_${index}`; // this does create different motor_IDs
        console.log(index, kitAndID.motor_id, kitAndID); // this attaches the largest duplicate motor_ID to all kits???
        motorsArr.push(kitAndID);
        index++;
      }
    }

    console.log("Motors Array", motorsArr);

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
      "none",
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
              const index = offBussMotors.findIndex((m) => m.id === motor.id);
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
    const offBussMotors45 = offBussMotors.filter((motor) => motor.shoeMM == 45);
    const lsaGroups45 = buildLSAGroups(offBussMotors45);

    // Build offbuss 54mm LSA groups
    console.log("-------------------54MM OFF BUSS--------------------");
    const offBussMotors54 = offBussMotors.filter((motor) => motor.shoeMM == 54);

    let lsaGroups54 = buildLSAGroups(offBussMotors54);

    // 54mm motors are wired separately if there are not more than 3 on the link bar
    const tooSmall54s = lsaGroups54.filter((group) => group.length <= 3);

    let unplacedMotors = [];
    tooSmall54s.forEach((group) => {
      unplacedMotors = [...unplacedMotors, ...group];
    });

    console.log("UNPLACED", unplacedMotors);

    // Omit groups smaller than 3 from the 54mm LSA groups
    const filteredLsaGroups54 = lsaGroups54.filter((group) => group.length > 3);
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
        lsaGroups[lsaIndex] = [...lsaGroups[lsaIndex], motor, emptyMotor];
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

  // arr: input array to copy over to rows array
  // val: piece.description or piece.macro
  function addRowComponent(arr, rows, n, t, val) {
    arr.forEach((piece) => {
      let row = {
        name: n,
        type: t,
        value:
          val === "Description"
            ? piece.description
            : val === "Macro"
            ? piece.macro
            : null,
      };
      rows = [...rows, row];
      //   console.log(rows);
    });
    return rows;
  }

  function writeToIMXstring(str, title, arr) {
    let index = 1;
    if (arr.length === 0) return "";

    str = `\t\t<mo name="${title}" typeClass="${title}" save="true">\n`;
    arr.forEach((row) => {
      str += `\t\t\t<parameter name="s_Motor${index}" type="String" value="${row.motor_id}"/>\n`;
      index++;
    });
    str += `\t\t\t<parameter name="i_${title}_FLA" type="Integer" value="${calcGroupFLA(
      arr
    )}"/>\n\t\t</mo>`;
    return str;
  }

  function writeLinkBarsToIMX(str, title, arr, barCount) {
    let index = 1;
    if (arr.length === 0) return "";
    str = `\n\t\t<mo name="${title}_${barCount}" typeClass="${title}" save="true">\n`;
    arr.forEach((row) => {
      if (row.description !== "EMPTY") {
        str += `\t\t\t<parameter name="s_Motor${index}" type="String" value="${row.motor_id}"/>\n`;
        index++;
      }
    });
    str += `\t\t\t<parameter name="i_${title}_FLA" type="Integer" value="${calcGroupFLA(
      arr
    )}"/>\n\t\t</mo>`;

    return str;
  }

  function downloadImx() {
    const { conveyorsArr, onBussMotors, offBussMotors } = buildOnBuss();
    const { lsaGroups45, filteredLsaGroups54, unplacedMotors } =
      buildOffBuss(offBussMotors);

    if (window.confirm("Are you sure you want to download this file?")) {
      let rows = [];
      // Add project info
      const projRows = [
        {
          name: "s_DrawingNumber",
          value: projectInfo.drawingNumber,
          type: "String",
        },
        {
          name: "s_ProjectDescription",
          value: projectInfo.projectName,
          type: "String",
        },
        {
          name: "s_ProductionOrderNumber",
          value: projectInfo.productionOrderNumber,
          type: "String",
        },
        {
          name: "s_SalesOrderNumber",
          value: projectInfo.salesOrderNumber,
          type: "String",
        },
        {
          name: "s_LargestMotor",
          value: calcLargestMotor(),
          type: "String",
        },
        {
          name: "i_FLA",
          value: calcTotalFLA(assembly).toFixed(2),
          type: "Integer",
        },
        {
          name: "b_PMR",
          value: projectInfo.phaseMonitorRelay | true,
          type: "Boolean",
        },
        {
          name: "b_VT",
          value: projectInfo.voltageTester | true,
          type: "Boolean",
        },
        {
          name: "i_NumXFMR",
          value: projectInfo.numXFMR | 1,
          type: "Integer",
        },
        {
          name: "i_SystemVoltage",
          value: "480V",
          type: "String",
        },
        {
          name: "s_ControlVoltage",
          value: projectInfo.controlVoltage,
          type: "String",
        },
        {
          name: "s_SolenoidVoltage",
          value: projectInfo.solenoidVoltage,
          type: "String",
        },
        {
          name: "b_VFD_Machine",
          value: generateVFDMotors().length > 0,
          type: "Boolean",
        },
        {
          name: "i_NumVFDs",
          value: generateVFDMotors().length,
          type: "Integer",
        },
        {
          name: "s_Install",
          value: projectInfo.install,
          type: "Boolean",
        },
      ];

      rows = [...rows, ...projRows];

      // console.log("Rows Array 1: Start", rows);

      rows = addRowComponent(
        conveyorsArr,
        rows,
        "c_Conveyors_Labels",
        "String",
        "Description"
      );
      rows = addRowComponent(
        conveyorsArr,
        rows,
        "c_Conveyors_Macros",
        "String",
        "Macro"
      );
      rows = addRowComponent(
        onBussMotors,
        rows,
        "c_OnBuss_Labels",
        "String",
        "Description"
      );
      rows = addRowComponent(
        onBussMotors,
        rows,
        "c_OnBuss_Macros",
        "String",
        "Macro"
      );
      lsaGroups45.forEach((group, i) => {
        rows = addRowComponent(
          group,
          rows,
          `c_LSA_SubList_45_${parseInt(i) + 1}_Labels`,
          "String",
          "Description"
        );
        rows = addRowComponent(
          group,
          rows,
          `c_LSA_SubList_45_${parseInt(i) + 1}_Macros`,
          "String",
          "Macro"
        );
        let flaRow = {
          name: `c_LSA_SubList_45_${parseInt(i) + 1}_FLA`,
          value: calcGroupFLA(group).toFixed(2),
          type: "Integer",
        };
        let sizeRow = {
          name: `c_LSA_SubList_45_${parseInt(i) + 1}_Size`,
          value: 45,
          type: "Integer",
        };
        group.length > 0 && (rows = [...rows, flaRow, sizeRow]);
      });

      filteredLsaGroups54.forEach((group, i) => {
        rows = addRowComponent(
          group,
          rows,
          `c_LSA_SubList_54_${parseInt(i) + 1}_Labels`,
          "String",
          "Description"
        );
        rows = addRowComponent(
          group,
          rows,
          `c_LSA_SubList_54_${parseInt(i) + 1}_Macros`,
          "String",
          "Macro"
        );
        let flaRow = {
          name: `c_LSA_SubList_54_${parseInt(i) + 1}_FLA`,
          value: calcGroupFLA(group).toFixed(2),
          type: "Integer",
        };

        let sizeRow = {
          name: `c_LSA_SubList_54_${parseInt(i) + 1}_Size`,
          value: 54,
          type: "Integer",
        };
        group.length > 0 && (rows = [...rows, flaRow, sizeRow]);
      });
      rows = addRowComponent(
        unplacedMotors,
        rows,
        "c_Unplaced_Labels",
        "String",
        "Description"
      );
      const interlockedMotors = generateInterlockedMotors();
      rows = addRowComponent(
        interlockedMotors,
        rows,
        "c_Interlocked_Labels",
        "String",
        "Description"
      );
      // console.log("Rows Array 2: Final", rows);

      console.log("Conveyors Array:", conveyorsArr);
      console.log("On Buss Motors Array:", onBussMotors);
      console.log("LSA Groups 45 Array:", lsaGroups45);
      console.log("Filtered LSA Groups 54 Array:", filteredLsaGroups54);
      console.log("Unplaced Motors Array:", unplacedMotors);
      console.log("Interlocked Motors Array:", interlockedMotors);

      const projName = "208VMCC"; // placeholder for input from proj info form
      const libName = "ConstructionKit_208VMCC"; // placeholder for input from proj info form

      // placeholder for conversion from assembly object
      const projParams = `\t\t<mo name="${projName}" typeClass="${libName}.Machine.${projName}">
\t\t\t\t<parameter name="AxisAmount" type="Integer" value="3"/>
\t\t\t\t<parameter name="DCFuse" type="String" value="MCCB"/>
\t\t\t\t<parameter name="GlobalConfiguration" type="String" value="AxisControl"/>
\t\t\t\t<parameter name="GlobalDistance" type="Double" value="1.0"/> 
\t\t\t\t<parameter name="GlobalWeight" type="Integer" value="10"/>`;
      //

      // hi now let's figure out how to format our imx file
      let systemParams = "";
      projRows.forEach((row) => {
        // systemParams += `            <parameter name="${row.name}" type="${row.type}" value="${row.value}"/>\n`;
        systemParams += `\t\t\t<parameter name="${row.name}" type="${row.type}" value="${row.value}"/>\n`;
      });
      // systemParams = systemParams.slice(0, -1);
      // console.log(systemParams);

      // console.log(rows);

      // testing with on buss motors
      let index = 1;
      let motorItem = '\t\t<mo name="Motors" typeClass="Motors" save="true">\n';
      onBussMotors.forEach((row) => {
        motorItem += `\t\t\t<mo name="MOTOR_${index}" typeClass="MOTOR" save="true">\n`;
        motorItem += `\t\t\t\t<parameter name="s_Label" type="String" value="${row.description}"/>\n`;
        motorItem += `\t\t\t\t<parameter name="s_Macro" type="String" value="${row.macro}"/>\n`;
        motorItem += `\t\t\t\t<parameter name="s_ID" type="String" value="${row.motor_id}"/>\n`;
        motorItem += `\t\t\t\t<parameter name="s_HP" type="String" value="${row.hp}HP"/>\n`;
        motorItem += "\t\t\t</mo>\n";
        index++;
      });
      motorItem += "\t\t</mo>";

      let onBuss_String = "";
      onBuss_String = writeToIMXstring(
        onBuss_String,
        "OnBuss_Motors",
        onBussMotors
      );

      let conveyers_String = "";
      conveyers_String = writeToIMXstring(
        conveyers_String,
        "Conveyor_Motors",
        conveyorsArr
      );

      let linkbar_String = "";
      index = 1;
      [...lsaGroups45, ...filteredLsaGroups54].forEach((bar) => {
        if (bar.length !== 0) {
          linkbar_String += writeLinkBarsToIMX(
            linkbar_String,
            "LinkBar",
            bar,
            index
          );
          index++;
        }
      });

      let unplacedMotors_String = "";
      unplacedMotors_String = writeToIMXstring(
        unplacedMotors_String,
        "Unplaced_Motors",
        unplacedMotors
      );

      let interlockedMotors_String = "";
      interlockedMotors_String = writeToIMXstring(
        interlockedMotors_String,
        "Interlocked_Motors",
        interlockedMotors
      );

      const imxStr = `<?xml version="1.0" encoding="utf-8"?>
<imx xmlns version="1.0">
\t<project name="${projName}" save="true" >
${systemParams}
${motorItem}
${conveyers_String}
${onBuss_String}${linkbar_String}${unplacedMotors_String}${interlockedMotors_String}
\t</project>
</imx>`;
      // \t</mo>
      // ${projParams}

      /* 



*/

      console.log(imxStr);

      // // Build imx output
      // const element = document.createElement("a");
      // const file = new Blob([imxStr], {
      //   type: "text/plain",
      // });
      // element.href = URL.createObjectURL(file);
      // element.download = "ImportFile.imx";
      // document.body.appendChild(element);
      // element.click();
    }
  }
  return (
    <Button className="active" onClick={downloadImx}>
      DOWNLOAD IMX
    </Button>
  );
}

export default ImxButton;

// Assignments: Each of the arrays that have been built so far, LSA Groups are Linkbars
