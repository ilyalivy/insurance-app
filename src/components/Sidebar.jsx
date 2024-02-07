const Sidebar = () => {
    return (
        <div className="w-1/5 bg-black text-white shadow-md">
            <div className="pl-10 pt-20 flex flex-col justify-between h-full">
                <nav>
                    <ul>
                        <li className="p-3 hover:bg-gray-500">
                            <a href="/dashboard">Dashboard</a>
                        </li>
                        <li className="p-3 hover:bg-gray-500">
                            <a href="/dashboard">Customers</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
