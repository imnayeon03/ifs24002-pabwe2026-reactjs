import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../states/userSlice';

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Direktori Pengguna</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users?.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center gap-4">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                alt={user.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-100" 
              />
              <div className="overflow-hidden">
                <h3 className="font-semibold text-lg text-gray-800 truncate">{user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
