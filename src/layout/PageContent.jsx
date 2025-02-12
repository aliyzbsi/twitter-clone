import LeftSideBar from "@/pages/LeftSideBar";

const PageContent = ({ children }) => {
  return (
    <div className="flex bg-black min-h-screen justify-center ">
      <LeftSideBar />
      <main className="border-r border-l border-gray-800 w-full">
        {children}
      </main>
    </div>
  );
};

export default PageContent;
