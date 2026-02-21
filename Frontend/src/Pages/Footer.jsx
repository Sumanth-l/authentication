import "../Pages/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>YourBrand</h2>
          <p>Building modern web experiences with clean UI.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Careers</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h4>Resources</h4>
            <ul>
              <li>Docs</li>
              <li>Help Center</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4>Social</h4>
            <ul>
              <li>Twitter</li>
              <li>GitHub</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} YourBrand. All rights reserved.
      </div>
    </footer>
  );
}