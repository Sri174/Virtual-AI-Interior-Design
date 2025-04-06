import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">AI Interior Design</h1>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/generate" className="text-gray-700 hover:text-blue-600">Generate</Link>
        <Link to="/history" className="text-gray-700 hover:text-blue-600">My Designs</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
        <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
