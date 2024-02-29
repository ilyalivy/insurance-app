import Sidebar from './Sidebar';
import Header from './Header';

const Dashboard = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            {/* Main Content */}
            <main className="w-4/5">
                <Header showExcelUploader={false} />
            </main>
        </div>
    );
};

export default Dashboard;
