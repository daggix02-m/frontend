// Mock API service for data imports

export const importMedications = async (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate validation or processing error randomly
            if (Math.random() > 0.9) {
                reject(new Error('Failed to process medication data. Duplicate entries found.'));
            } else {
                console.log('Importing Medications:', data);
                resolve({ success: true, message: `Successfully imported ${data.length} medications.` });
            }
        }, 1500);
    });
};

export const importEmployees = async (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Importing Employees:', data);
            resolve({ success: true, message: `Successfully imported ${data.length} employees.` });
        }, 1500);
    });
};

export const importBranches = async (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Importing Branches:', data);
            resolve({ success: true, message: `Successfully imported ${data.length} branches.` });
        }, 1500);
    });
};
