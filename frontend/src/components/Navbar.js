import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-[#2C1F33] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold text-[#CC5500] hover:opacity-90 transition">
        AI Interior Designer
      </Link>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/generate" className="hover:text-[#CC5500]">Generate</Link>
            <Link to="/history" className="hover:text-[#CC5500]">History</Link>
            <button
              onClick={handleLogout}
              className="bg-[#CC5500] px-4 py-2 rounded hover:bg-opacity-80 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-[#CC5500]">Login</Link>
            <Link to="/register" className="hover:text-[#CC5500]">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
