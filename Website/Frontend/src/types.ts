export interface User {
  email: string;
  role: 'cloud' | 'local';
  ipAddress: string;
  token: string;
}


export interface File {
  id: string;
  name: string;
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  lastModified: string;
  size: string;
  location: 'cloud' | 'local' | 'both';
  hasCopy?: boolean;
  integrityStatus?: 'verified' | 'unverified' | 'mismatch';
}