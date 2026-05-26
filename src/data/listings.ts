export interface Listing {
  id: string;
  clinicName: string;
  facilityType: 'clinic' | 'hospital' | 'diagnostic_center' | 'polyclinic';
  city: string;
  locality: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  whatsapp: string;
  rooms: {
    available: number;
    size: string;
    furniture: string[];
    equipment: string[];
  };
  pricing: {
    monthlyFee: number;
    slotFee?: number;
    deposit?: number;
  };
  availability: {
    days: string[];
    hours: string;
  };
  infrastructure: {
    parking: boolean;
    waitingArea: boolean;
    pharmacy: boolean;
    diagnostics: boolean;
    powerBackup: boolean;
  };
  specialties: string[];
  images: string[];
  verified: boolean;
  featured: boolean;
  createdAt: string;
}

export const sampleListings: Listing[] = [
  {
    id: '1',
    clinicName: 'LifeCare Multi-Specialty Clinic',
    facilityType: 'clinic',
    city: 'Hyderabad',
    locality: 'Kondapur',
    address: '3rd Floor, Cyber Towers, Kondapur, Hyderabad - 500084',
    contactPerson: 'Dr. Rajesh Kumar',
    phone: '+91 9876543210',
    email: 'admin@lifecareclinic.in',
    whatsapp: '+91 9876543210',
    rooms: {
      available: 3,
      size: '150 sq ft',
      furniture: ['Consultation desk', 'Patient chair', 'Examination bed', 'Storage cabinet'],
      equipment: ['BP Monitor', 'Stethoscope', 'Weighing scale', 'Pulse oximeter'],
    },
    pricing: { monthlyFee: 25000, slotFee: 500, deposit: 50000 },
    availability: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], hours: '9:00 AM - 9:00 PM' },
    infrastructure: { parking: true, waitingArea: true, pharmacy: true, diagnostics: true, powerBackup: true },
    specialties: ['Dermatology', 'Endocrinology', 'Psychiatry', 'General Medicine'],
    images: ['/images/clinic1.jpg', '/images/clinic1-room.jpg', '/images/clinic1-waiting.jpg'],
    verified: true,
    featured: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    clinicName: 'MedPoint Hospital',
    facilityType: 'hospital',
    city: 'Hyderabad',
    locality: 'Gachibowli',
    address: 'Plot 45, Financial District, Gachibowli, Hyderabad - 500032',
    contactPerson: 'Srinivas Reddy',
    phone: '+91 9123456789',
    email: 'ops@medpointhospital.com',
    whatsapp: '+91 9123456789',
    rooms: {
      available: 5,
      size: '200 sq ft',
      furniture: ['Executive desk', 'Patient chairs (2)', 'Examination couch', 'Bookshelf', 'Filing cabinet'],
      equipment: ['ECG Machine', 'BP Monitor', 'Nebulizer', 'Pulse oximeter', 'Otoscope'],
    },
    pricing: { monthlyFee: 40000, slotFee: 800, deposit: 100000 },
    availability: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], hours: '8:00 AM - 10:00 PM' },
    infrastructure: { parking: true, waitingArea: true, pharmacy: true, diagnostics: true, powerBackup: true },
    specialties: ['Orthopedics', 'Gastroenterology', 'Cardiology', 'Neurology', 'Pediatrics'],
    images: ['/images/clinic2.jpg', '/images/clinic2-room.jpg', '/images/clinic2-reception.jpg'],
    verified: true,
    featured: true,
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    clinicName: 'CareFirst Diagnostics',
    facilityType: 'diagnostic_center',
    city: 'Hyderabad',
    locality: 'Madhapur',
    address: '1st Floor, Aditya Trade Center, Madhapur, Hyderabad - 500081',
    contactPerson: 'Priya Sharma',
    phone: '+91 9988776655',
    email: 'info@carefirstdiag.com',
    whatsapp: '+91 9988776655',
    rooms: {
      available: 2,
      size: '120 sq ft',
      furniture: ['Consultation desk', 'Patient chair', 'Examination bed'],
      equipment: ['BP Monitor', 'Stethoscope', 'Thermometer'],
    },
    pricing: { monthlyFee: 15000, deposit: 30000 },
    availability: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], hours: '10:00 AM - 6:00 PM' },
    infrastructure: { parking: true, waitingArea: true, pharmacy: false, diagnostics: true, powerBackup: true },
    specialties: ['Dermatology', 'General Medicine', 'ENT'],
    images: ['/images/clinic3.jpg', '/images/clinic3-room.jpg'],
    verified: true,
    featured: false,
    createdAt: '2024-02-10',
  },
  {
    id: '4',
    clinicName: 'Wellness Hub Polyclinic',
    facilityType: 'polyclinic',
    city: 'Bangalore',
    locality: 'Koramangala',
    address: '5th Cross, Koramangala 4th Block, Bangalore - 560034',
    contactPerson: 'Dr. Anita Desai',
    phone: '+91 8765432109',
    email: 'contact@wellnesshub.in',
    whatsapp: '+91 8765432109',
    rooms: {
      available: 4,
      size: '180 sq ft',
      furniture: ['Modern desk', 'Ergonomic chairs (3)', 'Examination bed', 'Display cabinet'],
      equipment: ['BP Monitor', 'Dermatoscope', 'Autoclave', 'Minor procedure tray'],
    },
    pricing: { monthlyFee: 35000, slotFee: 700, deposit: 70000 },
    availability: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], hours: '9:00 AM - 8:00 PM' },
    infrastructure: { parking: true, waitingArea: true, pharmacy: true, diagnostics: false, powerBackup: true },
    specialties: ['Dermatology', 'Cosmetology', 'Psychiatry', 'Nutrition'],
    images: ['/images/clinic4.jpg', '/images/clinic4-room.jpg', '/images/clinic4-waiting.jpg'],
    verified: true,
    featured: true,
    createdAt: '2024-02-20',
  },
  {
    id: '5',
    clinicName: 'City Health Clinic',
    facilityType: 'clinic',
    city: 'Bangalore',
    locality: 'Indiranagar',
    address: '100 Feet Road, Indiranagar, Bangalore - 560038',
    contactPerson: 'Mohammed Irfan',
    phone: '+91 7654321098',
    email: 'admin@cityhealth.in',
    whatsapp: '+91 7654321098',
    rooms: {
      available: 2,
      size: '140 sq ft',
      furniture: ['Desk', 'Patient chairs (2)', 'Examination couch', 'Cabinet'],
      equipment: ['BP Monitor', 'ECG', 'Spirometer'],
    },
    pricing: { monthlyFee: 30000, slotFee: 600, deposit: 60000 },
    availability: { days: ['Monday', 'Wednesday', 'Friday', 'Saturday'], hours: '10:00 AM - 7:00 PM' },
    infrastructure: { parking: false, waitingArea: true, pharmacy: true, diagnostics: false, powerBackup: true },
    specialties: ['Pulmonology', 'General Medicine', 'Endocrinology'],
    images: ['/images/clinic5.jpg', '/images/clinic5-room.jpg'],
    verified: false,
    featured: false,
    createdAt: '2024-03-01',
  },
  {
    id: '6',
    clinicName: 'Apollo Reach Clinic',
    facilityType: 'hospital',
    city: 'Mumbai',
    locality: 'Andheri West',
    address: 'Link Road, Andheri West, Mumbai - 400053',
    contactPerson: 'Kavita Nair',
    phone: '+91 9011223344',
    email: 'reach@apolloclinics.com',
    whatsapp: '+91 9011223344',
    rooms: {
      available: 6,
      size: '220 sq ft',
      furniture: ['Executive desk', 'Leather chairs (3)', 'Examination bed', 'Bookshelf', 'Mini fridge'],
      equipment: ['Ultrasound', 'ECG', 'BP Monitor', 'Defibrillator access'],
    },
    pricing: { monthlyFee: 55000, slotFee: 1000, deposit: 150000 },
    availability: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], hours: '7:00 AM - 11:00 PM' },
    infrastructure: { parking: true, waitingArea: true, pharmacy: true, diagnostics: true, powerBackup: true },
    specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'Gastroenterology', 'Oncology'],
    images: ['/images/clinic6.jpg', '/images/clinic6-room.jpg', '/images/clinic6-reception.jpg'],
    verified: true,
    featured: true,
    createdAt: '2024-03-05',
  },
];

export const cities = ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Pune'];
export const specialties = ['Dermatology', 'Psychiatry', 'Endocrinology', 'Orthopedics', 'Gastroenterology', 'Cardiology', 'Neurology', 'Pediatrics', 'General Medicine', 'ENT', 'Pulmonology', 'Oncology', 'Cosmetology', 'Nutrition'];
export const facilityTypes = ['clinic', 'hospital', 'diagnostic_center', 'polyclinic'];
