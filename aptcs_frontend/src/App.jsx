import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ElectionList from './pages/ElectionList';
import VotingInterface from './pages/VotingInterface';
import FacilityList from './pages/FacilityList';
import LeaveList from './pages/LeaveList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/elections" element={<ElectionList />} />
            <Route path="/election/:id" element={<VotingInterface />} />
            <Route path="/facilities" element={<FacilityList />} />
            <Route path="/leaves" element={<LeaveList />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
