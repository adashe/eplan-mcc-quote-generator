import { Link } from "react-router-dom";

import Button from "../components/buttons/Button";
import PageNarrow from "../components/PageNarrow";
import LinkButton from "../components/buttons/LinkButton";

function GeneratorMenu() {
    return (
        <PageNarrow>
            <LinkButton route={"/assembly"}>MCC 208V</LinkButton>
        </PageNarrow>
    );
}

export default GeneratorMenu;
