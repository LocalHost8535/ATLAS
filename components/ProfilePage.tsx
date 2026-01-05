
import React, { useState } from 'react';
import { User, Calendar, Users } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfilePageProps {
  onNext: (data: Partial<UserProfile>) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-slate-50">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Tell us about you</h2>
        <p className="text-slate-500 mt-2">Just a few more details to get started</p>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-sm font-black text-slate-900 ml-2 mb-1 block uppercase tracking-tight">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
              <input
                type="text"
                required
                placeholder="Your name"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-emerald-500 font-bold"
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-sm font-black text-slate-900 ml-2 mb-1 block uppercase tracking-tight">Age</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
              <input
                type="number"
                required
                placeholder="Your age"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-emerald-500 font-bold"
                onChange={e => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-sm font-black text-slate-900 ml-2 mb-1 block uppercase tracking-tight">Gender</label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {['Male', 'Female', 'Other'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`py-3 rounded-2xl font-bold border transition-all ${
                    formData.gender === g
                      ? 'bg-slate-900 text-emerald-500 border-slate-900 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-[0.98] mt-4"
          >
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
