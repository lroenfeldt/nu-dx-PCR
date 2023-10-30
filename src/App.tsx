import "./App.css";
import { Layout } from "./components";
import {
  Route,
  Routes,
  HashRouter,
  MemoryRouter as Router,
} from "react-router-dom";
import {
  Home,
  Debug,
  Bootup,
  TestDone,
  RunTest,
  Pairing,
  TestReady,
  ViewCurves,
  ViewResults,
  BarcodeInput,
  Authentication,
  ResultList,
} from "./views";
import { DataProvider, TranslationProvider } from "./hooks";
import { ThemeProvider } from "./assets/theme/ThemeContext";
import OvalSpinner from "./components/OvalSpinner";

function App() {
  if (typeof window.api == "undefined" && window.api !== undefined) {
    return (
      <div className="App">
        <OvalSpinner height="100px" width="100px" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <TranslationProvider>
        <DataProvider>
          <HashRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Bootup />} />
                <Route path="/debug" element={<Debug />} />
                <Route path="/pairing" element={<Pairing />} />
                <Route path="/selectMethod" element={<Home />} />
                <Route path="/auth" element={<Authentication />} />
                <Route path="/testReady" element={<TestReady />} />
                <Route path="/testRunning" element={<RunTest />} />
                <Route path="/uploadResults" element={<TestDone />} />
                <Route path="/ViewResults" element={<ViewResults />} />
                <Route path="/enterBarcodes" element={<BarcodeInput />} />
                <Route path="/viewCurves/:id" element={<ViewCurves />} />
                <Route path="/ResultList" element={<ResultList />} />
              </Routes>
            </Layout>
          </HashRouter>
        </DataProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}

export default App;
