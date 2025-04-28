import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo-container">
                    <h1 className="navbar-logo">Telangana Cyber Cell</h1>
                    <div className="cyber-glitch"></div>
                </div>
                <div className="cyber-line"></div>
            </div>
        </nav>
    );
};

export default Navbar;
