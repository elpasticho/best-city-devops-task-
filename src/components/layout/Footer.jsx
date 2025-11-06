import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import { FaDiscord } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-white dark:bg-secondary-900">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-heading">BestCity</h3>
            <p className="text-body text-sm">
              Your trusted partner in finding the perfect property. We make real estate simple and accessible for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-heading">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/properties" className="text-link text-sm">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-link text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-link text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-link text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-heading">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-body text-sm">
                <FiPhone className="mr-2" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center text-body text-sm">
                <FiMail className="mr-2" />
                <span>contact@bestcity.com</span>
              </li>
              <li className="flex items-center text-body text-sm">
                <FiMapPin className="mr-2" />
                <span>123 Property Street, Real City, RC 12345</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-heading">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link to="#" className="text-link">
                <FiTwitter size={20} />
              </Link>
              <Link to="#" className="text-link">
                <FiLinkedin size={20} />
              </Link>
              <Link to="#" className="text-link">
                <FiGithub size={20} />
              </Link>
              <Link to="#" className="text-link">
                <FaDiscord size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-light mt-8 pt-8 text-center text-body text-sm">
          <p>&copy; {new Date().getFullYear()} BestCity. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;