import { lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MccProvider } from "./contexts/MccContext";

const AssemblyForm = lazy(() => import("./pages/AssemblyForm/AssemblyForm"));
const ConveyorForm = lazy(() => import("./pages/AssemblyForm/ConveyorForm"));
const ProjectInfo = lazy(() => import("./pages/ProjectInfoForm/ProjectInfo"));
const KitSummary = lazy(() => import("./pages/KitSummary/KitSummary"));
const MccSummary = lazy(() => import("./pages/MccSummary/MccSummary"));
const RelayScheduleForm = lazy(() =>
    import("./pages/RelayScheduleForm/RelayScheduleForm")
);

function App() {
    return (
        <MccProvider>
            <BrowserRouter basename="/eplan-mcc-quote-generator/">
                <Routes>
                    <Route index element={<Navigate replace to="assembly" />} />
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
