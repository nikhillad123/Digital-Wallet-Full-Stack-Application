import Navbar from "../components/Navbar";

function PublicLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default PublicLayout;