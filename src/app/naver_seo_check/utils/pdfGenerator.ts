import html2canvas from 'html2canvas';
import { SEOAnalysisResult, CheckResult } from '../types';

// HTML 리포트 템플릿 생성 함수
const createReportHTML = (data: SEOAnalysisResult): string => {
  const date = new Date().toLocaleDateString('ko-KR');
  
  // 카테고리명을 한글로 변환
  const categoryNames: { [key: string]: string } = {
    'basic_meta': '기본 메타데이터',
    'search_engine_collection': '검색엔진 수집',
    'structured_data': '구조화된 데이터',
    'content_quality': '콘텐츠 품질',
    'technical_optimization': '기술적 최적화',
    'mobile_performance': '모바일 성능',
    'page_speed': '페이지 속도',
    'security': '보안',
    'accessibility': '접근성',
    'social_media': '소셜미디어'
  };

  // 통계 계산
  const totalItems = data.categoryResults?.reduce((sum, cat) => sum + cat.checkResults.length, 0) || 0;
  const passedItems = data.categoryResults?.reduce((sum, cat) => sum + cat.checkResults.filter(r => r.status === 'pass').length, 0) || 0;
  const failedItems = totalItems - passedItems;
  const criticalIssues = data.improvements?.filter(imp => imp.priority === 'high').length || 0;

  // 개별 검사 결과 렌더링 함수
  const renderCheckResults = (checkResults: CheckResult[]) => {
    return checkResults.map(result => {
      const statusIcon = result.status === 'pass' ? '✅' : '❌';
      const statusClass = result.status === 'pass' ? 'status-pass' : 'status-fail';
      const statusText = result.status === 'pass' ? '통과' : '실패';
      
      return `
        <div class="check-item">
          <div class="check-header">
            <span class="check-icon">${statusIcon}</span>
            <span class="check-status ${statusClass}">${statusText}</span>
            <span class="check-score">${result.score}/${result.maxScore}점</span>
          </div>
          <div class="check-message">${result.message}</div>
          ${result.details ? `<div class="check-details">세부사항: ${JSON.stringify(result.details).substring(0, 100)}...</div>` : ''}
        </div>
      `;
    }).join('');
  };

  return `
    <div class="seo-report-container" style="
      font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: white;
      color: #333;
      line-height: 1.6;
      width: 1200px;
      padding: 40px;
      margin: 0;
      box-sizing: border-box;
    ">
      <!-- 헤더 -->
      <div style="
        background: linear-gradient(135deg, #03C75A 0%, #00B050 100%);
        color: white;
        padding: 40px;
        border-radius: 12px;
        text-align: left;
        margin-bottom: 30px;
      ">
        <h1 style="
          font-size: 36px;
          font-weight: 700;
          margin: 0 0 10px 0;
          letter-spacing: -0.5px;
        ">AWEKERS 네이버 SEO 보고서</h1>
        <p style="
          font-size: 16px;
          opacity: 0.9;
          font-weight: 400;
          margin: 0;
        ">웹사이트 검색엔진 최적화 완전 분석</p>
      </div>

      <!-- 기본 정보 -->
      <div style="
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 25px;
        margin-bottom: 30px;
      ">
        <div style="margin-bottom: 12px;">
          <span style="font-weight: 600; color: #495057; font-size: 14px;">분석 대상 웹사이트:</span><br>
          <span style="color: #007bff; font-size: 14px; font-weight: 500;">${data.url}</span>
        </div>
        <div style="margin-bottom: 12px;">
          <span style="font-weight: 600; color: #495057; font-size: 14px;">분석 일시:</span><br>
          <span style="color: #666; font-size: 14px;">${date}</span>
        </div>
        <div>
          <span style="font-weight: 600; color: #495057; font-size: 14px;">크롤링 상태:</span><br>
          <span style="color: #666; font-size: 14px;">HTTP ${data.crawledData?.statusCode || 'N/A'} | ${data.crawledData?.loadTime || 0}ms</span>
        </div>
      </div>

      <!-- 종합 점수 카드 -->
      <div style="
        background: linear-gradient(135deg, #03C75A 0%, #00B050 100%);
        color: white;
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        margin-bottom: 30px;
        position: relative;
        overflow: hidden;
      ">
        <div style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        ">
          <div>
            <div style="font-size: 56px; font-weight: 700; line-height: 1; margin-bottom: 10px;">
              ${data.totalScore || 0}점
            </div>
            <div style="font-size: 24px; font-weight: 600;">
              등급: ${data.grade || 'N/A'}
            </div>
          </div>
          <div style="text-align: right; opacity: 0.9;">
            <h3 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">SEO 종합 점수</h3>
            <p style="font-size: 16px; font-weight: 400; margin: 0;">(100점 만점)</p>
          </div>
        </div>
      </div>

      <!-- 통계 요약 -->
      <div style="
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 40px;
      ">
        <div style="
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 25px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        ">
          <div style="font-size: 32px; font-weight: 700; color: #03C75A; margin-bottom: 8px;">
            ${totalItems}
          </div>
          <div style="font-size: 14px; color: #666; font-weight: 500;">
            총 검사 항목
          </div>
        </div>
        <div style="
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 25px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        ">
          <div style="font-size: 32px; font-weight: 700; color: #28a745; margin-bottom: 8px;">
            ${passedItems}
          </div>
          <div style="font-size: 14px; color: #666; font-weight: 500;">
            통과 항목
          </div>
        </div>
        <div style="
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 25px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        ">
          <div style="font-size: 32px; font-weight: 700; color: #dc3545; margin-bottom: 8px;">
            ${failedItems}
          </div>
          <div style="font-size: 14px; color: #666; font-weight: 500;">
            실패 항목
          </div>
        </div>
        <div style="
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 25px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        ">
          <div style="font-size: 32px; font-weight: 700; color: #ffc107; margin-bottom: 8px;">
            ${criticalIssues}
          </div>
          <div style="font-size: 14px; color: #666; font-weight: 500;">
            중요 이슈
          </div>
        </div>
      </div>

      ${data.categoryResults && data.categoryResults.length > 0 ? `
      <!-- 카테고리별 분석 결과 -->
      <div>
        <h2 style="
          font-size: 24px;
          font-weight: 700;
          color: #03C75A;
          margin: 0 0 25px 0;
          padding-bottom: 10px;
          border-bottom: 3px solid #03C75A;
        ">카테고리별 분석 결과</h2>
        
        <!-- 요약 테이블 -->
        <table style="
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
        ">
          <thead>
            <tr style="background: #03C75A; color: white;">
              <th style="padding: 15px; text-align: left; font-weight: 600;">카테고리</th>
              <th style="padding: 15px; text-align: center; font-weight: 600;">점수</th>
              <th style="padding: 15px; text-align: center; font-weight: 600;">등급</th>
              <th style="padding: 15px; text-align: center; font-weight: 600;">달성률</th>
              <th style="padding: 15px; text-align: center; font-weight: 600;">검사 항목</th>
            </tr>
          </thead>
          <tbody>
            ${data.categoryResults.map((category, index) => {
              const koreanName = categoryNames[category.categoryId] || category.categoryId;
              const gradeColor = category.grade === 'A' ? '#28a745' : 
                                category.grade === 'B' ? '#17a2b8' :
                                category.grade === 'C' ? '#ffc107' :
                                category.grade === 'D' ? '#fd7e14' : '#dc3545';
              return `
                <tr style="background-color: ${index % 2 === 0 ? '#f8f9fa' : 'white'};">
                  <td style="padding: 15px; border-bottom: 1px solid #e9ecef; font-weight: 500;">${koreanName}</td>
                  <td style="padding: 15px; text-align: center; border-bottom: 1px solid #e9ecef;">${category.score}/${category.maxScore}</td>
                  <td style="padding: 15px; text-align: center; border-bottom: 1px solid #e9ecef;">
                    <span style="color: ${gradeColor}; font-weight: 600;">${category.grade}</span>
                  </td>
                  <td style="padding: 15px; text-align: center; border-bottom: 1px solid #e9ecef;">${category.percentage}%</td>
                  <td style="padding: 15px; text-align: center; border-bottom: 1px solid #e9ecef;">${category.checkResults.length}개</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- 상세 검사 결과 -->
        <h3 style="
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin: 40px 0 25px 0;
          padding-left: 12px;
          border-left: 4px solid #03C75A;
        ">상세 검사 결과</h3>

        ${data.categoryResults.map(category => {
          const koreanName = categoryNames[category.categoryId] || category.categoryId;
          return `
            <div style="
              margin-bottom: 40px;
              border: 1px solid #e9ecef;
              border-radius: 8px;
              overflow: hidden;
            ">
              <div style="
                background: #f8f9fa;
                padding: 20px;
                border-bottom: 1px solid #e9ecef;
              ">
                <div style="font-size: 20px; font-weight: 600; color: #333; margin-bottom: 8px;">
                  ${koreanName}
                </div>
                <div style="font-size: 14px; color: #666;">
                  ${category.score}/${category.maxScore}점 (${category.percentage}%) - 등급: ${category.grade}
                </div>
              </div>
              <div style="padding: 25px;">
                ${renderCheckResults(category.checkResults)}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      ` : ''}

      ${data.crawledData ? `
      <!-- 기술적 세부사항 -->
      <div style="margin-top: 40px;">
        <h2 style="
          font-size: 24px;
          font-weight: 700;
          color: #03C75A;
          margin: 0 0 25px 0;
          padding-bottom: 10px;
          border-bottom: 3px solid #03C75A;
        ">기술적 세부사항</h2>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px;">
          <div style="
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 25px;
          ">
            <h4 style="
              font-size: 18px;
              font-weight: 600;
              color: #333;
              margin: 0 0 20px 0;
              padding-bottom: 10px;
              border-bottom: 1px solid #e9ecef;
            ">페이지 정보</h4>
            <div style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; display: flex; justify-content: space-between;">
              <span style="font-size: 14px; color: #666;">페이지 크기</span>
              <span style="font-size: 14px; font-weight: 500; color: #333;">${Math.round((data.crawledData.size || 0) / 1024)}KB</span>
            </div>
            <div style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; display: flex; justify-content: space-between;">
              <span style="font-size: 14px; color: #666;">로딩 시간</span>
              <span style="font-size: 14px; font-weight: 500; color: ${(data.crawledData.loadTime || 0) < 3000 ? '#28a745' : '#dc3545'};">${data.crawledData.loadTime || 0}ms</span>
            </div>
            <div style="padding: 10px 0; display: flex; justify-content: space-between;">
              <span style="font-size: 14px; color: #666;">상태 코드</span>
              <span style="font-size: 14px; font-weight: 500; color: ${data.crawledData.statusCode === 200 ? '#28a745' : '#dc3545'};">HTTP ${data.crawledData.statusCode}</span>
            </div>
          </div>
          <div style="
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 25px;
          ">
            <h4 style="
              font-size: 18px;
              font-weight: 600;
              color: #333;
              margin: 0 0 20px 0;
              padding-bottom: 10px;
              border-bottom: 1px solid #e9ecef;
            ">보안 및 접근성</h4>
            <div style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; display: flex; justify-content: space-between;">
              <span style="font-size: 14px; color: #666;">HTTPS</span>
              <span style="font-size: 14px; font-weight: 500; color: ${data.url.startsWith('https') ? '#28a745' : '#dc3545'};">${data.url.startsWith('https') ? '활성화' : '비활성화'}</span>
            </div>
            <div style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; display: flex; justify-content: space-between;">
              <span style="font-size: 14px; color: #666;">Robots.txt</span>
              <span style="font-size: 14px; font-weight: 500; color: ${data.crawledData.robotsTxt ? '#28a745' : '#dc3545'};">${data.crawledData.robotsTxt ? '존재' : '없음'}</span>
            </div>
            <div style="padding: 10px 0; display: flex; justify-content: space-between;">
              <span style="font-size: 14px; color: #666;">Sitemap.xml</span>
              <span style="font-size: 14px; font-weight: 500; color: ${data.crawledData.sitemapXml ? '#28a745' : '#dc3545'};">${data.crawledData.sitemapXml ? '존재' : '없음'}</span>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      ${data.improvements && data.improvements.length > 0 ? `
      <!-- 개선 제안사항 -->
      <div style="margin-top: 40px;">
        <h2 style="
          font-size: 24px;
          font-weight: 700;
          color: #03C75A;
          margin: 0 0 25px 0;
          padding-bottom: 10px;
          border-bottom: 3px solid #03C75A;
        ">상세 개선 제안사항</h2>
        
        ${data.improvements.map((improvement, index) => {
          const priorityColors = {
            high: { bg: '#ffebee', color: '#c62828', border: '#ef5350' },
            medium: { bg: '#fff3e0', color: '#ef6c00', border: '#ff9800' },
            low: { bg: '#e3f2fd', color: '#1565c0', border: '#2196f3' }
          };
          const colors = priorityColors[improvement.priority] || priorityColors.low;
          const priorityText = improvement.priority === 'high' ? '높음' : 
                              improvement.priority === 'medium' ? '보통' : '낮음';
          
          return `
            <div style="
              background: #f8f9fa;
              border-left: 4px solid ${colors.border};
              padding: 20px 25px;
              margin-bottom: 20px;
              border-radius: 0 6px 6px 0;
            ">
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="
                  padding: 4px 12px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 600;
                  margin-right: 15px;
                  background: ${colors.bg};
                  color: ${colors.color};
                ">${priorityText}</span>
                <span style="font-weight: 600; color: #333; font-size: 16px;">
                  ${index + 1}. ${improvement.title}
                </span>
              </div>
              ${improvement.description ? `
                <div style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 12px;">
                  ${improvement.description}
                </div>
              ` : ''}
              ${improvement.solution ? `
                <div style="
                  color: #555;
                  font-size: 13px;
                  background: white;
                  padding: 15px;
                  border-radius: 4px;
                  border: 1px solid #e9ecef;
                ">
                  <strong>해결 방법:</strong> ${improvement.solution}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
      ` : ''}

      <!-- 푸터 -->
      <div style="
        margin-top: 50px;
        padding-top: 25px;
        border-top: 1px solid #e9ecef;
        text-align: center;
        color: #6c757d;
        font-size: 14px;
      ">
        NAVER SEO 종합 분석 리포트 | 생성일: ${date} | 총 ${totalItems}개 항목 검사
        <span style="color: #03C75A; font-weight: 600; margin-left: 15px;">NAVER SEO</span>
      </div>
    </div>

    <style>
      .check-item {
        margin-bottom: 20px;
        padding: 18px;
        background: white;
        border-radius: 6px;
        border-left: 4px solid #e9ecef;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }

      .check-item:last-child {
        margin-bottom: 0;
      }

      .check-header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        gap: 12px;
      }

      .check-icon {
        font-size: 18px;
      }

      .check-status {
        font-weight: 600;
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 12px;
      }

      .status-pass {
        background: #d4edda;
        color: #155724;
      }

      .status-fail {
        background: #f8d7da;
        color: #721c24;
      }

      .check-score {
        font-weight: 600;
        color: #03C75A;
        font-size: 13px;
      }

      .check-message {
        color: #333;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 8px;
      }

      .check-details {
        margin-top: 10px;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 4px;
        font-size: 12px;
        color: #666;
        font-family: 'Monaco', 'Menlo', monospace;
      }
    </style>
  `;
};

// 검증된 html2canvas 이미지 생성 및 다운로드 함수
export const generateSEOReportImage = async (data: SEOAnalysisResult) => {
  try {
    // 1. HTML 컨테이너 생성
    const reportHTML = createReportHTML(data);
    
    // 2. 임시 컨테이너를 DOM에 추가 (화면 밖에 위치)
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = reportHTML;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.zIndex = '-1000';
    
    document.body.appendChild(tempContainer);
    
    // 3. 폰트 로딩 대기 (검증된 방법)
    await new Promise(resolve => {
      // Google Fonts 로딩 확인
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(resolve);
      } else {
        // fallback: 2초 대기
        setTimeout(resolve, 2000);
      }
    });
    
    const reportElement = tempContainer.querySelector('.seo-report-container') as HTMLElement;
    
    if (!reportElement) {
      throw new Error('리포트 엘리먼트를 찾을 수 없습니다.');
    }

    // 4. html2canvas로 고해상도 이미지 생성 (검증된 설정)
    const canvas = await html2canvas(reportElement, {
      scale: 2, // 고해상도 (Retina 대응)
      useCORS: true, // CORS 이슈 해결
      allowTaint: false, // 보안 강화
      backgroundColor: '#ffffff', // 흰색 배경
      width: 1200, // 고정 너비
      height: reportElement.scrollHeight, // 동적 높이
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200,
      windowHeight: reportElement.scrollHeight,
      // 추가 최적화 옵션
      imageTimeout: 15000, // 이미지 로딩 타임아웃
      removeContainer: true, // 컨테이너 자동 제거
      logging: false, // 로그 비활성화
      onclone: (clonedDoc) => {
        // 클론된 문서에서 폰트 확실히 적용
        const style = clonedDoc.createElement('style');
        style.textContent = `
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
          * { font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif !important; }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    // 5. 임시 엘리먼트 제거
    document.body.removeChild(tempContainer);

    // 6. PNG 이미지로 변환 (검증된 방법)
    const imageDataUrl = canvas.toDataURL('image/png', 1.0); // 최고 품질

    // 7. 파일명 생성
    const domain = data.url ? new URL(data.url).hostname.replace('www.', '') : 'unknown';
    const timestamp = new Date().toISOString()
      .replace(/:/g, '-')
      .replace(/\./g, '-')
      .split('T')[0];
    const filename = `AWEKERS_네이버_SEO_보고서_${domain}_${timestamp}.png`;

    // 8. 다운로드 실행 (검증된 방법 - Kent C. Dodds 스타일)
    const downloadLink = document.createElement('a');
    downloadLink.href = imageDataUrl;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // 9. 메모리 정리
    canvas.remove();

    return { 
      success: true, 
      filename,
      imageDataUrl, // 필요시 미리보기용
      dimensions: {
        width: canvas.width,
        height: canvas.height
      }
    };

  } catch (error) {
    console.error('SEO 리포트 이미지 생성 오류:', error);
    throw new Error(`이미지 생성 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};

// 기존 PDF 함수명 유지 (호환성)
export const generateSEOReportPDF = generateSEOReportImage; 