import { makeApiCall } from './auth.api';

export const importMedications = async (data) => {
  return await makeApiCall('/manager/import/medications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const importEmployees = async (data) => {
  return await makeApiCall('/manager/import/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const importBranches = async (data) => {
  return await makeApiCall('/manager/import/branches', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
