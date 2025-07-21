import { SEOCategory, SEOCheckItem } from '../types';
import { categories } from './categories';
import { checkItems } from './check-items';

export class SEOConfig {
  private categories: SEOCategory[] = [];
  private checkItems: SEOCheckItem[] = [];

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    this.categories = categories;
    this.checkItems = checkItems;
  }

  getCategories(): SEOCategory[] {
    return this.categories;
  }

  getCheckItems(): SEOCheckItem[] {
    return this.checkItems;
  }

  getCategoryById(categoryId: string): SEOCategory | undefined {
    return this.categories.find(category => category.id === categoryId);
  }

  getCheckItemById(checkItemId: string): SEOCheckItem | undefined {
    return this.checkItems.find(item => item.id === checkItemId);
  }

  getCheckItemsByCategory(categoryId: string): SEOCheckItem[] {
    return this.checkItems.filter(item => item.categoryId === categoryId);
  }

  // 설정 업데이트 메서드들
  updateCategory(categoryId: string, updates: Partial<SEOCategory>): boolean {
    const index = this.categories.findIndex(cat => cat.id === categoryId);
    if (index !== -1) {
      this.categories[index] = { ...this.categories[index], ...updates };
      return true;
    }
    return false;
  }

  updateCheckItem(checkItemId: string, updates: Partial<SEOCheckItem>): boolean {
    const index = this.checkItems.findIndex(item => item.id === checkItemId);
    if (index !== -1) {
      this.checkItems[index] = { ...this.checkItems[index], ...updates };
      return true;
    }
    return false;
  }

  addCategory(category: SEOCategory): boolean {
    if (this.getCategoryById(category.id)) {
      return false; // 이미 존재하는 ID
    }
    this.categories.push(category);
    return true;
  }

  addCheckItem(checkItem: SEOCheckItem): boolean {
    if (this.getCheckItemById(checkItem.id)) {
      return false; // 이미 존재하는 ID
    }
    
    // 카테고리 존재 확인
    if (!this.getCategoryById(checkItem.categoryId)) {
      return false; // 존재하지 않는 카테고리
    }
    
    this.checkItems.push(checkItem);
    return true;
  }

  removeCategory(categoryId: string): boolean {
    const index = this.categories.findIndex(cat => cat.id === categoryId);
    if (index !== -1) {
      // 해당 카테고리의 체크 항목들도 제거
      this.checkItems = this.checkItems.filter(item => item.categoryId !== categoryId);
      this.categories.splice(index, 1);
      return true;
    }
    return false;
  }

  removeCheckItem(checkItemId: string): boolean {
    const index = this.checkItems.findIndex(item => item.id === checkItemId);
    if (index !== -1) {
      this.checkItems.splice(index, 1);
      return true;
    }
    return false;
  }

  // 설정 유효성 검사
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 카테고리 검사
    if (this.categories.length === 0) {
      errors.push('카테고리가 없습니다.');
    }

    // 카테고리 ID 중복 검사
    const categoryIds = this.categories.map(cat => cat.id);
    const duplicateCategoryIds = categoryIds.filter((id, index) => categoryIds.indexOf(id) !== index);
    if (duplicateCategoryIds.length > 0) {
      errors.push(`중복된 카테고리 ID: ${duplicateCategoryIds.join(', ')}`);
    }

    // 체크 항목 검사
    if (this.checkItems.length === 0) {
      errors.push('체크 항목이 없습니다.');
    }

    // 체크 항목 ID 중복 검사
    const checkItemIds = this.checkItems.map(item => item.id);
    const duplicateCheckItemIds = checkItemIds.filter((id, index) => checkItemIds.indexOf(id) !== index);
    if (duplicateCheckItemIds.length > 0) {
      errors.push(`중복된 체크 항목 ID: ${duplicateCheckItemIds.join(', ')}`);
    }

    // 체크 항목의 카테고리 존재 검사
    const invalidCategoryRefs = this.checkItems.filter(item => 
      !this.getCategoryById(item.categoryId)
    );
    if (invalidCategoryRefs.length > 0) {
      errors.push(`존재하지 않는 카테고리를 참조하는 체크 항목: ${invalidCategoryRefs.map(item => item.id).join(', ')}`);
    }

    // 가중치 검사
    const invalidWeights = this.categories.filter(cat => cat.weight <= 0);
    if (invalidWeights.length > 0) {
      errors.push(`잘못된 카테고리 가중치: ${invalidWeights.map(cat => cat.id).join(', ')}`);
    }

    const invalidItemWeights = this.checkItems.filter(item => item.weight <= 0);
    if (invalidItemWeights.length > 0) {
      errors.push(`잘못된 체크 항목 가중치: ${invalidItemWeights.map(item => item.id).join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 설정 통계
  getConfigStats() {
    const categoryStats = this.categories.map(category => ({
      id: category.id,
      name: category.name,
      weight: category.weight,
      checkItemCount: this.getCheckItemsByCategory(category.id).length,
      totalWeight: this.getCheckItemsByCategory(category.id).reduce((sum, item) => sum + item.weight, 0)
    }));

    return {
      totalCategories: this.categories.length,
      totalCheckItems: this.checkItems.length,
      totalWeight: this.categories.reduce((sum, cat) => sum + cat.weight, 0),
      categoryStats
    };
  }

  // 설정 내보내기/가져오기
  exportConfig() {
    return {
      categories: this.categories,
      checkItems: this.checkItems,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  importConfig(config: { categories: SEOCategory[]; checkItems: SEOCheckItem[] }): boolean {
    try {
      // 임시로 설정 적용해서 유효성 검사
      const originalCategories = this.categories;
      const originalCheckItems = this.checkItems;

      this.categories = config.categories;
      this.checkItems = config.checkItems;

      const validation = this.validateConfig();
      if (!validation.isValid) {
        // 유효하지 않으면 원래 설정으로 복원
        this.categories = originalCategories;
        this.checkItems = originalCheckItems;
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // 설정 초기화
  resetConfig() {
    this.loadConfig();
  }
} 