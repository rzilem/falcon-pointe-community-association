
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
}

interface DropdownNavProps {
  title: string;
  items: NavItem[];
  className?: string;
}

const DropdownNav: React.FC<DropdownNavProps> = ({ title, items, className }) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={cn(
        "text-gray-700 hover:text-primary transition-colors duration-200 font-medium navigation-trigger text-lg",
        className
      )}>
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[230px] gap-1.5 py-2 navigation-dropdown">
          {items.map((item) => (
            <li key={item.title} className="navigation-item">
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "block select-none space-y-1 rounded-md pl-0 pr-3 py-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}
                >
                  <div className="text-lg font-medium leading-none">{item.title}</div>
                  {item.description && (
                    <p className="line-clamp-2 text-xs leading-snug text-gray-600">
                      {item.description}
                    </p>
                  )}
                </a>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "block select-none space-y-1 rounded-md pl-0 pr-3 py-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}
                >
                  <div className="text-lg font-medium leading-none">{item.title}</div>
                  {item.description && (
                    <p className="line-clamp-2 text-xs leading-snug text-gray-600">
                      {item.description}
                    </p>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default DropdownNav;
