import { motion } from "framer-motion";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Events", href: "" },
        { label: "Blog", href: "" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help Center", href: "" },
        { label: "Terms of Service", href: "" },
        { label: "Privacy Policy", href: "" },
        { label: "FAQ", href: "" },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      text: "+1 (555) 123-4567",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      text: "contact@eandp.com",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      text: "123 Event Street, NY 10001",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <motion.div
                  className="absolute inset-0 bg-purple-500/20 rounded-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
                <Calendar className="h-10 w-10 text-purple-400 relative z-10" />
              </div>
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                EANDP
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Creating unforgettable moments and bringing people together through exceptional event experiences.
            </p>
          </motion.div>

          {/* Quick Links and Resources */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center space-x-3 text-gray-400">
                  <span className="text-purple-400">{info.icon}</span>
                  <span className="text-sm">{info.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm text-gray-400"
            >
              © {new Date().getFullYear()} EANDP. All rights reserved.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex space-x-6"
            >
              {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href={`#${social.toLowerCase()}`}
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                >
                  {social}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;