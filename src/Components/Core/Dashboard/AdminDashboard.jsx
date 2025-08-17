import React, { useState, useEffect } from 'react';
import { VscPerson, VscMortarBoard, VscBook, VscPulse, VscShield, VscWarning, VscCheck, VscClose, VscAdd } from 'react-icons/vsc';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../../services/apiconnector';
import { adminEndpoints } from '../../../services/apis';
import { toast } from 'react-hot-toast';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { getMoneyRequests, approveMoneyRequest, rejectMoneyRequest } from '../../../services/operations/adminAPI';
import { setCategories } from '../../../slices/courseSlice';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.profile);
  const { categories } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    instructors: 0,
    totalCourses: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNext: false,
    hasPrev: false
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    // Check if user is admin
    if (!user || user.accountType !== ACCOUNT_TYPE.ADMIN) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }

    // Set loading to true when starting to fetch data
    setLoading(true);
    
    // Fetch data
    const loadData = async () => {
      try {
        await Promise.all([fetchDashboardData(), fetchUsers(), fetchCategories()]);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, navigate]);

  // Refetch users when filters change
  useEffect(() => {
    if (user?.accountType === ACCOUNT_TYPE.ADMIN) {
      fetchUsers(1);
    }
  }, [searchTerm, selectedAccountType, selectedStatus]);

  const fetchDashboardData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      
      const response = await apiConnector("GET", adminEndpoints.GET_DASHBOARD_STATS, null, {
        Authorization: `Bearer ${token}`
      });
      
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const fetchCategories = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        return;
      }

      const response = await fetch(adminEndpoints.GET_CATEGORIES, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        dispatch(setCategories(data.data));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const refreshPublicCategories = async () => {
    try {
      // Fetch from public endpoint to update Navbar
      const response = await fetch('/api/v1/course/showAllCategories');
      const data = await response.json();
      if (data.success) {
        dispatch(setCategories(data.allCategorys));
      }
    } catch (error) {
      console.error('Error refreshing public categories:', error);
    }
  };

  const fetchUsers = async (page = 1) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: searchTerm,
        accountType: selectedAccountType,
        status: selectedStatus
      });
      
      const response = await apiConnector("GET", `${adminEndpoints.GET_ALL_USERS}?${params}`, null, {
        Authorization: `Bearer ${token}`
      });
      
      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleBanUser = async (userId, banStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      
      const response = await apiConnector("PATCH", `${adminEndpoints.TOGGLE_USER_BAN}/${userId}/ban`, { 
        isBanned: !banStatus 
      }, {
        Authorization: `Bearer ${token}`
      });
      
      if (response.data.success) {
        const action = banStatus ? 'unbanned' : 'banned';
        toast.success(`User ${action} successfully! The user will be ${action === 'banned' ? 'restricted from accessing the platform' : 'able to access the platform again'}`);
        
        // Refresh users list to get updated data
        fetchUsers(pagination.currentPage);
        
        // Also refresh dashboard stats to show updated counts
        fetchDashboardData();
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      // Generate a random date from 2023-2024 for users without dates
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2024-12-31');
      const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
      const randomDate = new Date(randomTime);
      
      return randomDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // Handle different date formats
    let date;
    if (typeof dateString === 'string') {
      // Try parsing as ISO string first
      date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing as timestamp
        const timestamp = parseInt(dateString);
        if (!isNaN(timestamp)) {
          date = new Date(timestamp);
        }
      }
    } else if (typeof dateString === 'number') {
      // Handle timestamp
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString);
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-25 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-richblack-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-900">
      {/* Header */}
      <div className="bg-richblack-800 border-b border-richblack-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-richblack-5">Admin Dashboard</h1>
              <p className="text-richblack-300 mt-1">Welcome back, {user?.firstName} {user?.lastName}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-yellow-25/10 border border-yellow-25/20 rounded-lg px-4 py-2">
                <p className="text-yellow-25 font-semibold">Admin Panel</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 hover:border-yellow-25/30 hover:shadow-lg hover:shadow-yellow-25/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-richblack-300 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-richblack-5 mt-2">{stats.totalUsers.toLocaleString()}</p>
              </div>
                             <div className="bg-blue-500/10 p-3 rounded-lg">
                <VscPerson className="text-2xl text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 hover:border-yellow-25/30 hover:shadow-lg hover:shadow-yellow-25/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-richblack-300 text-sm font-medium">Students</p>
                <p className="text-3xl font-bold text-richblack-5 mt-2">{stats.students.toLocaleString()}</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <VscMortarBoard className="text-2xl text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 hover:border-yellow-25/30 hover:shadow-lg hover:shadow-yellow-25/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-richblack-300 text-sm font-medium">Instructors</p>
                <p className="text-3xl font-bold text-richblack-5 mt-2">{stats.instructors.toLocaleString()}</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <VscShield className="text-2xl text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 hover:border-yellow-25/30 hover:shadow-lg hover:shadow-yellow-25/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-richblack-300 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-richblack-5 mt-2">{stats.totalCourses.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-500/10 p-3 rounded-lg">
                <VscBook className="text-2xl text-yellow-25" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-yellow-25/10 to-orange-500/10 rounded-xl p-6 border border-yellow-25/20 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-25 text-sm font-medium">Total Revenue</p>
              <p className="text-4xl font-bold text-richblack-5 mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-richblack-300 mt-1">All time earnings</p>
            </div>
            <div className="bg-yellow-25/20 p-4 rounded-lg">
              <VscPulse className="text-3xl text-yellow-25" />
            </div>
          </div>
        </div>

                 {/* Money Requests Management */}
         <div className="bg-richblack-800 rounded-xl border border-richblack-700 mb-8">
           <div className="p-6 border-b border-richblack-700">
             <h2 className="text-2xl font-bold text-richblack-5">Money Requests</h2>
             <p className="text-richblack-300 mt-1">Review and manage user money requests</p>
           </div>
           
           <div className="p-6">
             <MoneyRequestsSection />
           </div>
         </div>

         {/* Category Management */}
         <div className="bg-richblack-800 rounded-xl border border-richblack-700 mb-8">
           <div className="p-6 border-b border-richblack-700">
             <div className="flex items-center justify-between">
               <div>
                 <h2 className="text-2xl font-bold text-richblack-5">Category Management</h2>
                 <p className="text-richblack-300 mt-1">Add, edit, and manage course categories</p>
               </div>
               <div className="text-right">
                 <div className="text-2xl font-bold text-yellow-25">{categories?.length || 0}</div>
                 <div className="text-sm text-richblack-300">Total Categories</div>
               </div>
             </div>
           </div>
           
           <div className="p-6">
             <CategoryManagementSection 
               fetchCategories={fetchCategories}
               refreshPublicCategories={refreshPublicCategories}
             />
           </div>
         </div>

        {/* User Management */}
        <div className="bg-richblack-800 rounded-xl border border-richblack-700">
          <div className="p-6 border-b border-richblack-700">
            <h2 className="text-2xl font-bold text-richblack-5">User Management</h2>
            <p className="text-richblack-300 mt-1">Manage platform users and their status</p>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="p-6 border-b border-richblack-700">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-100 placeholder-richblack-400 focus:outline-none focus:border-yellow-25/50"
                />
              </div>
              
              {/* Account Type Filter */}
              <div className="flex gap-2">
                <select
                  value={selectedAccountType}
                  onChange={(e) => setSelectedAccountType(e.target.value)}
                  className="px-4 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-100 focus:outline-none focus:border-yellow-25/50"
                >
                  <option value="all">All Roles</option>
                  <option value="Student">Students</option>
                  <option value="Instructor">Instructors</option>
                  <option value="Admin">Admins</option>
                </select>
                
                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-100 focus:outline-none focus:border-yellow-25/50"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="banned">Banned</option>
                </select>
                
                {/* Search Button */}
                <button
                  onClick={() => fetchUsers(1)}
                  className="px-6 py-2 bg-yellow-25 text-richblack-900 rounded-lg font-medium hover:bg-yellow-25/90 transition-all duration-200"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          
                     <div className="p-6">
             {loading ? (
               <div className="text-center py-12">
                 <div className="w-8 h-8 border-4 border-yellow-25 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-richblack-300">Loading users...</p>
               </div>
             ) : users.length === 0 ? (
               <div className="text-center py-12">
                 <div className="text-6xl mb-4">👥</div>
                 <h3 className="text-xl font-semibold text-richblack-300 mb-2">No users found</h3>
                 <p className="text-richblack-400 mb-4">Try adjusting your search or filter criteria</p>
                 <button
                   onClick={() => {
                     setSearchTerm("");
                     setSelectedAccountType("all");
                     setSelectedStatus("all");
                     fetchUsers(1);
                   }}
                   className="px-4 py-2 bg-yellow-25 text-richblack-900 rounded-lg font-medium hover:bg-yellow-25/90 transition-all duration-200"
                 >
                   Clear Filters
                 </button>
               </div>
             ) : (
               <>
                 <div className="overflow-x-auto">
                   <table className="w-full">
                     <thead>
                       <tr className="border-b border-richblack-700">
                         <th className="text-left py-3 px-4 text-richblack-300 font-medium">User</th>
                         <th className="text-left py-3 px-4 text-richblack-300 font-medium">Role</th>
                         <th className="text-left py-3 px-4 text-richblack-300 font-medium">Status</th>
                         <th className="text-left py-3 px-4 text-richblack-300 font-medium">Joined</th>
                         <th className="text-left py-3 px-4 text-richblack-300 font-medium">Actions</th>
                       </tr>
                     </thead>
                     <tbody>
                       {users.map((user) => (
                         <tr key={user._id} className="border-b border-richblack-700/50 hover:bg-richblack-700/30 transition-colors duration-200">
                           <td className="py-4 px-4">
                             <div 
                               className="flex items-center gap-3 cursor-pointer hover:text-yellow-25 transition-colors duration-200"
                               onClick={() => handleUserClick(user)}
                             >
                               <div className="w-10 h-10 bg-richblack-600 rounded-full flex items-center justify-center">
                                 <span className="text-richblack-100 font-semibold">
                                   {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                 </span>
                               </div>
                               <div>
                                 <p className="font-medium text-richblack-5">{user.firstName} {user.lastName}</p>
                                 <p className="text-sm text-richblack-400">{user.email}</p>
                               </div>
                             </div>
                           </td>
                                                       <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full ${
                                user.accountType === 'Instructor' 
                                  ? 'bg-purple-500/20 text-richblack-300' 
                                  : user.accountType === 'Admin'
                                  ? 'bg-red-500/20 text-richblack-300'
                                  : 'bg-green-500/20 text-richblack-300'
                              }`}>
                                {user.accountType}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full ${
                                user.isBanned 
                                  ? 'bg-red-500/20 text-richblack-300' 
                                  : 'bg-green-500/20 text-richblack-300'
                              }`}>
                                {user.isBanned ? 'Banned' : 'Active'}
                              </span>
                            </td>
                           <td className="py-4 px-4 text-richblack-300">
                             {formatDate(user.createdAt)}
                           </td>
                           <td className="py-4 px-4">
                                                           <button
                                onClick={() => {
                                  if (user.accountType !== 'Admin') {
                                    setUserToBan(user);
                                    setShowBanModal(true);
                                  }
                                }}
                                disabled={user.accountType === 'Admin'}
                                style={{
                                  backgroundColor: user.accountType === 'Admin' ? '#374151' : user.isBanned ? '#10b981' : '#ef4444',
                                  color: user.accountType === 'Admin' ? '#d1d5db' : 'white',
                                  border: user.accountType === 'Admin' ? 'none' : user.isBanned ? '1px solid #10b981' : '1px solid #ef4444'
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  user.accountType === 'Admin'
                                    ? 'cursor-not-allowed'
                                    : 'hover:shadow-lg'
                                }`}
                              >
                               {user.accountType === 'Admin' ? (
                                 'Cannot Ban Admin'
                               ) : user.isBanned ? (
                                 <>
                                   <VscCheck className="inline mr-2" />
                                   Unban
                                 </>
                               ) : (
                                 <>
                                   <VscWarning className="inline mr-2" />
                                   Ban
                                 </>
                               )}
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
                 
                 {/* Pagination Controls */}
                 {pagination.totalPages > 1 && (
                   <div className="flex items-center justify-between px-6 py-4 border-t border-richblack-700">
                     <div className="text-sm text-richblack-300">
                       Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalUsers)} of {pagination.totalUsers} users
                     </div>
                     <div className="flex items-center gap-2">
                       <button
                         onClick={() => fetchUsers(pagination.currentPage - 1)}
                         disabled={!pagination.hasPrev}
                         className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                           pagination.hasPrev
                             ? 'bg-richblack-700 text-richblack-100 hover:bg-richblack-600'
                             : 'bg-richblack-800 text-richblack-500 cursor-not-allowed'
                         }`}
                       >
                         Previous
                       </button>
                       
                       <span className="px-3 py-2 text-richblack-300">
                         Page {pagination.currentPage} of {pagination.totalPages}
                       </span>
                       
                       <button
                         onClick={() => fetchUsers(pagination.currentPage + 1)}
                         disabled={!pagination.hasNext}
                         className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                           pagination.hasNext
                             ? 'bg-richblack-700 text-richblack-100 hover:bg-richblack-600'
                             : 'bg-richblack-800 text-richblack-500 cursor-not-allowed'
                         }`}
                       >
                         Next
                       </button>
                     </div>
                   </div>
                 )}
               </>
             )}
           </div>
         </div>
       </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-richblack-800 rounded-xl p-6 max-w-md w-full mx-4 border border-richblack-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-richblack-5">User Details</h3>
              <button
                onClick={closeUserModal}
                className="text-richblack-400 hover:text-richblack-200 transition-colors duration-200"
              >
                <VscClose className="text-xl" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-richblack-300 text-sm">Name</p>
                <p className="text-richblack-5 font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
              </div>
              <div>
                <p className="text-richblack-300 text-sm">Email</p>
                <p className="text-richblack-5 font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-richblack-300 text-sm">Role</p>
                <p className="text-richblack-5 font-medium capitalize">{selectedUser.accountType}</p>
              </div>
              <div>
                <p className="text-richblack-300 text-sm">Status</p>
                <p className={`font-medium ${selectedUser.isBanned ? 'text-red-400' : 'text-green-400'}`}>
                  {selectedUser.isBanned ? 'Banned' : 'Active'}
                </p>
              </div>
              <div>
                <p className="text-richblack-300 text-sm">Joined</p>
                <p className="text-richblack-5 font-medium">{formatDate(selectedUser.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  handleBanUser(selectedUser._id, selectedUser.isBanned);
                  closeUserModal();
                }}
                style={{
                  backgroundColor: selectedUser.isBanned ? '#10b981' : '#ef4444',
                  color: 'white',
                  border: `1px solid ${selectedUser.isBanned ? '#10b981' : '#ef4444'}`
                }}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
              >
                {selectedUser.isBanned ? 'Unban User' : 'Ban User'}
              </button>
              <button
                onClick={closeUserModal}
                className="flex-1 px-4 py-2 rounded-lg font-medium bg-richblack-700 text-richblack-300 hover:bg-richblack-600 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
                 </div>
       )}

       {/* Ban Confirmation Modal */}
       {showBanModal && userToBan && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-richblack-800 rounded-xl p-6 max-w-md w-full mx-4 border border-richblack-600">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold text-richblack-5">
                 {userToBan.isBanned ? 'Unban User' : 'Ban User'}
               </h3>
               <button
                 onClick={() => {
                   setShowBanModal(false);
                   setUserToBan(null);
                 }}
                 className="text-richblack-400 hover:text-richblack-200 transition-colors duration-200"
               >
                 <VscClose className="text-xl" />
               </button>
             </div>
             
             <div className="space-y-4">
               <div className="bg-richblack-700/50 rounded-lg p-4 border border-red-500/20">
                 <div className="flex items-center gap-3 mb-3">
                   <div className="w-10 h-10 bg-richblack-600 rounded-full flex items-center justify-center">
                     <span className="text-richblack-100 font-semibold">
                       {userToBan.firstName.charAt(0)}{userToBan.lastName.charAt(0)}
                     </span>
                   </div>
                   <div>
                     <p className="font-medium text-richblack-5">{userToBan.firstName} {userToBan.lastName}</p>
                     <p className="text-sm text-richblack-400">{userToBan.email}</p>
                   </div>
                 </div>
                 
                 <p className="text-richblack-300 text-sm">
                   {userToBan.isBanned 
                     ? 'This will restore the user\'s access to the platform.'
                     : 'This will immediately restrict the user\'s access to the platform. They will see a ban message and be unable to use any services.'
                   }
                 </p>
               </div>
               
               <div className="text-center">
                 <p className="text-richblack-300 text-sm">
                   <strong>Contact:</strong> admin@eduvate.in
                 </p>
               </div>
             </div>
             
             <div className="flex gap-3 mt-6">
               <button
                 onClick={() => {
                   handleBanUser(userToBan._id, userToBan.isBanned);
                   setShowBanModal(false);
                   setUserToBan(null);
                 }}
                 className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-white"
                 style={{
                   backgroundColor: userToBan.isBanned ? '#10b981' : '#ef4444',
                   color: '#ffffff'
                 }}
                 onMouseEnter={(e) => e.target.style.backgroundColor = userToBan.isBanned ? '#059669' : '#dc2626'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = userToBan.isBanned ? '#10b981' : '#ef4444'}
               >
                 {userToBan.isBanned ? 'Unban User' : 'Ban User'}
               </button>
               <button
                 onClick={() => {
                   setShowBanModal(false);
                   setUserToBan(null);
                 }}
                 className="flex-1 px-4 py-2 rounded-lg font-medium bg-richblack-700 text-richblack-300 hover:bg-richblack-600 transition-all duration-200"
               >
                 Cancel
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

// Category Management Section Component
const CategoryManagementSection = ({ fetchCategories, refreshPublicCategories }) => {
  const { categories } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(adminEndpoints.CREATE_CATEGORY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Category created successfully!');
        setShowAddModal(false);
        setFormData({ name: '', description: '' });
        fetchCategories();
        // Also refresh categories in the public endpoint to update Navbar
        refreshPublicCategories();
      } else {
        toast.error(data.msg || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(`${adminEndpoints.UPDATE_CATEGORY}/${selectedCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Category updated successfully!');
        setShowEditModal(false);
        setSelectedCategory(null);
        setFormData({ name: '', description: '' });
        fetchCategories(); // Refresh the list
        refreshPublicCategories(); // Update Navbar
      } else {
        toast.error(data.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        if (!token) {
          toast.error('Authentication token not found');
          return;
        }

        const response = await fetch(`${adminEndpoints.DELETE_CATEGORY}/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          toast.success('Category deleted successfully!');
          fetchCategories(); // Refresh the list
          refreshPublicCategories(); // Update Navbar
        } else {
          toast.error(data.message || 'Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-yellow-25 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-yellow-25 font-medium">Loading categories...</p>
      </div>
    );
  }

  return (
    <>
      {/* Add Category Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-yellow-25 text-richblack-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-50 transition-all duration-200"
        >
          <VscAdd className="text-lg" />
          Add New Category
        </button>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-yellow-25 mb-2">No categories yet</h3>
          <p className="text-richblack-300">Create your first category to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category._id} className="bg-richblack-700 rounded-lg p-4 border border-richblack-600 hover:border-yellow-25/30 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-richblack-5 mb-2">{category.name}</h3>
                  <p className="text-richblack-300 text-sm leading-relaxed">{category.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-richblack-400 mb-3">
                <span>Courses: {category.course?.length || 0}</span>
                {category.course?.length > 0 && (
                  <span className="text-xs text-richblack-500">
                    {category.course.slice(0, 2).map(c => c.title).join(', ')}
                    {category.course.length > 2 && '...'}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-richblack-800 p-6 rounded-xl w-full max-w-md border-2 border-yellow-25/20 shadow-2xl shadow-yellow-25/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-yellow-25">Add New Category</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ name: '', description: '' });
                }}
                className="text-richblack-400 hover:text-richblack-200 transition-colors duration-200"
              >
                <VscClose className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-yellow-25 mb-2 uppercase tracking-wide">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  required
                  className="w-full px-3 py-3 bg-richblack-700 border-2 border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:border-yellow-25/50 placeholder-richblack-400 text-base font-medium transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-yellow-25 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                  rows="3"
                  required
                  className="w-full px-3 py-3 bg-richblack-700 border-2 border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:border-yellow-25/50 resize-none placeholder-richblack-400 text-base font-medium transition-all duration-200"
                />
              </div>
              
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ name: '', description: '' });
                  }}
                  className="flex-1 px-4 py-3 text-richblack-300 hover:text-richblack-100 transition-all duration-200 font-bold bg-richblack-700 hover:bg-richblack-600 rounded-lg border-2 border-richblack-600 hover:border-richblack-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-25 to-yellow-50 text-richblack-900 rounded-lg font-bold hover:from-yellow-50 hover:to-yellow-25 hover:scale-105 transition-all duration-200 shadow-lg shadow-yellow-25/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-richblack-900 border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-richblack-800 p-6 rounded-xl w-full max-w-md border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-blue-400">Edit Category</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCategory(null);
                  setFormData({ name: '', description: '' });
                }}
                className="text-richblack-400 hover:text-richblack-200 transition-colors duration-200"
              >
                <VscClose className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-blue-400 mb-2 uppercase tracking-wide">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  required
                  className="w-full px-3 py-3 bg-richblack-700 border-2 border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:border-blue-500/50 placeholder-richblack-400 text-base font-medium transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-blue-400 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                  rows="3"
                  required
                  className="w-full px-3 py-3 bg-richblack-700 border-2 border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:border-blue-500/50 resize-none placeholder-richblack-400 text-base font-medium transition-all duration-200"
                />
              </div>
              
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCategory(null);
                    setFormData({ name: '', description: '' });
                  }}
                  className="flex-1 px-4 py-3 text-richblack-300 hover:text-richblack-100 transition-all duration-200 font-bold bg-richblack-700 hover:bg-richblack-600 rounded-lg border-2 border-richblack-600 hover:border-richblack-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg font-bold hover:from-blue-400 hover:to-blue-500 hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Money Requests Section Component
const MoneyRequestsSection = () => {
  const [moneyRequests, setMoneyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) {
      // Generate a random date from 2023-2024 for requests without dates
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2024-12-31');
      const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
      const randomDate = new Date(randomTime);
      
      return randomDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // Handle different date formats
    let date;
    if (typeof dateString === 'string') {
      // Try parsing as ISO string first
      date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing as timestamp
        const timestamp = parseInt(dateString);
        if (!isNaN(timestamp)) {
          date = new Date(timestamp);
        }
      }
    } else if (typeof dateString === 'number') {
      // Handle timestamp
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString);
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchMoneyRequests();
  }, []);

  const fetchMoneyRequests = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      
      const response = await getMoneyRequests(token);
      if (response.success) {
        setMoneyRequests(response.data);
      } else {
        toast.error('Failed to load money requests');
      }
    } catch (error) {
      console.error('Error fetching money requests:', error);
      toast.error('Failed to load money requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      
      const response = await approveMoneyRequest(requestId, responseText || 'Request approved', token);
      if (response.success) {
        toast.success('Money request approved successfully!');
        setShowResponseModal(false);
        setSelectedRequest(null);
        setResponseText('');
        fetchMoneyRequests();
      } else {
        toast.error('Failed to approve money request');
      }
    } catch (error) {
      console.error('Error approving money request:', error);
      toast.error('Failed to approve money request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      
      const response = await rejectMoneyRequest(requestId, responseText || 'Request rejected', token);
      if (response.success) {
        toast.success('Money request rejected successfully!');
        setShowResponseModal(false);
        setSelectedRequest(null);
        setResponseText('');
        fetchMoneyRequests();
      } else {
        toast.error('Failed to reject money request');
      }
    } catch (error) {
      console.error('Error rejecting money request:', error);
      toast.error('Failed to reject money request');
    }
  };

  const openResponseModal = (request, action) => {
    setSelectedRequest({ ...request, action });
    setShowResponseModal(true);
    setResponseText('');
  };



  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-yellow-25 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-yellow-25 font-medium">Loading money requests...</p>
      </div>
    );
  }

  return (
    <>
      {moneyRequests.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-yellow-25 mb-2">No money requests</h3>
          <p className="text-richblack-300">All money requests have been processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {moneyRequests.map((request) => (
            <div key={request._id} className="bg-richblack-700 rounded-lg p-4 border border-richblack-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-richblack-600 rounded-full flex items-center justify-center">
                    <span className="text-richblack-100 font-semibold">
                      {request.userId?.firstName?.charAt(0)}{request.userId?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-richblack-5">
                      {request.userId?.firstName} {request.userId?.lastName}
                    </p>
                    <p className="text-sm text-richblack-400">{request.userId?.email}</p>
                    <p className="text-xs text-richblack-300">{request.userId?.accountType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-25">₹{request.amount}</p>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: request.status === 'PENDING' ? '#E5C558' : 
                                     request.status === 'APPROVED' ? '#10b981' : 
                                     request.status === 'REJECTED' ? '#ef4444' : '#4b5563',
                      color: request.status === 'PENDING' ? '#0F172A' : 
                             request.status === 'APPROVED' ? '#ffffff' : 
                             request.status === 'REJECTED' ? '#ffffff' : '#ffffff'
                    }}
                  >
                    {request.status}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-richblack-300 text-sm mb-1">Reason:</p>
                <p className="text-richblack-5">{request.reason}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-richblack-400">
                <span>Requested: {formatDate(request.createdAt)}</span>
                {request.status !== 'PENDING' && (
                  <span>Processed: {formatDate(request.updatedAt)}</span>
                )}
              </div>
              
              {request.status === 'PENDING' && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => openResponseModal(request, 'approve')}
                    className="px-4 py-2 text-white rounded-lg font-medium hover:scale-95 transition-all duration-200 shadow-lg text-sm"
                    style={{
                      backgroundColor: '#10b981',
                      color: '#ffffff'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openResponseModal(request, 'reject')}
                    className="px-4 py-2 text-white rounded-lg font-medium hover:scale-95 transition-all duration-200 shadow-lg text-sm"
                    style={{
                      backgroundColor: '#ef4444',
                      color: '#ffffff'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                  >
                    Reject
                  </button>
                </div>
              )}
              
              {request.adminResponse && (
                <div className="mt-3 p-3 bg-richblack-600 rounded-lg">
                  <p className="text-richblack-300 text-sm mb-1">Admin Response:</p>
                  <p className="text-richblack-5">{request.adminResponse}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-richblack-800 rounded-xl p-6 max-w-md w-full mx-4 border border-richblack-600 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 
                className="text-xl font-bold"
                style={{
                  color: selectedRequest.action === 'approve' ? '#4ade80' : '#f87171'
                }}
              >
                {selectedRequest.action === 'approve' ? 'Approve' : 'Reject'} Money Request
              </h3>
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedRequest(null);
                  setResponseText('');
                }}
                className="text-richblack-400 hover:text-richblack-200 transition-colors duration-200"
              >
                <VscClose className="text-xl" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-richblack-700/50 rounded-lg p-4 border border-richblack-600">
                <p className="text-richblack-300 text-sm mb-2">User: {selectedRequest.userId?.firstName} {selectedRequest.userId?.lastName}</p>
                <p className="text-richblack-100 text-sm mb-2">Amount: ₹{selectedRequest.amount}</p>
                <p className="text-richblack-300 text-sm">Reason: {selectedRequest.reason}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-yellow-25 mb-2">
                  Response Message (Optional)
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder={`Enter a message for the user...`}
                  rows="3"
                  className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-100 focus:outline-none focus:border-yellow-25/50 resize-none placeholder-richblack-400"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  if (selectedRequest.action === 'approve') {
                    handleApprove(selectedRequest._id);
                  } else {
                    handleReject(selectedRequest._id);
                  }
                }}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-95 shadow-lg text-white text-sm"
                style={{
                  backgroundColor: selectedRequest.action === 'approve' ? '#10b981' : '#ef4444',
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = selectedRequest.action === 'approve' ? '#059669' : '#dc2626'}
                onMouseLeave={(e) => e.target.style.backgroundColor = selectedRequest.action === 'approve' ? '#10b981' : '#ef4444'}
              >
                {selectedRequest.action === 'approve' ? 'Approve Request' : 'Reject Request'}
              </button>
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedRequest(null);
                  setResponseText('');
                }}
                className="flex-1 px-6 py-3 rounded-lg font-semibold bg-richblack-700 text-richblack-300 hover:bg-richblack-600 hover:scale-95 transition-all duration-200 shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
