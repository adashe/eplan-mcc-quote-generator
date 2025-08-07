import { useMcc } from "../../contexts/MccContext";
import Button from "../../components/buttons/Button";
import LinkButton from "../../components/buttons/LinkButton";

import PageWide from "../../components/PageWide";
import KitSummaryRow from "./KitSummaryRow";

import TabNavigation from "../../components/TabNavigation";

function KitSummary() {
    const { kitsData, optionsData, assembly, baseAssembly } = useMcc();

    // Filter kitsData to include only kits selected by user
    const selectedKitsArr = kitsData.filter((kit) => assembly[kit.id] > 0);

    // Filter optionsData to include only options selected by user
    const selectedOptionsArr = optionsData.filter(
        (kit) => baseAssembly[kit.id] > 0
    );

    return (
        <PageWide>
            <TabNavigation>
                <LinkButton route={"/assembly"}>Edit Inputs</LinkButton>
                <Button isActive={false}>Kit Summary</Button>
                <LinkButton route={"/partSummary"}>Part Summary</LinkButton>
                <LinkButton route={"/totals"}>Totals</LinkButton>
                <LinkButton route={"/projectInfo"}>Download IMX</LinkButton>
            </TabNavigation>
            <h2>KIT SUMMARY</h2>

            {selectedOptionsArr.map((kit, i) => (
                <KitSummaryRow kit={kit} key={i} />
            ))}

            {selectedKitsArr.map((kit, i) => (
                <KitSummaryRow kit={kit} key={i} />
            ))}
        </PageWide>
    );
}

export default KitSummary;
