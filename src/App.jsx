import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MccProvider } from "./contexts/MccContext";

import AssemblyForm from "./pages/AssemblyForm/AssemblyForm";
import OptionsForm from "./pages/OptionsForm";
import ProjectInfo from "./pages/ProjectInfo";
import KitSummary from "./pages/KitSummary/KitSummary";
import PartSummary from "./pages/PartSummary/PartSummary";
import Totals from "./pages/Totals";

function App() {
    return (
        <MccProvider>
            <BrowserRouter basename="/eplan-mcc-quote-generator/">
                <Routes>
                    <Route index element={<AssemblyForm />} />
                    <Route path="assembly" element={<AssemblyForm />} />
                    <Route path="options" element={<OptionsForm />} />
                    <Route path="kitSummary" element={<KitSummary />} />
                    <Route path="partSummary" element={<PartSummary />} />
                    <Route path="totals" element={<Totals />} />
                    <Route path="projectInfo" element={<ProjectInfo />} />
                    <Route path="*" element={<AssemblyForm />} />
                </Routes>
            </BrowserRouter>
        </MccProvider>
    );
}

export default App;
