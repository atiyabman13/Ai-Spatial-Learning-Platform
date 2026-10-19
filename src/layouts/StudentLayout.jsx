import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function StudentLayout({ children, activeTab, setActiveTab }) {
    return (
        <div className="layout-container">
            <Navbar />
            <div className="layout-body">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="student" />
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default StudentLayout;