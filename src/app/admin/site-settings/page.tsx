"use client";
import React, { useState, useEffect } from 'react';
import AdminCard from '../components/AdminCard';

interface User {
  id: number;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Report {
  id: number;
  content: string;
  isHidden: boolean;
  createdAt: string;
  user: {
    id: number;
    email: string;
    isAdmin: boolean;
  };
  blog: {
    id: number;
    title: string;
  };
  _count: {
    reports: number;
    likes: number;
  };
  reportCount: number;
  likeCount: number;
  reports: {
    id: number;
    reason: string;
    createdAt: string;
    user: {
      id: number;
      email: string;
    };
  }[];
}

const AdminSiteSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'users' | 'reports'>('settings');
  
  // 사이트 설정 상태
  const [siteName, setSiteName] = useState('');
  const [siteDesc, setSiteDesc] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // 사용자 관리 상태
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  // 신고 관리 상태
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportMsg, setReportMsg] = useState('');

  useEffect(() => {
    fetchSettings();
    fetchUsers();
    fetchReports();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/site-setting');
      if (response.ok) {
        const data = await response.json();
        setSiteName(data.siteName || '');
        setSiteDesc(data.siteDesc || '');
        setKeywords(data.keywords || '');
        setOgImage(data.ogImage || '');
        setAuthor(data.author || '');
        setPublisher(data.publisher || '');
      }
    } catch (error) {
      console.error('설정 로드 오류:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('사용자 목록 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const response = await fetch('/api/admin/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('신고 목록 로드 오류:', error);
    } finally {
      setReportsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const save = async (key: string, value: string) => {
      const response = await fetch('/api/site-setting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      return response.ok;
    };

    try {
      const results = await Promise.all([
        save('siteName', siteName),
        save('siteDesc', siteDesc),
        save('keywords', keywords),
        save('ogImage', ogImage),
        save('author', author),
        save('publisher', publisher)
      ]);

      if (results.every(result => result)) {
        setMsg('설정이 성공적으로 저장되었습니다.');
      } else {
        setMsg('일부 설정 저장에 실패했습니다.');
      }
    } catch (error) {
      setMsg('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserMsg('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          isAdmin: newUserIsAdmin
        })
      });

      if (response.ok) {
        setUserMsg('사용자가 성공적으로 등록되었습니다.');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserIsAdmin(false);
        fetchUsers();
      } else {
        const error = await response.json();
        setUserMsg(error.message || '사용자 등록에 실패했습니다.');
      }
    } catch (error) {
      setUserMsg('사용자 등록 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setUserMsg('사용자가 성공적으로 삭제되었습니다.');
        fetchUsers();
      } else {
        setUserMsg('사용자 삭제에 실패했습니다.');
      }
    } catch (error) {
      setUserMsg('사용자 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleReportAction = async (commentId: number, action: 'delete' | 'dismiss' | 'restore' | 'hide' | 'unhide' | 'resolve') => {
    try {
      const response = await fetch(`/api/admin/reports/${commentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        setReportMsg('신고 처리가 완료되었습니다.');
        fetchReports();
      } else {
        setReportMsg('신고 처리에 실패했습니다.');
      }
    } catch (error) {
      setReportMsg('신고 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      {/* 탭 네비게이션 */}
      <div className="mb-6 sm:mb-8">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'settings'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            사이트 설정
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'users'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            사용자 관리
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'reports'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            신고 관리
          </button>
        </nav>
      </div>

      {/* 사이트 설정 탭 */}
      {activeTab === 'settings' && (
        <AdminCard title="사이트 기본 설정">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사이트 이름
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="사이트 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사이트 설명
                </label>
                <input
                  type="text"
                  value={siteDesc}
                  onChange={(e) => setSiteDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="사이트 설명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  키워드
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="쉼표로 구분된 키워드"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG 이미지 URL
                </label>
                <input
                  type="url"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  작성자
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="작성자명"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  발행자
                </label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="발행자명"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {saving ? '저장 중...' : '설정 저장'}
              </button>
              {msg && (
                <p className={`mt-3 text-sm ${msg.includes('실패') || msg.includes('오류') ? 'text-red-600' : 'text-green-600'}`}>
                  {msg}
                </p>
              )}
            </div>
          </form>
        </AdminCard>
      )}

      {/* 사용자 관리 탭 */}
      {activeTab === 'users' && (
        <AdminCard title="사용자 관리">
          <div className="space-y-6">
            {/* 새 사용자 등록 폼 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">새 사용자 등록</h3>
              <form onSubmit={handleAddUser} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="이메일"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="비밀번호 (6자 이상)"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newUserIsAdmin}
                      onChange={(e) => setNewUserIsAdmin(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">관리자 권한</span>
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    등록
                  </button>
                </div>
              </form>
              {userMsg && (
                <p className={`mt-3 text-sm ${userMsg.includes('실패') || userMsg.includes('오류') ? 'text-red-600' : 'text-green-600'}`}>
                  {userMsg}
                </p>
              )}
            </div>

            {/* 사용자 목록 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">등록된 사용자</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">사용자 목록을 불러오는 중...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.email}</div>
                          <div className="text-sm text-gray-500">
                            가입일: {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {user.isAdmin && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            관리자
                          </span>
                        )}
                        {!user.isAdmin && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AdminCard>
      )}

      {/* 신고 관리 탭 */}
      {activeTab === 'reports' && (
        <AdminCard title="신고 관리">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">신고된 댓글 관리 ({reports.length}건)</h3>
              <p className="text-sm text-gray-600 mb-6">신고 수가 3개 이상인 댓글만 표시됩니다.</p>
              
              {reportsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <span className="ml-2 text-gray-600">신고 목록을 불러오는 중...</span>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">신고된 댓글이 없습니다.</div>
              ) : (
                <div className="space-y-4">
                  {reports.map(report => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm">{report.user.email}</span>
                            {report.user.isAdmin && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">관리자</span>
                            )}
                            <span className="text-gray-400 text-xs">•</span>
                            <span className="text-gray-500 text-xs">
                              {new Date(report.createdAt).toLocaleDateString("ko-KR")}
                            </span>
                            {report.isHidden && (
                              <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">
                                숨겨짐
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-800 mb-2">{report.content}</div>
                          <div className="text-xs text-gray-500">
                            게시글: {report.blog.title} | 
                            신고 수: {report.reportCount} | 
                            좋아요 수: {report.likeCount}
                          </div>
                        </div>
                      </div>
                      
                      {/* 신고 내역 상세 */}
                      <div className="border-t border-gray-200 pt-3">
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold mb-2">신고 내역 ({report.reports.length}건)</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {report.reports.map((reportItem, index) => (
                              <div key={reportItem.id} className="text-xs bg-gray-50 p-2 rounded">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-medium">{reportItem.user.email}</span>
                                    <span className="text-gray-500 ml-2">
                                      {new Date(reportItem.createdAt).toLocaleDateString("ko-KR")}
                                    </span>
                                  </div>
                                  <span className="text-red-600 font-medium">#{index + 1}</span>
                                </div>
                                <div className="text-gray-700 mt-1">{reportItem.reason}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReportAction(report.id, 'delete')}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            댓글 삭제
                          </button>
                          <button
                            onClick={() => handleReportAction(report.id, 'hide')}
                            className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
                          >
                            댓글 숨김
                          </button>
                          <button
                            onClick={() => handleReportAction(report.id, 'resolve')}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                          >
                            신고 해결
                          </button>
                          <button
                            onClick={() => handleReportAction(report.id, 'dismiss')}
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                          >
                            신고 기각
                          </button>
                          {report.isHidden && (
                            <button
                              onClick={() => handleReportAction(report.id, 'unhide')}
                              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                            >
                              댓글 복원
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {reportMsg && (
                <div className={`text-sm font-medium p-3 rounded-lg ${
                  reportMsg.includes('완료') || reportMsg.includes('되었습니다')
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {reportMsg}
                </div>
              )}
            </div>
          </div>
        </AdminCard>
      )}
    </>
  );
};

export default AdminSiteSettingsPage; 