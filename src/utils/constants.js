export const BRANCHES = [
  'CSE',
  'AIML',
  'AIDS',
  'CS',
  'IT',
  'ECE',
  'EE',
  'ME',
  'CE',
  'BT',
  'MAE',
  'Other'
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Latest First' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'title', label: 'Title (A-Z)' },
];

export const FILE_TYPES = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/msword': 'DOC',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
};

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 10MB