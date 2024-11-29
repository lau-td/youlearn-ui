import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { PlusIcon, HomeIcon, HistoryIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SidebarItem } from "./sidebar-item";
import { useState, useEffect } from "react";
import { getDocuments } from "@/api/rest";
import { Document } from "@/api/interfaces";
import { logout } from "@/utils/auth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    getDocuments().then((documents) => {
      setDocuments(documents);
    });
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <Sidebar className="w-[250px] border-r">
          <SidebarHeader className="px-4 py-2">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <HomeIcon className="h-6 w-6" />
              <span className="font-semibold">Homepage</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <div className="flex flex-col h-full">
              <div className="flex flex-col gap-2 p-4">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate("/")}
                >
                  <PlusIcon className="h-4 w-4" />
                  Add content
                </Button>

                <div className="flex items-center gap-2 cursor-pointer bg-white hover:bg-gray-100 text-black p-2 rounded-md border border-[#3c3c3c]">
                  <HistoryIcon className="h-4 w-4" />
                  History
                </div>

                {/* Document list */}
                {documents.map((document) => (
                  <SidebarItem
                    key={document.id}
                    title={document.name}
                    isChild
                    onClick={() => navigate(`/documents/${document.id}`)}
                  />
                ))}

                <div className="h-px bg-border my-2" />
              </div>

              {/* Logout button at the bottom */}
              <div className="mt-auto p-4">
                <Button
                  variant="ghost"
                  className="w-full bg-gray-50 border border-red-500 justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="p-6 h-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
