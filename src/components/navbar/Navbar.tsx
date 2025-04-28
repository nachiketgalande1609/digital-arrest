import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <img src="/logo.png" alt="Telangana Cyber Cell Logo" className="navbar-logo-img" />
                    <h1 className="navbar-title">Telangana Cyber Cell</h1>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
