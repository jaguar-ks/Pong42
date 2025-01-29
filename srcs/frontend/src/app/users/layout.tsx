import { UserContextProvider } from "@/context/UserContext";
import { WebSocketProvider } from '@/context/WebSocketContext';
import { GameSocketProvider } from "@/context/GameSocketContext";
import VerticalNavbar from "@/components/VerticalNavbar/VerticalNavbar";
import HorizontalNavbar from "@/components/HorizontalNavbar/HorizontalNavbar";
import "./layout.css";

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
    <UserContextProvider>
      <WebSocketProvider>
        <GameSocketProvider>

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
      </GameSocketProvider>
      </WebSocketProvider>
    </UserContextProvider>
  );
}
