import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function TeacherLayout({ children, activeTab, setActiveTab }) {
    return (
        <div className="layout-container">
            <Navbar />
            <div className="layout-body">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="teacher" />
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default TeacherLayout;