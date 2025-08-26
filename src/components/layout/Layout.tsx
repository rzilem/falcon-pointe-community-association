
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import AccessibilityPanel from "../accessibility/AccessibilityPanel";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-grow">{children}</main>
      <Footer />
      <AccessibilityPanel />
    </div>
  );
};

export default Layout;
