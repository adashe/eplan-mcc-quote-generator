import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MccProvider } from "./contexts/MccContext";

import GeneratorMenu from "./pages/GeneratorMenu";
import AssemblyForm from "./pages/AssemblyForm/AssemblyForm";
import ConveyorForm from "./pages/AssemblyForm/ConveyorForm";
import OptionsForm from "./pages/OptionsForm";
import ProjectInfo from "./pages/ProjectInfo";
import KitSummary from "./pages/KitSummary/KitSummary";
import Totals from "./pages/Totals";
import RelayScheduleForm from "./pages/RelayScheduleForm/RelayScheduleForm";

function App() {
    return (
        <MccProvider>
            <BrowserRouter basename="/eplan-mcc-quote-generator/">
                <Routes>
                    <Route index element={<GeneratorMenu />} />
                    <Route path="assembly" element={<AssemblyForm />} />
                    <Route path="conveyor" element={<ConveyorForm />} />
                    <Route path="options" element={<OptionsForm />} />
                    <Route
                        path="relaySchedule"
                        element={<RelayScheduleForm />}
                    />
                    <Route path="kitSummary" element={<KitSummary />} />
                    <Route path="totals" element={<Totals />} />
                    <Route path="projectInfo" element={<ProjectInfo />} />
                    <Route path="*" element={<AssemblyForm />} />
                </Routes>
            </BrowserRouter>
        </MccProvider>
    );
}

export default App;
