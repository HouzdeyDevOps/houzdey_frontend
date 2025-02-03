import Navbar from "@/components/navbar/Navbar";
import SupportSidebar from "@/components/support/support-sidebar";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar showSearch={false} showPropertyTypeFilters={false} />
      <div className="max-w-7xl mx-auto px-4 py-8 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <SupportSidebar />
          </div>
          <div className="md:col-span-3">{children}</div>
        </div>
      </div>
    </>
  );
}
