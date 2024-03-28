import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientDetails from './PatientDetails';
import PatientHistoryGraph from './PatientHistoryGraph';

// Wrap the PatientHistoryGraph and PatientDetails component with Router
const App = () => (
  <Router>
    <Routes>
      <Route exact path="/" element={<PatientHistoryGraph />} />
      <Route path="/details/:id" element={<PatientDetails />} />
    </Routes>
  </Router>
);

export default App;
