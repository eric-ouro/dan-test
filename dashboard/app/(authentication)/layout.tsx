const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-7xl h-2/3-screen flex flex-col gap-6 items-start">{children}</div>
  );
};

export default Layout;
