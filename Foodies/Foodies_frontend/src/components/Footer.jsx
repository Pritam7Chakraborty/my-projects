import { UtensilsCrossed, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8 text-zinc-400">
      <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* 1. Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="text-purple-500" size={24} />
            <span className="text-xl font-bold text-white">Foodie</span>
          </div>
          <p className="text-sm leading-relaxed">
            Delivering happiness to your doorstep. The best local restaurants, curated just for you.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-purple-500 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-purple-500 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-purple-500 transition-colors"><Instagram size={20} /></a>
          </div>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-purple-500 transition-colors">Home</Link></li>
            <li><Link to="/orders" className="hover:text-purple-500 transition-colors">My Orders</Link></li>
            <li><Link to="/cart" className="hover:text-purple-500 transition-colors">Cart</Link></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Become a Partner</a></li>
          </ul>
        </div>

        {/* 3. Legal */}
        <div>
          <h3 className="text-white font-bold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-purple-500 transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Cookie Policy</a></li>
          </ul>
        </div>

        {/* 4. Contact Us */}
        <div>
          <h3 className="text-white font-bold mb-4">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-purple-500 shrink-0" />
              <span>123 Foodie Lane, Tech City,<br />Kolkata, WB 700001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-purple-500 shrink-0" />
              <span>+91 93308 399124</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-purple-500 shrink-0" />
              <span>cpritam870@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; 2026 Foodie Technologies. All rights reserved.</p>
        <p>Made with ❤️ by Pritam</p>
      </div>
    </footer>
  );
};

export default Footer;