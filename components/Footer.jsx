import logo from "@/assets/images/logo.png";
import Image from "next/image";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-white via-primary-50 to-primary-100 text-gray-800 py-16 mt-20 relative overflow-hidden">
      {/* Diagonal SVG divider at the top for seamless blend */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg
          viewBox="0 0 1920 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-24"
        >
          <polygon points="0,0 1920,100 0,100" fill="#f8f7ff" />
        </svg>
      </div>
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
          {/* Brand section */}
          <div className="flex flex-col max-w-sm">
            <div className="mb-6">
              <Image
                src={logo}
                alt="Decatron Logo"
                className="h-auto w-24 mb-4 object-cover"
              />
              <p className="text-gray-600 mb-6 text-base leading-relaxed">
                Real estate transactions like online shopping. Find, inspect,
                and rent properties with just a few clicks.
              </p>
            </div>

            {/* Social media links */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-100 hover:bg-primary-200 rounded-full flex items-center justify-center text-primary-600 hover:text-primary-700 transition-all duration-300 hover:scale-110"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-100 hover:bg-primary-200 rounded-full flex items-center justify-center text-primary-600 hover:text-primary-700 transition-all duration-300 hover:scale-110"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="http://www.linkedin.com/company/mydecatron"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-100 hover:bg-primary-200 rounded-full flex items-center justify-center text-primary-600 hover:text-primary-700 transition-all duration-300 hover:scale-110"
              >
                <FaLinkedinIn size={16} />
              </a>
              <a
                href="https://www.instagram.com/decatron_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-100 hover:bg-primary-200 rounded-full flex items-center justify-center text-primary-600 hover:text-primary-700 transition-all duration-300 hover:scale-110"
              >
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Links sections */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <div>
              <h5 className="font-semibold mb-4 text-gray-900 text-lg">
                Company
              </h5>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/press"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-gray-900 text-lg">
                Discover
              </h5>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/properties"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    Properties
                  </a>
                </li>
                <li>
                  <a
                    href="/help"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-gray-900 text-lg">
                Agent
              </h5>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/host"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    Property Request
                  </a>
                </li>
                <li> 
                  <a
                    href="/resources"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    Resources
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-gray-900 text-lg">
                Community
              </h5>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/community"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="/events"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    Events
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              &copy; {currentYear} Decatron. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="/privacy"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
