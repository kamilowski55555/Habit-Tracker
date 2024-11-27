import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { logout } = useAuth();

    return (
        <nav>
            <a href="/dashboard">Dashboard</a>
            <button onClick={logout}>Logout</button>
        </nav>
    );
};

export default Navbar;
