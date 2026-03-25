import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface MenuItem {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items: MenuItem[];
}

export default function FlowingMenu({ items }: FlowingMenuProps) {
  return (
    <div className="flex items-center space-x-8">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.link}
          className="relative group py-2"
        >
          <span className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium transition-colors">
            {item.text}
          </span>
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            initial={{ width: 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </Link>
      ))}
    </div>
  );
}
