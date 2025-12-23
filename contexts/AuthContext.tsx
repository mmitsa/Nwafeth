
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User;
  users: User[];
  switchUser: (userId: string) => void;
  updateProfile: (data: Partial<User>) => void;
  addUser: (name: string, email: string, role: UserRole) => void;
  editUser: (userId: string, data: Partial<User>) => void;
  deleteUser: (userId: string) => void;
}

const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed Al-Saud',
    email: 'ahmed.invest@example.com',
    role: 'investor',
    avatar: 'AS',
    preferences: { notifications: true, newsletter: true }
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah.agent@nawafiz.com',
    role: 'agent',
    avatar: 'SS',
    preferences: { notifications: true, newsletter: false },
    brokerDetails: {
      falNumber: '1100239481',
      crNumber: '1010445566',
      agencyName: 'Sarah Real Estate Agency',
      iban: 'SA55 8000 0000 1234 5678 9012',
      locations: ['Riyadh', 'Jeddah'],
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200'
    }
  },
  {
    id: '3',
    name: 'Nawafiz Admin',
    email: 'admin@nawafiz.sa',
    role: 'admin',
    avatar: 'NA',
    preferences: { notifications: false, newsletter: true }
  },
  {
    id: '4',
    name: 'Roshn Dev',
    email: 'sales@roshn.sa',
    role: 'developer',
    avatar: 'RD',
    preferences: { notifications: true, newsletter: true },
    developerDetails: {
      companyName: 'Roshn Real Estate',
      crNumber: '1010998877',
      taxNumber: '300556677',
      headquarters: 'Riyadh, Saudi Arabia',
      website: 'https://roshn.sa',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3dab?auto=format&fit=crop&w=200'
    }
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [currentUser, setCurrentUser] = useState<User>(defaultUsers[0]);

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    // Deep merge for brokerDetails if present
    let updatedUser = { ...currentUser, ...data };
    
    if (data.brokerDetails && currentUser.brokerDetails) {
        updatedUser.brokerDetails = { ...currentUser.brokerDetails, ...data.brokerDetails };
    }

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const addUser = (name: string, email: string, role: UserRole) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: initials,
      preferences: { notifications: true, newsletter: true }
    };

    setUsers(prev => [...prev, newUser]);
  };

  const editUser = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...data }));
    }
  };

  const deleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert("Cannot delete the currently active user.");
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, switchUser, updateProfile, addUser, editUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
