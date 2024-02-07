import { useRef } from 'react';
import useExcelFile from '../hooks/useExcelFile';

const ExcelFileUploader = ({handleExcelFileInputChange}) => {
    const excelFileInputRef = useRef(null);

    return (
        <div>
            <input
                type="file"
                ref={excelFileInputRef}
                onChange={handleExcelFileInputChange}
                accept=".xlsx, .xls"
                hidden
            />
            <button onClick={() => excelFileInputRef.current.click()}>
                Upload Excel File
            </button>
        </div>
    );
};

export default ExcelFileUploader;