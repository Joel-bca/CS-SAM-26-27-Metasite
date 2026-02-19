import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 py-8">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
