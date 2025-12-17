import React, { useState } from 'react';
import { ExcelImport } from '@/components/shared/ExcelImport';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Select,
  Alert,
} from '@/components/ui/ui';
import { Database, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { importMedications, importEmployees, importBranches } from '@/api/import.api';
import { toast } from 'sonner';

const DATA_TYPES = {
  medications: {
    label: 'Medications',
    schema: ['name', 'category', 'price', 'stock', 'expiryDate'],
    api: importMedications,
  },
  employees: {
    label: 'Employees',
    schema: ['firstName', 'lastName', 'email', 'role', 'phone'],
    api: importEmployees,
  },
  branches: {
    label: 'Branches',
    schema: ['name', 'address', 'phone', 'managerEmail'],
    api: importBranches,
  },
};

export function ImportData() {
  const [importedData, setImportedData] = useState([]);
  const [selectedType, setSelectedType] = useState('medications');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImport = (data) => {
    setValidationError('');
    setImportedData([]);

    if (!data || data.length === 0) return;

    const fileHeaders = Object.keys(data[0]);
    const requiredHeaders = DATA_TYPES[selectedType].schema;

    const missingHeaders = requiredHeaders.filter((header) => !fileHeaders.includes(header));

    if (missingHeaders.length > 0) {
      setValidationError(`Invalid file format. Missing columns: ${missingHeaders.join(', ')}`);
      return;
    }

    setImportedData(data);
    toast.success(`Successfully parsed ${data.length} rows.`);
  };

  const handleSubmit = async () => {
    if (importedData.length === 0) return;

    setIsSubmitting(true);
    try {
      const apiFunction = DATA_TYPES[selectedType].api;
      const result = await apiFunction(importedData);

      toast.success(result.message);
      setImportedData([]);
    } catch (error) {
      toast.error(error.message || 'Failed to import data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Import Data</h2>
        <p className='text-muted-foreground'>Import data from Excel files into the system.</p>
      </div>

      <div className='grid gap-6 grid-cols-1 md:grid-cols-3'>
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Database className='h-5 w-5' />
                Configuration
              </CardTitle>
              <CardDescription>Select the type of data you are importing.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Data Type</label>
                <Select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setImportedData([]);
                    setValidationError('');
                  }}
                >
                  {Object.entries(DATA_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </Select>
              </div>

              {validationError && (
                <Alert type='error' className='mt-4'>
                  <AlertTriangle className='h-4 w-4 mr-2' />
                  {validationError}
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Upload className='h-5 w-5' />
                Upload File
              </CardTitle>
              <CardDescription>Select an Excel file to import.</CardDescription>
            </CardHeader>
            <CardContent>
              <ExcelImport onImport={handleImport} />
            </CardContent>
          </Card>
        </div>

        <div className='md:col-span-1'>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>
                Required format for <strong>{DATA_TYPES[selectedType].label}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <p className='text-sm font-medium mb-2'>Expected Columns:</p>
                  <ul className='list-disc list-inside space-y-1 text-sm text-muted-foreground bg-muted p-3 rounded-md'>
                    {DATA_TYPES[selectedType].schema.map((col) => (
                      <li key={col} className='font-mono text-xs'>
                        {col}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='text-sm text-muted-foreground'>
                  <p>Ensure your Excel file has these exact column headers in the first row.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {importedData.length > 0 && (
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Preview Data ({importedData.length} rows)</CardTitle>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Importing...' : 'Submit to Database'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto max-h-[500px]'>
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(importedData[0]).map((key) => (
                      <TableHead key={key} className='whitespace-nowrap'>
                        {key}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importedData.slice(0, 10).map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i} className='whitespace-nowrap'>
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
