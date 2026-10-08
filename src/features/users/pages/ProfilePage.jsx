import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isChangeProfile, isChangeProfilePassword, isChangeProfilePhoto, isProfile } from '../states/userSlice';
import useInput from '../../../hooks/useInput';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.users);
  
  const [name, onNameChange, setName] = useInput('');
  const [email, onEmailChange, setEmail] = useInput('');
  const [oldPassword, onOldPasswordChange, setOldPassword] = useInput('');
  const [newPassword, onNewPasswordChange, setNewPassword] = useInput('');

  useEffect(() => {
    dispatch(isProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile, setName, setEmail]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(isChangeProfile({ name, email }));
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    dispatch(isChangeProfilePassword({ old_password: oldPassword, new_password: newPassword }));
    setOldPassword('');
    setNewPassword('');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(isChangeProfilePhoto(file));
    }
  };

  if (!profile) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Pengaturan Profil</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="flex flex-col items-center gap-4">
          <img 
            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}`} 
            alt="Profile Avatar" 
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-50"
          />
          <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            Ubah Foto
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>
        
        <form onSubmit={handleUpdateProfile} className="flex-1 w-full space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Informasi Dasar</h3>
          <div>
            <label htmlFor="prof-name" className="block text-sm font-medium text-gray-600">Nama Lengkap</label>
            <input id="prof-name" type="text" value={name} onChange={onNameChange} className="mt-1 block w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="prof-email" className="block text-sm font-medium text-gray-600">Email</label>
            <input id="prof-email" type="email" value={email} onChange={onEmailChange} className="mt-1 block w-full px-4 py-2 border rounded-lg" />
          </div>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            Simpan Perubahan
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Ganti kata sandi</h3>
        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="prof-oldpass" className="block text-sm font-medium text-gray-600">Password Lama</label>
            <input id="prof-oldpass" type="password" value={oldPassword} onChange={onOldPasswordChange} className="mt-1 block w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="prof-newpass" className="block text-sm font-medium text-gray-600">Password Baru</label>
            <input id="prof-newpass" type="password" value={newPassword} onChange={onNewPasswordChange} className="mt-1 block w-full px-4 py-2 border rounded-lg" />
          </div>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50">
            Perbarui Password
          </button>
        </form>
      </div>
    </div>
  );
}
