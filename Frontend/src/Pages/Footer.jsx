import "../Pages/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        
        <div className="footer-section">
          <h2 className="footer-logo">BookNow</h2>
          <p className="footer-desc">
            Book hotels, rooms and experiences easily with BookNow.
            Fast, secure and reliable booking platform.
          </p>
        </div>

      
        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </div>

    
        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li>Help Center</li>
            <li>Cancellation Policy</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

    
        <div className="footer-section">
          <h3>Follow Us</h3>
          <ul>
            <li>Instagram</li>
            <li>Twitter</li>
            <li>LinkedIn</li>
            <li>Facebook</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} BookNow. All rights reserved.
      </div>
    </footer>
  );
}