import AvatarUploader from "./AvatarUploader";
import ExcelFileUploader from "./ExcelFileUploader";
import LogOut from "./LogOut";

const Header = ({handleExcelFileInputChange}) => {
    return (
        <div className="bg-white p-6 shadow-md flex justify-between items-center h-24">
            <div>
                <h1 className="inline text-3xl font-bold text-gray-900 mr-6">
                    Ins App
                </h1>
            </div>
            <AvatarUploader />
            <ExcelFileUploader
                handleExcelFileInputChange={handleExcelFileInputChange}
            />
            <LogOut />
        </div>
    );
};

export default Header;
