export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor';
  avatar: string;
  profession: 'Apoteker' | 'Dokter' | 'Mahasiswa' | 'Perawat' | 'Bidan' | 'Lainnya';
  enrolledClasses: string[]; // List of class IDs (e.g. "gen6-reg-a")
  completedClasses: string[]; // List of class IDs
  isActive?: boolean;
}

export interface Generation {
  id: string;
  name: string; // "Generasi 1" to "Generasi 6"
  status: 'active' | 'completed' | 'upcoming';
  year: string;
}

export interface Class {
  id: string;
  generationId: string;
  generationName: string;
  name: string;
  category: 'REGULER' | 'ADVANCE';
  price: number;
  description: string;
  materialsCount: number;
  studentsCount: number;
  playlistUrl?: string;
}

export interface Material {
  id: string;
  classId: string;
  title: string;
  type: 'video' | 'pdf' | 'quiz';
  description: string;
  durationOrPages: string; // e.g. "45 Menit", "24 Halaman", "10 Pertanyaan"
  content: string; // Markdown or detailed text content
  videoUrl?: string; // Mock video embed path or identifier
  youtubeId?: string; // YouTube Video ID
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number; // Index 0-3
  explanation: string;
}

export interface Quiz {
  id: string;
  classId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number; // e.g. 70
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  classId: string;
  score: number;
  passed: boolean;
  submittedAt: string;
}

export interface ForumReply {
  id: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'mentor';
  userProfession: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  classId: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'mentor';
  userProfession: string;
  avatar: string;
  title: string;
  content: string;
  createdAt: string;
  replies: ForumReply[];
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  classId: string;
  className: string;
  generationName: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'payment' | 'material' | 'forum' | 'announcement';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface Schedule {
  id: string;
  classId: string;
  className: string;
  type: 'live' | 'deadline' | 'quiz';
  scheduledAt: string;
  zoomUrl?: string;
}

export interface DirectMessage {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  createdAt: string;
  read: boolean;
}
