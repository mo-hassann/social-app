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
        <LeftSidebar className="h-full shadow-md w-96 shrink-0 rounded-3xl p-3 mt-3 hidden lg:block" />
        <div className="w-full mx-auto h-full relative p-3 mt-3">{children}</div>
        <RightSidebar className="h-full shadow-md w-80 shrink-0 rounded-3xl p-3 mt-3 hidden xl:block" />
      </div>
    </div>
  );
}
