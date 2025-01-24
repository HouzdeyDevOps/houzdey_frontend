// app/admin/layout.tsx
import { ReactNode } from "react";
// import AdminSidebar from "@/components/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      {/* <AdminSidebar /> */}
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
