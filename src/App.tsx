import './App.css';
import { Layout } from './components';
import { Oval } from 'react-loader-spinner';
import { Route, Routes, HashRouter, MemoryRouter as Router } from 'react-router-dom';
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
} from './views';
import { DataProvider, TranslationProvider } from './hooks';

declare global {
  interface Window {
    api?: any; // method or function
  }
}

function App() {
  if (typeof window.api == 'undefined' && window.api !== undefined) {
    return (
      <div className="App">
        <div className="spinnerContainer">
          <Oval height="100" width="100" color="var(--primary)" />
        </div>
      </div>
    );
  }

  return (
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
  );
}

export default App;
