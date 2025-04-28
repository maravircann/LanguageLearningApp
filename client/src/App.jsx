import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import Home from './pages/Home';
import LessonPage from './pages/LessonPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/lesson/:id" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;
