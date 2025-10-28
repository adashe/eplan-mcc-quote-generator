import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MccProvider } from "./contexts/MccContext";

import GeneratorMenu from "./pages/GeneratorMenu";
import AssemblyForm from "./pages/AssemblyForm/AssemblyForm";
import ConveyorForm from "./pages/AssemblyForm/ConveyorForm";
import ProjectInfo from "./pages/ProjectInfoForm/ProjectInfo";
import KitSummary from "./pages/KitSummary/KitSummary";
import MccSummary from "./pages/MccSummary/MccSummary";
import RelayScheduleForm from "./pages/RelayScheduleForm/RelayScheduleForm";

function App() {
    return (
        <MccProvider>
            <BrowserRouter basename="/eplan-mcc-quote-generator/">
                <Routes>
                    <Route index element={<GeneratorMenu />} />
                    <Route path="assembly" element={<AssemblyForm />} />
                    <Route path="conveyor" element={<ConveyorForm />} />
                    <Route path="projectInfo" element={<ProjectInfo />} />
                    <Route
                        path="relaySchedule"
                        element={<RelayScheduleForm />}
                    />
                    <Route path="kitSummary" element={<KitSummary />} />
                    <Route path="mccSummary" element={<MccSummary />} />

                    <Route path="*" element={<AssemblyForm />} />
                </Routes>
            </BrowserRouter>
        </MccProvider>
    );
}

export default App;
