import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import Home from './pages/Home';
import LessonPage from './pages/LessonPage';
import TestPage from './pages/TestPage';
import MedicinePage from './pages/domains/MedicinePage';
import EngineeringPage from './pages/domains/EngineeringPage';
import FinanceAccountingPage from './pages/domains/FinanceAccounting';
import ConstructionArchitecturePage from './pages/domains/ConstructionArchitecture';
import AllLessonsPage from './pages/AllLessonsPage';
import AllTestsPage from './pages/AllTestsPage';
import ProfilePage from './pages/ProfilePage';
import ReportPage from './pages/ReportPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/lesson/:id" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
      <Route path="/test/:id" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
      <Route path="/domains/medicine" element={<MedicinePage />} />
      <Route path="/domains/engineering" element={<EngineeringPage />} />
      <Route path="/domains/finance&accounting" element={<FinanceAccountingPage />} />
      <Route path="/domains/constructions&architecture" element={<ConstructionArchitecturePage />} />
      <Route path="/lessons" element={<AllLessonsPage />} />
      <Route path="/flashcards" element={<AllTestsPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

export default App;
