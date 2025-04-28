import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <img src="/logo.png" alt="Telangana Cyber Cell Logo" className="navbar-logo-img" />
                    <div>
                        <h1 className="navbar-title">Telangana</h1>
                        <h1 className="navbar-title">Cyber Security Bureau</h1>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
