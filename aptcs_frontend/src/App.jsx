import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import ElectionList from './pages/ElectionList';
import VotingInterface from './pages/VotingInterface';
import FacilityList from './pages/FacilityList';
import LeaveList from './pages/LeaveList';
import ComplaintList from './pages/ComplaintList';
import NoticeList from './pages/NoticeList';
import ElectionResults from './pages/ElectionResults';
import PlacementList from './pages/PlacementList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/elections" element={<ElectionList />} />
              <Route path="/election/:id" element={<VotingInterface />} />
              <Route path="/election/:id/results" element={<ElectionResults />} />
              <Route path="/facilities" element={<FacilityList />} />
              <Route path="/leaves" element={<LeaveList />} />
              <Route path="/complaints" element={<ComplaintList />} />
              <Route path="/notices" element={<NoticeList />} />
              <Route path="/placements" element={<PlacementList />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
