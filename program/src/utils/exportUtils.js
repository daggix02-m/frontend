import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {string} sheetName - Name of the worksheet
 */
export const exportToExcel = (data, filename, sheetName = 'Sheet1') => {

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, `${filename}.xlsx`);
};

/**
 * Generate mock sales report data
 * @param {string} period - 'daily', 'monthly', or 'yearly'
 * @returns {Array} Report data
 */
export const generateSalesReport = (period) => {
    const today = new Date();

    if (period === 'daily') {

        return Array.from({ length: 24 }, (_, i) => ({
            Hour: `${i}:00 - ${i + 1}:00`,
            Sales: Math.floor(Math.random() * 50) + 10,
            Revenue: (Math.random() * 5000 + 1000).toFixed(2),
            Transactions: Math.floor(Math.random() * 30) + 5,
        }));
    } else if (period === 'monthly') {

        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => ({
            Date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
            Sales: Math.floor(Math.random() * 200) + 50,
            Revenue: (Math.random() * 20000 + 5000).toFixed(2),
            Transactions: Math.floor(Math.random() * 100) + 20,
        }));
    } else if (period === 'yearly') {

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map((month, i) => ({
            Month: `${month} ${today.getFullYear()}`,
            Sales: Math.floor(Math.random() * 5000) + 1000,
            Revenue: (Math.random() * 500000 + 100000).toFixed(2),
            Transactions: Math.floor(Math.random() * 2000) + 500,
        }));
    }

    return [];
};

 
export const generateInventoryReport = () => {
    const products = [
        'Paracetamol 500mg',
        'Amoxicillin 250mg',
        'Ibuprofen 400mg',
        'Metformin 500mg',
        'Aspirin 100mg',
        'Omeprazole 20mg',
        'Ciprofloxacin 500mg',
        'Vitamin C 1000mg',
    ];

    return products.map(product => ({
        Product: product,
        'Current Stock': Math.floor(Math.random() * 500) + 50,
        'Minimum Stock': Math.floor(Math.random() * 50) + 10,
        'Unit Price': (Math.random() * 100 + 10).toFixed(2),
        'Total Value': (Math.random() * 50000 + 5000).toFixed(2),
        Status: Math.random() > 0.3 ? 'In Stock' : 'Low Stock',
    }));
};

 
export const generateStaffActivityReport = () => {
    const staff = [
        'Alemayehu Desta',
        'Selamawit Mekonnen',
        'Berhanu Wolde',
        'Tigist Alemu',
    ];

    return staff.map(name => ({
        Name: name,
        'Total Hours': (Math.random() * 40 + 160).toFixed(1),
        'Days Worked': Math.floor(Math.random() * 5) + 20,
        'Average Hours/Day': (Math.random() * 2 + 7).toFixed(1),
        'Last Active': new Date(Date.now() - Math.random() * 86400000).toLocaleDateString(),
    }));
};
