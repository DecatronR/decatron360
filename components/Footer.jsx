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
    <footer className="bg-slate-900 text-white py-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between px-4">
        <div className="flex flex-col mb-6 md:mb-0">
          <Image
            src={logo}
            alt="Logo"
            className="h-auto w-20 mb-4 object-cover"
          />
          <p className="text-gray-400 mb-4 text-sm">
            Real estate transactions like online shopping
          </p>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaTwitter />
            </a>
            <a
              href="http://www.linkedin.com/company/mydecatron"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://www.instagram.com/decatron_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <h5 className="font-bold mb-2 text-sm">Company</h5>
            <ul className="text-sm">
              <li>
                <a href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/careers" className="text-gray-400 hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="/press" className="text-gray-400 hover:text-white">
                  Press
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2 text-sm">Discover</h5>
            <ul className="text-sm">
              <li>
                <a
                  href="/properties"
                  className="text-gray-400 hover:text-white"
                >
                  Properties
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-400 hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-400 hover:text-white">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2 text-sm">Agent</h5>
            <ul className="text-sm">
              <li>
                <a href="/host" className="text-gray-400 hover:text-white">
                  Become an Agent
                </a>
              </li>
              <li>
                <a href="/resources" className="text-gray-400 hover:text-white">
                  Resources
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2 text-sm">Community</h5>
            <ul className="text-sm">
              <li>
                <a href="/community" className="text-gray-400 hover:text-white">
                  Community
                </a>
              </li>
              <li>
                <a href="/events" className="text-gray-400 hover:text-white">
                  Events
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center border-t border-gray-800 pt-6">
        <p className="text-sm text-gray-500">
          &copy; {currentYear} Decatron. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
