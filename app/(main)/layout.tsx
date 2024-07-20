import Header from "@/components/layout/header";
import LeftSidebar from "@/components/layout/sidebar/left-sidebar";
import RightSidebar from "@/components/layout/sidebar/right-sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-hidden">
      <div className="container">
        <Header />
      </div>
      <div className="container h-full flex overflow-hidden pb-20">
        <LeftSidebar className="h-full w-96 shrink-0 p-3 mt-3 hidden lg:block" />
        <div className="w-full mx-auto h-full relative p-3 mt-3 mb-16">{children}</div>
        <RightSidebar className="h-full w-80 shrink-0 p-3 mt-3 hidden xl:block" />
      </div>
    </div>
  );
}
