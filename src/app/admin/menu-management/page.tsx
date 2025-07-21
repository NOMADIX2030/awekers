"use client";
import React, { useState, useEffect } from 'react';
import AdminCard from '../components/AdminCard';
import AdminButton from '../components/AdminButton';
import AdminBreadcrumb from '../components/AdminBreadcrumb';
import { getVisibilityLevelLabel, VisibilityLevel } from '@/lib/auth';

interface Menu {
  id: number;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  visibilityLevel: string;
  createdAt: string;
  updatedAt: string;
  subMenus?: SubMenu[];
}

interface SubMenu {
  id: number;
  parentMenuId: number;
  label: string;
  href: string;
  icon?: string;
  order: number;
  isActive: boolean;
  visibilityLevel: string;
  createdAt: string;
  updatedAt: string;
  parentMenu?: {
    id: number;
    label: string;
  };
}

interface MenuFormData {
  id?: number;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  visibilityLevel: string;
}

interface SubMenuFormData {
  id?: number;
  parentMenuId: number;
  label: string;
  href: string;
  icon: string;
  order: number;
  isActive: boolean;
  visibilityLevel: string;
}

const MenuManagementPage = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [subMenus, setSubMenus] = useState<SubMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSubMenuForm, setShowSubMenuForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editingSubMenu, setEditingSubMenu] = useState<SubMenu | null>(null);
  const [formData, setFormData] = useState<MenuFormData>({
    label: '',
    href: '',
    order: 0,
    isActive: true,
    visibilityLevel: 'GUEST'
  });
  const [subMenuFormData, setSubMenuFormData] = useState<SubMenuFormData>({
    parentMenuId: 0,
    label: '',
    href: '',
    icon: '',
    order: 0,
    isActive: true,
    visibilityLevel: 'GUEST'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 메뉴 목록 조회
  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/menu');
      const data = await response.json();
      
      if (data.success) {
        setMenus(data.data);
        // 헤더 메뉴도 새로고침
        refreshHeaderMenu();
      } else {
        setMessage({ type: 'error', text: data.error || '메뉴 조회에 실패했습니다.' });
      }
    } catch (error) {
      console.error('메뉴 조회 오류:', error);
      setMessage({ type: 'error', text: '메뉴 조회 중 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  // 하위메뉴 목록 조회
  const fetchSubMenus = async () => {
    try {
      const response = await fetch('/api/admin/submenu');
      const data = await response.json();
      
      if (data.success) {
        setSubMenus(data.data);
      } else {
        setMessage({ type: 'error', text: data.error || '하위메뉴 조회에 실패했습니다.' });
      }
    } catch (error) {
      console.error('하위메뉴 조회 오류:', error);
      setMessage({ type: 'error', text: '하위메뉴 조회 중 오류가 발생했습니다.' });
    }
  };

  // 헤더 메뉴 새로고침 함수
  const refreshHeaderMenu = () => {
    try {
      if (typeof window !== 'undefined') {
        // 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('menuUpdated'));
      }
    } catch (error) {
      console.error('헤더 메뉴 새로고침 오류:', error);
    }
  };

  // 컴포넌트 마운트 시 메뉴 조회
  useEffect(() => {
    fetchMenus();
    fetchSubMenus();
  }, []);

  // 메시지 자동 숨김
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 폼 데이터 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 하위메뉴 폼 데이터 변경 핸들러
  const handleSubMenuInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setSubMenuFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'parentMenuId' || name === 'order') ? parseInt(value) || 0 : value
    }));
  };

  // 새 메뉴 추가 폼 열기
  const handleAddMenu = () => {
    setEditingMenu(null);
    setFormData({
      label: '',
      href: '',
      order: menus.length + 1,
      isActive: true,
      visibilityLevel: 'GUEST'
    });
    setShowForm(true);
  };

  // 새 하위메뉴 추가 폼 열기
  const handleAddSubMenu = (parentMenuId?: number) => {
    setEditingSubMenu(null);
    setSubMenuFormData({
      parentMenuId: parentMenuId || (menus[0]?.id || 0),
      label: '',
      href: '',
      icon: '',
      order: 1,
      isActive: true,
      visibilityLevel: 'GUEST'
    });
    setShowSubMenuForm(true);
  };

  // 메뉴 수정 폼 열기
  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
    setFormData({
      id: menu.id,
      label: menu.label,
      href: menu.href,
      order: menu.order,
      isActive: menu.isActive,
      visibilityLevel: menu.visibilityLevel
    });
    setShowForm(true);
  };

  // 하위메뉴 수정 폼 열기
  const handleEditSubMenu = (subMenu: SubMenu) => {
    setEditingSubMenu(subMenu);
    setSubMenuFormData({
      id: subMenu.id,
      parentMenuId: subMenu.parentMenuId,
      label: subMenu.label,
      href: subMenu.href,
      icon: subMenu.icon || '',
      order: subMenu.order,
      isActive: subMenu.isActive,
      visibilityLevel: subMenu.visibilityLevel
    });
    setShowSubMenuForm(true);
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label.trim() || !formData.href.trim()) {
      setMessage({ type: 'error', text: '메뉴명과 링크를 모두 입력해주세요.' });
      return;
    }

    setFormLoading(true);
    
    try {
      const url = '/api/admin/menu';
      const method = editingMenu ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setShowForm(false);
        fetchMenus();
        setFormData({
          label: '',
          href: '',
          order: 0,
          isActive: true,
          visibilityLevel: 'GUEST'
        });
      } else {
        setMessage({ type: 'error', text: data.error || '작업에 실패했습니다.' });
      }
    } catch (error) {
      console.error('메뉴 저장 오류:', error);
      setMessage({ type: 'error', text: '메뉴 저장 중 오류가 발생했습니다.' });
    } finally {
      setFormLoading(false);
    }
  };

  // 메뉴 삭제
  const handleDeleteMenu = async (id: number) => {
    if (!confirm('정말로 이 메뉴를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/menu?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        fetchMenus();
      } else {
        setMessage({ type: 'error', text: data.error || '삭제에 실패했습니다.' });
      }
    } catch (error) {
      console.error('메뉴 삭제 오류:', error);
      setMessage({ type: 'error', text: '메뉴 삭제 중 오류가 발생했습니다.' });
    }
  };

  // 메뉴 활성화/비활성화 토글
  const toggleMenuStatus = async (menu: Menu) => {
    try {
      const response = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...menu,
          isActive: !menu.isActive
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: `메뉴가 ${!menu.isActive ? '활성화' : '비활성화'}되었습니다.` });
        fetchMenus(); // 이미 fetchMenus 안에서 refreshHeaderMenu()를 호출함
      } else {
        setMessage({ type: 'error', text: data.error || '상태 변경에 실패했습니다.' });
      }
    } catch (error) {
      console.error('메뉴 상태 변경 오류:', error);
      setMessage({ type: 'error', text: '상태 변경 중 오류가 발생했습니다.' });
    }
  };

  // 하위메뉴 폼 제출
  const handleSubMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subMenuFormData.label.trim() || !subMenuFormData.href.trim() || !subMenuFormData.parentMenuId) {
      setMessage({ type: 'error', text: '상위메뉴, 하위메뉴명, 링크를 모두 입력해주세요.' });
      return;
    }

    setFormLoading(true);
    
    try {
      const url = '/api/admin/submenu';
      const method = editingSubMenu ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subMenuFormData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setShowSubMenuForm(false);
        fetchSubMenus();
        refreshHeaderMenu();
        setSubMenuFormData({
          parentMenuId: 0,
          label: '',
          href: '',
          icon: '',
          order: 0,
          isActive: true,
          visibilityLevel: 'GUEST'
        });
      } else {
        setMessage({ type: 'error', text: data.error || '작업에 실패했습니다.' });
      }
    } catch (error) {
      console.error('하위메뉴 저장 오류:', error);
      setMessage({ type: 'error', text: '하위메뉴 저장 중 오류가 발생했습니다.' });
    } finally {
      setFormLoading(false);
    }
  };

  // 하위메뉴 삭제
  const handleDeleteSubMenu = async (id: number) => {
    if (!confirm('정말로 이 하위메뉴를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/submenu?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        fetchSubMenus();
        refreshHeaderMenu();
      } else {
        setMessage({ type: 'error', text: data.error || '삭제에 실패했습니다.' });
      }
    } catch (error) {
      console.error('하위메뉴 삭제 오류:', error);
      setMessage({ type: 'error', text: '하위메뉴 삭제 중 오류가 발생했습니다.' });
    }
  };

  // 하위메뉴 활성화/비활성화 토글
  const toggleSubMenuStatus = async (subMenu: SubMenu) => {
    try {
      const response = await fetch('/api/admin/submenu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...subMenu,
          isActive: !subMenu.isActive
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: `하위메뉴가 ${!subMenu.isActive ? '활성화' : '비활성화'}되었습니다.` });
        fetchSubMenus();
        refreshHeaderMenu();
      } else {
        setMessage({ type: 'error', text: data.error || '상태 변경에 실패했습니다.' });
      }
    } catch (error) {
      console.error('하위메뉴 상태 변경 오류:', error);
      setMessage({ type: 'error', text: '상태 변경 중 오류가 발생했습니다.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <AdminBreadcrumb
        items={[
          { label: '관리자', href: '/admin/dashboard' },
          { label: '메뉴관리', href: '/admin/menu-management' }
        ]}
      />

      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">메뉴관리</h1>
          <p className="mt-1 text-sm text-gray-600">
            웹사이트 헤더 메뉴와 하위메뉴를 관리합니다.
          </p>
        </div>
        <div className="flex space-x-3">
          <AdminButton onClick={handleAddMenu} variant="primary">
            + 새 메뉴 추가
          </AdminButton>
          <AdminButton onClick={() => handleAddSubMenu()} variant="secondary">
            + 새 하위메뉴 추가
          </AdminButton>
        </div>
      </div>

      {/* 메시지 표시 */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* 메뉴 폼 */}
      {showForm && (
        <AdminCard title={editingMenu ? '메뉴 수정' : '새 메뉴 추가'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메뉴명 *
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 홈페이지 제작"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  링크 URL *
                </label>
                <input
                  type="text"
                  name="href"
                  value={formData.href}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: /tag/홈페이지제작"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  정렬 순서
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  권한 설정
                </label>
                <select
                  name="visibilityLevel"
                  value={formData.visibilityLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GUEST">일반방문자 (모든 사용자)</option>
                  <option value="USER">일반회원 (로그인 필요)</option>
                  <option value="ADMIN">관리자 (관리자만)</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">활성화</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <AdminButton
                variant="secondary"
                onClick={() => setShowForm(false)}
                disabled={formLoading}
              >
                취소
              </AdminButton>
              <AdminButton
                type="submit"
                loading={formLoading}
                disabled={formLoading}
              >
                {editingMenu ? '수정' : '추가'}
              </AdminButton>
            </div>
          </form>
        </AdminCard>
      )}

      {/* 메뉴 목록 */}
      <AdminCard title="메뉴 목록">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            등록된 메뉴가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">순서</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">메뉴명</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">링크</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">권한</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">상태</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">생성일</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">관리</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu) => (
                  <tr key={menu.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{menu.order}</td>
                    <td className="py-3 px-4 font-medium">{menu.label}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{menu.href}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {getVisibilityLevelLabel(menu.visibilityLevel as VisibilityLevel)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleMenuStatus(menu)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          menu.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {menu.isActive ? '활성' : '비활성'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(menu.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <AdminButton
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditMenu(menu)}
                        >
                          수정
                        </AdminButton>
                        <AdminButton
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteMenu(menu.id)}
                        >
                          삭제
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* 하위메뉴 폼 */}
      {showSubMenuForm && (
        <AdminCard title={editingSubMenu ? '하위메뉴 수정' : '새 하위메뉴 추가'}>
          <form onSubmit={handleSubMenuSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상위메뉴 *
                </label>
                <select
                  name="parentMenuId"
                  value={subMenuFormData.parentMenuId}
                  onChange={handleSubMenuInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">상위메뉴 선택</option>
                  {menus.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  하위메뉴명 *
                </label>
                <input
                  type="text"
                  name="label"
                  value={subMenuFormData.label}
                  onChange={handleSubMenuInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 포트폴리오"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  링크 URL *
                </label>
                <input
                  type="text"
                  name="href"
                  value={subMenuFormData.href}
                  onChange={handleSubMenuInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: /tag/포트폴리오"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아이콘
                </label>
                <input
                  type="text"
                  name="icon"
                  value={subMenuFormData.icon}
                  onChange={handleSubMenuInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 📁"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  정렬 순서
                </label>
                <input
                  type="number"
                  name="order"
                  value={subMenuFormData.order}
                  onChange={handleSubMenuInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  권한 설정
                </label>
                <select
                  name="visibilityLevel"
                  value={subMenuFormData.visibilityLevel}
                  onChange={handleSubMenuInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GUEST">일반방문자 (모든 사용자)</option>
                  <option value="USER">일반회원 (로그인 필요)</option>
                  <option value="ADMIN">관리자 (관리자만)</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={subMenuFormData.isActive}
                    onChange={handleSubMenuInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">활성화</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <AdminButton
                variant="secondary"
                onClick={() => setShowSubMenuForm(false)}
                disabled={formLoading}
              >
                취소
              </AdminButton>
              <AdminButton
                type="submit"
                loading={formLoading}
                disabled={formLoading}
              >
                {editingSubMenu ? '수정' : '추가'}
              </AdminButton>
            </div>
          </form>
        </AdminCard>
      )}

      {/* 하위메뉴 목록 */}
      <AdminCard title="하위메뉴 목록">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : subMenus.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            등록된 하위메뉴가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">상위메뉴</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">순서</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">하위메뉴명</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">링크</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">아이콘</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">권한</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">상태</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">생성일</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">관리</th>
                </tr>
              </thead>
              <tbody>
                {subMenus.map((subMenu) => (
                  <tr key={subMenu.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-blue-600">
                      {subMenu.parentMenu?.label || '알 수 없음'}
                    </td>
                    <td className="py-3 px-4 text-sm">{subMenu.order}</td>
                    <td className="py-3 px-4 font-medium">{subMenu.label}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{subMenu.href}</td>
                    <td className="py-3 px-4 text-sm">{subMenu.icon || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {getVisibilityLevelLabel(subMenu.visibilityLevel as VisibilityLevel)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleSubMenuStatus(subMenu)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subMenu.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {subMenu.isActive ? '활성' : '비활성'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(subMenu.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <AdminButton
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditSubMenu(subMenu)}
                        >
                          수정
                        </AdminButton>
                        <AdminButton
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteSubMenu(subMenu.id)}
                        >
                          삭제
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
};

export default MenuManagementPage; 