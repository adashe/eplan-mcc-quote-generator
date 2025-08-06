import Button from "./Button";

function ImxButton() {
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
