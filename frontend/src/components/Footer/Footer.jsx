import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <ul className="footer-links">
                    <li>&copy; {new Date().getFullYear()} AbdulWaris, Inc.</li>
                    <li>
                    <a href="https://github.com/Waris-95"><i className="fa-brands fa-github"></i></a>
                    </li>
                    <li>
                    <a href="https://www.linkedin.com/in/abdul-waris-aa1234aw/"><i className="fa-brands fa-linkedin"></i></a>
                    </li>
                    <li>Terms</li>
                    <li>Sitemap</li>
                    <li>Privacy</li>
                    <li>Your Privacy Choices</li>
                    <li>Destinations</li>
                    <li>English (US)</li>
                    <li>$ USD</li>
                    <li>Support & resources</li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;