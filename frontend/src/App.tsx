import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HabitsPage from './pages/HabitsPage';
import RewardsPage from './pages/RewardsPage';
import ArticlesPage from './pages/ArticlesPage.tsx';
import ProtectedRoute from "./components/layout/ProtectedRoute.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import AppLayout from "./components/layout/AppLayout.tsx";

//

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* Protected Layout */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute element={<AppLayout />} /> // Protect the layout itself
                    }
                >
                    {/* Nested child routes */}
                    <Route path="home" element={<HomePage />} />
                    <Route path="habits" element={<HabitsPage />} />
                    <Route path="rewards" element={<RewardsPage />} />
                    <Route path="explore" element={<ArticlesPage />} />
                </Route>

                {/* Catch-All Redirect */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
