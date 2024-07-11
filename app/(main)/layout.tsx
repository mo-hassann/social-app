import Header from "@/components/layout/header";
import LeftSidebar from "@/components/layout/sidebar/left-sidebar";
import RightSidebar from "@/components/layout/sidebar/right-sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-hidden">
      <div className="container">
        <Header />
      </div>
      <div className="container h-full flex">
        <RightSidebar className="h-full shadow-md w-96 rounded-3xl p-3 mt-3 bg-muted" />
        <div className="w-[700px] mx-auto overflow-auto">{children}</div>
        <LeftSidebar className="h-full shadow-md w-96 rounded-3xl p-3 mt-3 bg-muted" />
      </div>
    </div>
  );
}
