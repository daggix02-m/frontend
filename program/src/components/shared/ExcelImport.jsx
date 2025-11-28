import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ExcelImport({ onImport }) {
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError('');
        setSuccess('');

        if (file) {
            if (
                file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
                file.type !== 'application/vnd.ms-excel'
            ) {
                setError('Please upload a valid Excel file (.xlsx or .xls)');
                setFileName('');
                return;
            }
            setFileName(file.name);
            parseExcel(file);
        }
    };

    const parseExcel = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(sheet);

                if (parsedData.length === 0) {
                    setError('The Excel file appears to be empty.');
                    return;
                }

                setSuccess(`Successfully parsed ${parsedData.length} rows.`);
                if (onImport) {
                    onImport(parsedData);
                }
            } catch (err) {
                setError('Failed to parse Excel file. Please ensure it is formatted correctly.');
                console.error(err);
            }
        };
        reader.readAsBinaryString(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className='w-full'>
            <input
                type='file'
                accept='.xlsx, .xls'
                onChange={handleFileChange}
                className='hidden'
                ref={fileInputRef}
            />

            <div className='flex flex-col gap-4'>
                <div
                    className='border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'
                    onClick={triggerFileInput}
                >
                    <div className='bg-primary/10 p-4 rounded-full mb-4'>
                        <FileSpreadsheet className='h-8 w-8 text-primary' />
                    </div>
                    <p className='text-sm font-medium text-gray-900 dark:text-gray-100 mb-1'>
                        {fileName || 'Click to upload or drag and drop'}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Excel files only (XLSX, XLS)
                    </p>
                </div>

                {error && (
                    <div className='flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md'>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className='flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md'>
                        <CheckCircle size={16} />
                        {success}
                    </div>
                )}
            </div>
        </div>
    );
}
