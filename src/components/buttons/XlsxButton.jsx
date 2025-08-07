import { utils, writeFile } from "xlsx";
import { useMcc } from "../../contexts/MccContext";
import Button from "./Button";

export function XlsxButton() {
    const {
        kitsData,
        optionsData,
        partsData,
        assembly,
        baseAssembly,
        projectInfo,
    } = useMcc();

    function downloadXlsx() {
        if (window.confirm("Are you sure you want to download this file?")) {
            // Build a parts list from the assembly and baseAssembly objects with the parts numbers and their quantities
            let partsList = {};

            // Build a parts list from the assembly object with the parts numbers and their quantities
            for (const k in assembly) {
                if (assembly[k] > 0) {
                    const arr = kitsData.filter((kit) => kit.id === k);
                    const kit = arr[0];
                    kit?.parts.forEach((part) => {
                        const partID = Object.keys(part)[0];
                        const qty = Object.values(part)[0];

                        partsList[partID] =
                            partsList[partID] + assembly[k] * qty ||
                            assembly[k] * qty;
                    });
                }
            }

            // Add parts from the baseAssembly object with the parts numbers and their quantities
            for (const k in baseAssembly) {
                if (baseAssembly[k] > 0) {
                    const arr = optionsData.filter((kit) => kit.id === k);
                    const kit = arr[0];
                    kit?.parts.forEach((part) => {
                        const partID = Object.keys(part)[0];
                        const qty = Object.values(part)[0];

                        partsList[partID] =
                            partsList[partID] + baseAssembly[k] * qty ||
                            baseAssembly[k] * qty;
                    });
                }
            }

            // Build the download array
            let rows = [];
            const quoteID = projectInfo.projectNumber;

            const selectedPartsArr = partsData.filter(
                (part) => partsList[part.id] > 0
            );

            selectedPartsArr.map((part, i) => {
                const row = {
                    ID: i + 1,
                    "Main ID": 1,
                    "Item ID": quoteID,
                    "Component ID": part.id,
                    "Qty Per Assembly": partsList[part.id],
                    "Save Changes": "Y",
                };
                rows = [...rows, row];
            });

            // Build the cover sheet array
            let cover = [{ ID: 1, "Item ID": quoteID, "Save Changes": "Y" }];

            /* generate worksheet from cover array */
            const cws = utils.json_to_sheet(cover);

            /* generate worksheet from rows array */
            const ws = utils.json_to_sheet(rows);

            /* create workbook and append worksheet */
            const wb = utils.book_new();
            utils.book_append_sheet(wb, cws, "Assembly");
            utils.book_append_sheet(wb, ws, `${quoteID} Prophet21 BoM Input`);

            /* export to XLSX */
            writeFile(wb, `${quoteID} Prophet21 BoM Input.xlsx`);
        }
    }

    return (
        <Button className="active" onClick={downloadXlsx}>
            DOWNLOAD XLSX
        </Button>
    );
}
