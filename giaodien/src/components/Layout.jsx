import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* Renders the child components based on the current route */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
