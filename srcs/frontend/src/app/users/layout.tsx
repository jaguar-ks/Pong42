import { UserContextProvider } from "@/context/UserContext";
import VerticalNavbar from "@/components/VerticalNavbar/VerticalNavbar"; // Ensure correct path to your component
import HorizontalNavbar from "@/components/HorizontalNavbar/HorizontalNavbar"; // Ensure correct path to your component
import "./layout.css"; // Optional: add layout-specific styles

export const metadata = {
  title: "User Dashboard",
  description: "User management and related features",
};

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="layout-container">
        <div className="verticalNavbarr">
          <VerticalNavbar />
        </div>
        <div className="main-content">
          <div className="horizontalNavbarr">
            <HorizontalNavbar />
          </div>
          <div className="page-content">
            {children} 
          </div>
        </div>
      </div>
  );
}
