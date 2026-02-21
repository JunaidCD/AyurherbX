// Settings Components
import React, { useState } from 'react';
import { User, Lock, Bell, Shield, Key } from 'lucide-react';

export const ProfileSettings = ({ user, onUpdate }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <User className="w-5 h-5 mr-2 text-gray-500" />
        <h3 className="text-lg font-semibold">Profile Settings</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
        
        <button onClick={() => onUpdate({ name, email, phone })} className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export const SecuritySettings = ({ onPasswordChange }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onPasswordChange(currentPassword, newPassword);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Lock className="w-5 h-5 mr-2 text-gray-500" />
        <h3 className="text-lg font-semibold">Security Settings</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input 
            type="password" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Update Password
        </button>
      </form>
    </div>
  );
};

export const NotificationSettings = ({ settings, onUpdate }) => {
  const [emailNotifs, setEmailNotifs] = useState(settings?.email ?? true);
  const [pushNotifs, setPushNotifs] = useState(settings?.push ?? true);
  const [weeklyReport, setWeeklyReport] = useState(settings?.weekly ?? false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Bell className="w-5 h-5 mr-2 text-gray-500" />
        <h3 className="text-lg font-semibold">Notification Settings</h3>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-center">
          <input 
            type="checkbox" 
            checked={emailNotifs}
            onChange={(e) => setEmailNotifs(e.target.checked)}
            className="mr-2"
          />
          <span>Email Notifications</span>
        </label>
        
        <label className="flex items-center">
          <input 
            type="checkbox" 
            checked={pushNotifs}
            onChange={(e) => setPushNotifs(e.target.checked)}
            className="mr-2"
          />
          <span>Push Notifications</span>
        </label>
        
        <label className="flex items-center">
          <input 
            type="checkbox" 
            checked={weeklyReport}
            onChange={(e) => setWeeklyReport(e.target.checked)}
            className="mr-2"
          />
          <span>Weekly Report</span>
        </label>
        
        <button 
          onClick={() => onUpdate({ email: emailNotifs, push: pushNotifs, weekly: weeklyReport })}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default { ProfileSettings, SecuritySettings, NotificationSettings };
