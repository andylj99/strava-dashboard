type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <header>
        <h1>Strava Dashboard</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2025 Strava Dashboard</p>
      </footer>
    </div>
  );
};

export default Layout;
