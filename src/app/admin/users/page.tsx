"use client";
import React, { useState, useEffect } from 'react';
import AdminCard from '../components/AdminCard';

interface User {
  id: number;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface EditUser {
  id: number;
  email: string;
  password: string;
  isAdmin: boolean;
}

const AdminUsersPage: React.FC = () => {
  // 상태 관리
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  
  // 새 사용자 추가 상태
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    isAdmin: false
  });
  const [addingUser, setAddingUser] = useState(false);
  
  // 사용자 수정 상태
  const [editingUser, setEditingUser] = useState<EditUser | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  // 사용자 목록 조회
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        showMessage('사용자 목록을 불러오는데 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('사용자 목록 로드 오류:', error);
      showMessage('사용자 목록을 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 메시지 표시
  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  // 새 사용자 추가
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingUser(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        showMessage('사용자가 성공적으로 등록되었습니다.', 'success');
        setNewUser({ email: '', password: '', isAdmin: false });
        setShowAddForm(false);
        fetchUsers();
      } else {
        const error = await response.json();
        showMessage(error.error || '사용자 등록에 실패했습니다.', 'error');
      }
    } catch (error) {
      showMessage('사용자 등록 중 오류가 발생했습니다.', 'error');
    } finally {
      setAddingUser(false);
    }
  };

  // 사용자 수정
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUpdatingUser(true);

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editingUser.email,
          password: editingUser.password || undefined,
          isAdmin: editingUser.isAdmin
        })
      });

      if (response.ok) {
        showMessage('사용자 정보가 성공적으로 수정되었습니다.', 'success');
        setEditingUser(null);
        setShowEditForm(false);
        fetchUsers();
      } else {
        const error = await response.json();
        showMessage(error.error || '사용자 수정에 실패했습니다.', 'error');
      }
    } catch (error) {
      showMessage('사용자 수정 중 오류가 발생했습니다.', 'error');
    } finally {
      setUpdatingUser(false);
    }
  };

  // 사용자 삭제
  const handleDeleteUser = async (userId: number) => {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showMessage('사용자가 성공적으로 삭제되었습니다.', 'success');
        fetchUsers();
      } else {
        const error = await response.json();
        showMessage(error.error || '사용자 삭제에 실패했습니다.', 'error');
      }
    } catch (error) {
      showMessage('사용자 삭제 중 오류가 발생했습니다.', 'error');
    }
  };

  // 수정 폼 열기
  const openEditForm = (user: User) => {
    setEditingUser({
      id: user.id,
      email: user.email,
      password: '',
      isAdmin: user.isAdmin
    });
    setShowEditForm(true);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 필터링된 사용자 목록
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || 
      (filterRole === 'admin' && user.isAdmin) || 
      (filterRole === 'user' && !user.isAdmin);
    return matchesSearch && matchesRole;
  });

  // 통계 계산
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.isAdmin).length;
  const regularUsers = users.filter(u => !u.isAdmin).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              사용자 관리
            </h1>
            <p className="text-slate-600 mt-2">사용자 계정을 관리하고 권한을 설정합니다</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            새 사용자 추가
          </button>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div className={`p-4 rounded-xl border-l-4 ${
            messageType === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : 'bg-red-50 border-red-400 text-red-800'
          }`}>
            <div className="flex items-center">
              <svg className={`w-5 h-5 mr-2 ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {messageType === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              {message}
            </div>
          </div>
        )}

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">총 사용자</p>
                <p className="text-3xl font-bold text-slate-900">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">관리자</p>
                <p className="text-3xl font-bold text-purple-600">{adminUsers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">일반 사용자</p>
                <p className="text-3xl font-bold text-green-600">{regularUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'user')}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">모든 사용자</option>
                <option value="admin">관리자만</option>
                <option value="user">일반 사용자만</option>
              </select>
            </div>
          </div>
        </div>

        {/* 새 사용자 추가 폼 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">새 사용자 추가</h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewUser({ email: '', password: '', isAdmin: false });
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="user@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    비밀번호 *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="최소 6자 이상"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newUserIsAdmin"
                    checked={newUser.isAdmin}
                    onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label htmlFor="newUserIsAdmin" className="ml-3 block text-sm text-slate-900">
                    관리자 권한 부여
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={addingUser}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200"
                  >
                    {addingUser ? '추가 중...' : '사용자 추가'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewUser({ email: '', password: '', isAdmin: false });
                    }}
                    className="px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 사용자 수정 폼 */}
        {showEditForm && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">사용자 정보 수정</h2>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingUser(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="user@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    새 비밀번호 (변경하지 않으려면 비워두세요)
                  </label>
                  <input
                    type="password"
                    minLength={6}
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="최소 6자 이상"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editUserIsAdmin"
                    checked={editingUser.isAdmin}
                    onChange={(e) => setEditingUser({ ...editingUser, isAdmin: e.target.checked })}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label htmlFor="editUserIsAdmin" className="ml-3 block text-sm text-slate-900">
                    관리자 권한 부여
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={updatingUser}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200"
                  >
                    {updatingUser ? '수정 중...' : '정보 수정'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingUser(null);
                    }}
                    className="px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 사용자 목록 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">사용자 목록</h2>
            <p className="text-slate-600 mt-1">총 {filteredUsers.length}명의 사용자</p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-slate-600">사용자 목록을 불러오는 중...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">사용자가 없습니다</h3>
              <p className="text-slate-600">검색 조건에 맞는 사용자가 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      {/* 사용자 아바타 */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      {/* 사용자 정보 */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{user.email}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isAdmin 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isAdmin ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                관리자
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                일반 사용자
                              </>
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          가입일: {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {/* 액션 버튼 */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => openEditForm(user)}
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        수정
                      </button>
                      {!user.isAdmin && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage; 
 
 