import { useMcc } from "../../contexts/MccContext";

import PageWide from "../../components/PageWide";
import TabNavigation from "../../components/TabNavigation";

import KitSummaryRow from "./KitSummaryRow";
import Button from "../../components/buttons/Button";
import LinkButton from "../../components/buttons/LinkButton";
import EECButton from "../../components/buttons/EECButton";

function KitSummary() {
    const { kitsData, assembly } = useMcc();

    // Filter kitsData to include only kits selected by user
    const selectedKitsArr = kitsData.filter((kit) => assembly[kit.id] > 0);

    return (
        <PageWide>
            <TabNavigation>
                <LinkButton route={"/assembly"}>Edit Inputs</LinkButton>
                <Button isActive={false}>Kit Summary</Button>
                <LinkButton route={"/totals"}>Totals</LinkButton>
                <LinkButton route={"/relaySchedule"}>Relay Schedule</LinkButton>
                <EECButton />
            </TabNavigation>
            <h2>KIT SUMMARY</h2>
            {selectedKitsArr.map((kit, i) => (
                <KitSummaryRow kit={kit} key={i} />
            ))}
        </PageWide>
    );
}

export default KitSummary;
