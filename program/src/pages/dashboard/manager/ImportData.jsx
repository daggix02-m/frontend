import React, { useState } from 'react';
import { ExcelImport } from '@/components/shared/ExcelImport';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/ui';
import { Database } from 'lucide-react';

export function ImportData() {
    const [importedData, setImportedData] = useState([]);

    const handleImport = (data) => {
        setImportedData(data);
        // Here you would typically send this data to your backend API
    };

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h2 className='text-3xl font-bold tracking-tight'>Import Data</h2>
                <p className='text-muted-foreground'>Import data from Excel files into the system.</p>
            </div>

            <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Upload File
                        </CardTitle>
                        <CardDescription>
                            Select an Excel file to import. The file should have headers in the first row.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ExcelImport onImport={handleImport} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Instructions</CardTitle>
                        <CardDescription>
                            Please ensure your Excel file follows the correct format.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className='list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                            <li>File must be in .xlsx or .xls format.</li>
                            <li>The first row must contain column headers.</li>
                            <li>Ensure there are no empty rows between data.</li>
                            <li>Dates should be formatted as text or standard date format.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {importedData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Preview Data ({importedData.length} rows)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='overflow-x-auto max-h-[500px]'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {Object.keys(importedData[0]).map((key) => (
                                            <TableHead key={key} className="whitespace-nowrap">{key}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {importedData.slice(0, 10).map((row, index) => (
                                        <TableRow key={index}>
                                            {Object.values(row).map((value, i) => (
                                                <TableCell key={i} className="whitespace-nowrap">
                                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {importedData.length > 10 && (
                            <p className='text-xs text-muted-foreground mt-4 text-center'>
                                Showing first 10 rows only.
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
