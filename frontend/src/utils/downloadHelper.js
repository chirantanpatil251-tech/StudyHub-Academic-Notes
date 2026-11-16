import api from '../services/api';

export const downloadResourceFile = (resource) => {
  if (!resource || !resource.fileUrl) return;

  // Track download in backend asynchronously
  if (resource._id) {
    api.post(`/resources/${resource._id}/download`).catch((err) => {
      console.warn('Could not register download counter:', err.message);
    });
  }

  // Directly initiate download/open without popup blocker issues
  const link = document.createElement('a');
  link.href = resource.fileUrl;
  link.setAttribute('download', resource.originalFileName || 'StudyHub_Resource.pdf');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
