const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType,
  PageOrientation, PageBreak, Footer, PageNumber,
} = require('docx');
const fs = require('fs');

const FONT = '맑은 고딕';
const CONTENT_W = 14678;
const COLS = [1100, 2500, 5578, 1600, 2400, 1500];

const HDR_BG = 'D9E2F3';
const PHASE_BG = 'EDEDED';
const MILE_BG = 'FFF2CC';
const NEW_BG = 'E2F0D9';

const p = (text, o = {}) => new Paragraph({
  spacing: { before: o.before ?? 60, after: o.after ?? 60, line: 280 },
  alignment: o.align, indent: o.indent,
  children: [new TextRun({ text, bold: o.bold, size: o.size ?? 20, color: o.color, italics: o.italics })],
});
const h1 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_1, spacing: { before: 320, after: 160 },
  children: [new TextRun({ text: t, bold: true, size: 30, color: '1F3864', font: FONT })],
});
const h2 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 },
  children: [new TextRun({ text: t, bold: true, size: 24, color: '2E5496', font: FONT })],
});
const bullet = (t, lvl = 0) => new Paragraph({
  numbering: { reference: 'bl', level: lvl }, spacing: { before: 40, after: 40, line: 280 },
  children: [new TextRun({ text: t, size: 20 })],
});
const cell = (text, o = {}) => new TableCell({
  width: { size: o.w, type: WidthType.DXA }, columnSpan: o.span,
  shading: o.bg ? { type: ShadingType.CLEAR, fill: o.bg, color: 'auto' } : undefined,
  margins: { top: 60, bottom: 60, left: 100, right: 100 }, verticalAlign: 'center',
  children: String(text).split('\n').map((line) => new Paragraph({
    spacing: { before: 20, after: 20, line: 260 }, alignment: o.align,
    children: [new TextRun({ text: line, bold: o.bold, size: o.size ?? 18, color: o.color })],
  })),
});

function taskTable(rows) {
  const trs = rows.map((r) => {
    if (r.type === 'head') {
      return new TableRow({
        tableHeader: true,
        children: ['작업 ID', '작업명', '작업 내용', '담당', '산출물', '예상 세션']
          .map((t, i) => cell(t, { w: COLS[i], bg: HDR_BG, bold: true, align: AlignmentType.CENTER })),
      });
    }
    if (r.type === 'phase') return new TableRow({ children: [cell(r.label, { w: CONTENT_W, span: 6, bg: PHASE_BG, bold: true, size: 19 })] });
    if (r.type === 'mile') return new TableRow({ children: [cell(r.label, { w: CONTENT_W, span: 6, bg: MILE_BG, bold: true, size: 19, color: '833C00' })] });
    return new TableRow({
      children: r.c.map((t, i) => cell(t, {
        w: COLS[i],
        bg: r.isNew ? NEW_BG : undefined,
        align: (i === 0 || i === 3 || i === 5) ? AlignmentType.CENTER : undefined,
        bold: i === 0,
      })),
    });
  });
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: COLS, rows: trs });
}

function simpleTable(header, rows, widths) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: header.map((t, i) => cell(t, { w: widths[i], bg: HDR_BG, bold: true, align: AlignmentType.CENTER })) }),
      ...rows.map((r) => new TableRow({ children: r.map((t, i) => cell(t, { w: widths[i], size: 19, align: (t === '○' || t === '✕' || t === '△') ? AlignmentType.CENTER : undefined })) })),
    ],
  });
}

/* ======================= WBS 데이터 ======================= */
const N = true; // 신규/변경 작업 표시

const P0 = [
  { type: 'phase', label: 'Phase 0 — 준비 : 계정·환경·기술 결정  (예상 4.5 세션)' },
  { type: 'task', c: ['P0-1', 'Anthropic API 키 발급', 'console.anthropic.com 가입 → 결제수단 등록 → API 키 생성. 이 키가 SDVC 서버가 Claude를 호출하는 "열쇠"이며 사용량만큼 요금이 청구된다.', '사용자', 'API 키 (사용자 보관)', '0.5'] },
  { type: 'task', c: ['P0-2', 'Vercel 계정 생성·GitHub 연결', 'vercel.com에 GitHub 계정으로 가입 → 저장소 접근 권한 허용. push하면 자동 배포되는 통로가 열린다.', '사용자', 'Vercel 계정', '0.5'] },
  { type: 'task', c: ['P0-3', 'Supabase 계정·프로젝트 생성', 'supabase.com 가입 → 새 프로젝트 생성(리전 서울 권장). 회원·프로젝트 정보를 담을 DB와 파일 저장소가 여기 생긴다.', '사용자', 'Supabase 프로젝트', '0.5'] },
  { type: 'task', c: ['P0-4', '로컬 개발 환경 점검', 'Node.js 20 이상 설치 여부 확인(없으면 설치). Git은 설치 확인됨.', '공동', 'node -v 실행 출력', '0.5'] },
  { type: 'task', c: ['P0-5', '기술 스택 확정 ★G1', '① 백엔드 언어 : TypeScript 단일 vs Python 분리  ② Claude 호출 방식 : Claude API 직접 vs Claude Agent SDK  ③ 저장소 : 신규 sdvc-app 분리(권장) vs 기존 sdvc 안에 추가', '공동 ★승인', '결정 기록(context.md)', '1'] },
  { type: 'task', isNew: N, c: ['P0-6', '역할·등급·권한 모델 확정 ★G2', '3계층(서버관리자·개발자·사용자)과 각 계층의 등급, 기능별 권한 매트릭스를 확정한다. 이 문서 2장이 초안이며, 확정 결과가 P2-4 DB 설계의 입력이 된다.', '공동 ★승인', '권한 매트릭스 확정본', '1'] },
  { type: 'task', c: ['P0-7', '앱 저장소 생성', 'P0-5 결정에 따라 GitHub에 앱 전용 private 저장소 생성. 방법론·문서 저장소(sdvc)와 코드 저장소를 분리해 관리를 단순화.', 'Claude', 'GitHub 저장소', '0.5'] },
];

const P1 = [
  { type: 'phase', label: 'Phase 1 — 명세·계획 문서화 : SDVC 방법론 블록 1~4  (예상 5.5 세션)' },
  { type: 'task', c: ['P1-1', 'Specify — 명세 작성', '"무엇을 만드는가"를 User Story·기능요구사항(FR)·성공기준(SC)으로 확정. 3계층 역할별로 User Story를 나눠 쓴다.', '공동', 'docs/spec.md', '1'] },
  { type: 'task', c: ['P1-2', 'Clarify — 애매한 점 확정', 'AI가 최대 5개 질문 + 예시 답안 제시. 예 : 개발자 1인당 프로젝트 개수 / 무료 체험 일수 / 산출물 공개 범위 / 구독 해지 시 산출물 처리.', '공동', 'spec.md Clarifications 절', '1'] },
  { type: 'task', c: ['P1-3', 'Plan — 기술 설계 ★G3', '폴더 구조, DB 표 구성, 화면 목록, 서버 기능(API) 목록, 데이터 흐름을 초보자 눈높이 용어로 정리해 제시하고 승인받는다.', 'Claude 주도 ★승인', 'docs/plan.md', '1.5'] },
  { type: 'task', c: ['P1-4', 'Tasks — 작업 분해 ★G4', '이 WBS를 코드 수준으로 정밀화. 기능 하나가 화면까지 완결되는 "버티컬 슬라이스" 단위로 쪼개 순서를 확정하고 승인받는다.', 'Claude 주도 ★승인', 'docs/tasks.md', '1'] },
  { type: 'task', c: ['P1-5', 'Analyze — 모순 점검', 'spec·plan·tasks 세 문서 사이의 누락·충돌을 점검하고 보고. 문제가 있으면 수정 승인 후 반영.', 'Claude', '점검 보고', '0.5'] },
  { type: 'task', isNew: N, c: ['P1-6', '권한 매트릭스 문서화', 'P0-6에서 확정한 역할·등급·권한을 "기능 × 역할" 표로 문서화. 이후 모든 화면·API는 이 표를 근거로 접근을 통제한다.', 'Claude', 'docs/permissions.md', '0.5'] },
];

const P2 = [
  { type: 'phase', label: 'Phase 2 — 슬라이스 1 : 로그인·인증·권한 체계  [MVP]  (예상 8 세션)' },
  { type: 'task', c: ['P2-1', 'Next.js 프로젝트 생성', '앱 뼈대 생성, 폴더 구조 세팅, 저장소에 최초 커밋.', 'Claude', '실행되는 빈 앱', '1'] },
  { type: 'task', c: ['P2-2', 'Vercel 첫 배포', '저장소를 Vercel에 연결하고 push → 자동 배포가 실제로 도는지 확인. 임시 주소 확보.', '공동', '접속 가능한 URL', '0.5'] },
  { type: 'task', c: ['P2-3', 'Supabase 연결·환경변수 틀', 'Claude가 빈 .env.example 틀을 만들고, 실제 값은 사용자가 로컬·Vercel 양쪽에 직접 입력(헌장 보안 규칙).', '공동 (값 입력=사용자)', '.env.example, 연결 확인', '0.5'] },
  { type: 'task', isNew: N, c: ['P2-4', '역할·등급·권한 DB 설계', '3계층 역할, 계층별 등급, 기능별 권한을 담는 표를 설계. 한 계정이 여러 역할을 겸할 수 있는 구조로 만든다(개발자이면서 남의 산출물의 사용자인 경우).', 'Claude', 'DB 표(roles·grades·permissions)', '1'] },
  { type: 'task', c: ['P2-5', '개발자 회원가입·로그인 (TDD)', '실패 테스트(RED) → 이메일 가입·로그인 구현(GREEN) → 정리(REFACTOR). 가입 시 기본 등급은 "체험".', 'Claude', '테스트 + 인증 코드', '1.5'] },
  { type: 'task', isNew: N, c: ['P2-6', '권한 검사 공통 모듈 (TDD)', '모든 요청마다 서버가 "이 사람이 이 기능을 쓸 자격이 있는가"를 판정하는 공통 장치. 화면에서 버튼을 숨기는 것만으로는 막을 수 없으므로 반드시 서버에서 검사한다.', 'Claude', '권한 검사 모듈 + 테스트', '1'] },
  { type: 'task', isNew: N, c: ['P2-7', '서버관리자 계정·2단계 인증', '서버관리자는 일반 가입 경로로 만들 수 없게 하고, 별도 절차로 생성. 계정 탈취 시 피해가 크므로 2단계 인증을 적용한다.', 'Claude', '관리자 계정 체계', '1'] },
  { type: 'task', c: ['P2-8', '로그인 화면·대시보드', '가입·로그인·로그아웃 화면과, 로그인해야만 보이는 대시보드. 역할에 따라 보이는 메뉴가 달라진다.', 'Claude', '화면 3종', '1'] },
  { type: 'task', c: ['P2-9', '슬라이스 1 검증', '브라우저에서 가입 → 로그인 → 대시보드 → 로그아웃, 그리고 권한 없는 주소 직접 입력 시 차단되는지까지 확인.', '공동', '실행 증거', '0.5'] },
];

const P3 = [
  { type: 'phase', label: 'Phase 3 — 슬라이스 2 : SDVC 엔진(서버 API)  [MVP · 최대 난이도]  (예상 8.5 세션)' },
  { type: 'task', c: ['P3-1', 'ANTHROPIC_API_KEY 설정', 'Claude는 빈 틀만 만들고, 사용자가 로컬 .env와 Vercel 환경변수에 실제 키를 직접 입력. AI는 절대 값을 채우지 않음(헌장 규칙).', '사용자 (틀=Claude)', '환경변수 설정 완료', '0.5'] },
  { type: 'task', c: ['P3-2', '대화 API 뼈대 (TDD)', '/api/chat 엔드포인트 제작. 사용자의 말을 받아 Claude에 전달하고 답을 돌려주는 최소 기능부터 테스트와 함께 구현.', 'Claude', 'API + 테스트', '1.5'] },
  { type: 'task', c: ['P3-3', 'SDVC 진행 대본 이식', '현재 스킬 파일(00-guided-session-script.md)의 5블록 7단계 절차·예시 답안·승인 게이트 규칙을 서버 프롬프트 모듈로 옮긴다. SDVC의 두뇌에 해당하는 핵심 작업.', 'Claude 주도', '프롬프트 모듈', '2'] },
  { type: 'task', c: ['P3-4', '대화 상태 저장', '프로젝트별로 "지금 몇 블록인지, 어떤 문서가 만들어졌는지"를 DB에 저장. 창을 닫았다 와도 이어서 진행되게 한다.', 'Claude', 'DB 표 + 저장 로직', '1.5'] },
  { type: 'task', c: ['P3-5', '채팅 화면', '개발자가 대화하는 화면. 답변이 한 글자씩 흘러나오는 스트리밍 표시 포함.', 'Claude', '채팅 UI', '1.5'] },
  { type: 'task', c: ['P3-6', '승인 게이트 UI', '계획·작업분해 단계에서 "승인 / 수정 요청" 버튼 제공. 승인 전에는 다음 단계로 넘어가지 못하게 서버에서 차단.', 'Claude', '승인 화면', '1'] },
  { type: 'task', c: ['P3-7', '슬라이스 2 검증', '웹에서 "홈페이지 만들고 싶어" 입력 → 헌장·명세·계획까지 실제로 대화가 진행되는지 확인.', '공동', '실행 증거', '0.5'] },
];

const P4 = [
  { type: 'phase', label: 'Phase 4 — 슬라이스 3 : 산출물 생성·저장  [MVP]  (예상 4 세션)' },
  { type: 'task', c: ['P4-1', '저장소(Storage) 준비', 'Supabase Storage 버킷 생성, 프로젝트별 폴더 규칙과 접근 권한 정책 설정(남의 프로젝트를 못 보게).', '공동', '버킷 + 권한 정책', '0.5'] },
  { type: 'task', c: ['P4-2', '프로젝트 메타 표 설계', '프로젝트명·주소이름(slug)·소유 개발자·생성일·공개범위·상태를 저장하는 DB 표.', 'Claude', 'DB 표', '0.5'] },
  { type: 'task', c: ['P4-3', '파일 생성·저장 로직 (TDD)', 'AI가 만들어낸 HTML·CSS·JS를 Storage에 실제 파일로 저장. 덮어쓰기·버전 보관 포함(P7-6 롤백의 토대).', 'Claude', '저장 로직 + 테스트', '1.5'] },
  { type: 'task', c: ['P4-4', '생성 진행 표시 UI', '"파일 3개 중 2개 생성 중…" 같이 진행 상황을 보여주는 화면.', 'Claude', '진행 표시 UI', '1'] },
  { type: 'task', c: ['P4-5', '슬라이스 3 검증', '구현 단계까지 진행한 뒤 Supabase 관리화면에서 파일이 실제로 쌓였는지 확인.', '공동', '실행 증거', '0.5'] },
];

const P5 = [
  { type: 'phase', label: 'Phase 5 — 슬라이스 4 : 산출물 URL 서빙  [MVP 완성]  (예상 6 세션)' },
  { type: 'task', c: ['P5-1', '산출물 서빙 라우트 (TDD)', '/site/{프로젝트이름}/… 주소로 들어오면 Storage에서 해당 파일을 꺼내 보여주는 페이지 1개. 프로젝트마다 만드는 게 아니라 이 하나가 전부를 처리한다.', 'Claude', '라우트 + 테스트', '1.5'] },
  { type: 'task', c: ['P5-2', '파일 형식·자산 처리', 'CSS·JS·이미지가 깨지지 않고 불러와지도록 파일 형식(MIME) 처리와 경로 보정.', 'Claude', '처리 로직', '1'] },
  { type: 'task', isNew: N, c: ['P5-3', '산출물 공개범위 설정 (사용자 등급 반영)', '비공개(개발자 본인만) / 링크 공개(주소를 아는 사람) / 전체 공개 3단계. 이것이 MVP에서의 "사용자 등급"에 해당한다. 기본값은 비공개.', 'Claude', '공개범위 기능 + 테스트', '1'] },
  { type: 'task', c: ['P5-4', '내 프로젝트 목록 화면', '대시보드에서 내가 만든 프로젝트들과 각각의 접속 URL·공개범위를 한눈에 보여준다.', 'Claude', '목록 화면', '1'] },
  { type: 'task', c: ['P5-5', 'MVP 전 구간 검증 (E2E) ★G5', '가입 → 로그인 → "홈페이지 만들어줘" → 대화 → 생성 → URL 접속 → 홈페이지가 실제로 열리는 전 과정을 처음부터 끝까지 실행하고 증거를 남긴다.', '공동 ★승인', '실행 증거·화면 기록', '1.5'] },
  { type: 'mile', label: '★ 마일스톤 1 : MVP 완성 — 서비스가 근본적으로 성립하는지 여기서 판가름 난다. 누적 약 36.5 세션' },
];

const P6 = [
  { type: 'phase', label: 'Phase 6 — 유료화 : 결제·등급 연동  (예상 9 세션)' },
  { type: 'task', c: ['P6-1', 'Stripe 계정·등급별 상품 등록', 'Stripe 가입 후 개발자 등급(체험·기본·프로)에 대응하는 상품과 가격을 등록. 가격 결정은 사용자 몫.', '사용자', 'Stripe 상품·키', '1'] },
  { type: 'task', c: ['P6-2', '구독·등급 DB 설계', '가입일·체험만료일·구독상태·결제고객ID·현재 등급을 담는 표. P8-3 비용 통계에서 쓸 항목까지 미리 반영.', 'Claude', 'DB 표', '0.5'] },
  { type: 'task', c: ['P6-3', '결제 연동 (TDD)', 'Stripe Checkout 연결, 결제 완료 후 처리. 카드정보는 Stripe가 직접 받으므로 우리 서버에 저장하지 않는다.', 'Claude', '결제 코드 + 테스트', '2'] },
  { type: 'task', c: ['P6-4', 'Webhook 처리', '결제 성공·실패·해지 알림을 Stripe로부터 받아 DB 상태를 자동 갱신. 위변조 검증 포함.', 'Claude', 'Webhook 엔드포인트', '1.5'] },
  { type: 'task', isNew: N, c: ['P6-5', '등급 자동 부여·강등 (TDD)', '결제하면 등급이 오르고, 해지·미납이면 자동으로 내려간다. 등급이 바뀌면 P2-6 권한 검사 결과도 즉시 따라 바뀌어야 한다.', 'Claude', '등급 전환 로직 + 테스트', '1'] },
  { type: 'task', c: ['P6-6', '접근 판정 미들웨어 (한도 연동)', '요청마다 서버가 "체험 기간인가 / 결제했는가 / 등급 한도를 넘었는가"를 판정해 통과·차단. 브라우저 쪽 판정은 우회가 쉬우므로 반드시 서버에서 판단.', 'Claude', '판정 로직 + 테스트', '1'] },
  { type: 'task', c: ['P6-7', '요금제·결제 화면', '등급별 가격 안내, 결제하기, 구독 관리(해지·영수증) 화면.', 'Claude', '화면 3종', '1'] },
  { type: 'task', c: ['P6-8', '결제 검증 ★G6', 'Stripe 테스트 모드로 가입 → 체험 → 만료 → 결제 → 등급 상승 → 해지 → 등급 강등 시나리오를 실제로 돌려본다.', '공동 ★승인', '실행 증거', '1'] },
  { type: 'mile', label: '★ 마일스톤 2 : 판매 가능 상태 — 이 시점부터 실제 유료 고객(개발자)을 받을 수 있다. 누적 약 45.5 세션' },
];

const P7 = [
  { type: 'phase', label: 'Phase 7 — 개발자 모드 : 내 프로젝트 유지보수  [신규]  (예상 9 세션)' },
  { type: 'task', isNew: N, c: ['P7-1', '개발자 대시보드', '내 프로젝트 목록, 각 프로젝트의 상태(제작중·배포됨·오류), 이번 달 사용량과 남은 한도를 한 화면에.', 'Claude', '대시보드 화면', '1'] },
  { type: 'task', isNew: N, c: ['P7-2', '버그 등록·추적 (내 프로젝트)', '개발자가 자기 프로젝트의 문제를 등록. 제목·증상·재현 방법·우선순위를 적고, 상태를 접수→수정중→완료로 추적한다. 제작 당시와 제작 후 유지보수 모두에 사용.', 'Claude', '버그 등록·추적 기능', '1.5'] },
  { type: 'task', isNew: N, c: ['P7-3', '버그 → 수정 작업 연결', '등록된 버그를 SDVC 엔진에 넘겨 수정을 착수시킨다. TDD 규율대로 "버그를 재현하는 실패 테스트"를 먼저 만들고 고치는 흐름으로 연결.', 'Claude', '버그-엔진 연동', '2'] },
  { type: 'task', isNew: N, c: ['P7-4', '추가 기능 등록·요청', '이미 만든 프로젝트에 기능을 덧붙이는 흐름. 기능 요청 → 명세 보완(Specify 재실행) → 계획·작업분해 → 구현. 처음부터 다시 만들지 않고 기존 명세를 이어받는 것이 핵심.', 'Claude', '기능 요청 흐름', '1.5'] },
  { type: 'task', isNew: N, c: ['P7-5', 'SDVC 플랫폼 신고 채널', '"내 프로젝트 버그"와 구별되는 별도 창구. 개발자가 SDVC 자체의 오류·불편을 서버관리자에게 신고한다. 두 창구를 섞으면 누가 고쳐야 할 문제인지 혼동된다.', 'Claude', '신고 기능 (→P8-5 연동)', '1'] },
  { type: 'task', isNew: N, c: ['P7-6', '프로젝트 버전 관리·롤백', '수정했다가 더 나빠졌을 때 이전 버전으로 되돌리는 기능. 유지보수 기능을 넣는 이상 반드시 짝으로 있어야 한다(P4-3의 버전 보관이 토대).', 'Claude', '버전 목록·롤백 기능', '1.5'] },
  { type: 'task', isNew: N, c: ['P7-7', '개발자 모드 검증', '버그 등록 → 수정 → 재배포 → 문제 발생 → 롤백까지 실제 시나리오를 끝까지 실행.', '공동', '실행 증거', '0.5'] },
];

const P8 = [
  { type: 'phase', label: 'Phase 8 — 서버관리자 모드 : 플랫폼 운영  (예상 9 세션)' },
  { type: 'task', isNew: N, c: ['P8-1', '서버관리자 등급 체계', '최고관리자(전권) / 운영자(사용자관리·차단, 정책변경 불가) / 지원(읽기 전용, 개인정보 가림). 혼자 운영하더라도 나중에 사람을 쓸 때를 대비해 틀만 잡아둔다.', 'Claude', '관리자 등급 체계', '1'] },
  { type: 'task', isNew: N, c: ['P8-2', '전체 개발자 관리', '가입한 개발자 목록·등급·구독상태 조회, 체험 연장, 계정 정지·해제. 서버관리자의 핵심 운영 기능.', 'Claude', '개발자 관리 화면', '1.5'] },
  { type: 'task', c: ['P8-3', '사용량·비용 대시보드', '개발자별 토큰 사용량과 API 원가를 집계해 보여준다. 적자 구조를 조기에 발견하기 위한 필수 기능.', 'Claude', '통계 화면', '1.5'] },
  { type: 'task', c: ['P8-4', '사용량 상한·비용 방어', '등급별 월 사용 상한 설정, 초과 시 차단. 프롬프트 캐싱·모델 선택으로 원가 절감.', 'Claude', '상한 로직', '1.5'] },
  { type: 'task', isNew: N, c: ['P8-5', '신고 접수함', 'P7-5로 들어온 개발자의 SDVC 신고를 확인·분류·답변하는 화면. 처리 결과는 신고한 개발자에게 표시된다.', 'Claude', '접수함 화면', '1'] },
  { type: 'task', isNew: N, c: ['P8-6', '비상 차단 (Kill Switch)', '문제 있는 산출물이나 계정을 즉시 차단하는 스위치. 산출물이 우리 도메인에서 서빙되므로, 불법·유해 콘텐츠가 올라올 경우 즉시 내릴 수단이 법적으로 필요하다.', 'Claude', '차단 기능', '1'] },
  { type: 'task', isNew: N, c: ['P8-7', '감사 로그', '누가 언제 무엇을 했는지 기록. 특히 서버관리자가 개발자의 데이터를 열람·변경한 내역은 반드시 남긴다. 분쟁이 생겼을 때 유일한 증거가 된다.', 'Claude', '로그 기록·조회', '1'] },
  { type: 'task', isNew: N, c: ['P8-8', '[제외 결정] SDVC 플랫폼 유지보수', 'SDVC 자체의 버그 수정·기능 보완은 웹 관리화면으로 만들지 않고, 내 PC의 Claude Code에서 수행한다. 그 판단 근거와 대체 절차를 문서로 남긴다. → 웹 개발 범위에서 제외하여 기간·비용을 절감.', '공동', '제외 결정 기록', '0.5'] },
];

const P9 = [
  { type: 'phase', label: 'Phase 9 — UI 고도화·정책 기능  (예상 7 세션)' },
  { type: 'task', c: ['P9-1', '방법론 단계별 UI 고도화', '채팅 일변도에서 벗어나 : 명세는 표, 계획은 카드+승인 버튼, 작업분해는 체크리스트 형태로 각 단계 전용 화면 제작.', '공동 (구성 결정)', '화면 개편', '2.5'] },
  { type: 'task', c: ['P9-2', '산출물 내려받기', '만든 프로젝트를 zip으로 내려받는 기능. 결과물을 개발자가 소유한다는 신뢰를 준다.', 'Claude', '다운로드 기능', '1'] },
  { type: 'task', isNew: N, c: ['P9-3', '탈퇴·구독해지 시 산출물 처리', '해지하면 그 개발자의 홈페이지는 즉시 내려가는가, 유예기간을 주는가, 데이터는 언제 삭제하는가. 개인정보보호법상 삭제 의무와도 연결된다. 정책을 먼저 정하고 구현.', '공동 (정책 결정)', '정책 + 구현', '1.5'] },
  { type: 'task', isNew: N, c: ['P9-4', '역할 겸직 처리', '한 계정이 개발자이면서 다른 사람 산출물의 사용자이기도 한 경우를 자연스럽게 처리. 로그인 하나로 역할이 상황에 따라 전환된다.', 'Claude', '겸직 처리 로직', '1'] },
  { type: 'task', c: ['P9-5', '부가기능 검증', 'Phase 7~9에서 추가한 기능들을 통합 점검.', '공동', '실행 증거', '1'] },
];

const P10 = [
  { type: 'phase', label: 'Phase 10 — 출시 준비  (예상 5 세션)' },
  { type: 'task', c: ['P10-1', '도메인 연결', '도메인 구입(사용자) 후 Vercel에 연결. 산출물 주소 형식도 이때 확정된다.', '공동', '정식 주소', '0.5'] },
  { type: 'task', c: ['P10-2', '약관·정책 문서', '이용약관·개인정보처리방침·환불정책 초안 작성. 3계층 역할별 권리·의무와 산출물 소유권을 명시. 최종 검토는 반드시 법률 전문가에게 의뢰.', 'Claude 초안 / 사용자 검토의뢰', '정책 문서 3종', '2'] },
  { type: 'task', c: ['P10-3', 'Anthropic 정책 재확인', '서비스 착수 직전 API 이용약관·브랜딩 규정("Claude Code" 명칭 사용 금지 등)을 다시 확인.', '공동', '확인 기록', '0.5'] },
  { type: 'task', c: ['P10-4', '최종 점검·설계서 ★G7', '전체 테스트 재실행, 운영 매뉴얼 및 설계서(docx) 작성, 실행 증거 정리 후 출시 승인.', 'Claude 주도 ★승인', '설계서·실행 증거', '2'] },
  { type: 'mile', label: '★ 마일스톤 3 : 출시 — 누적 약 75.5 세션' },
];

const ALL = [...P0, ...P1, ...P2, ...P3, ...P4, ...P5, ...P6, ...P7, ...P8, ...P9, ...P10];

/* ======================= 문서 ======================= */
const doc = new Document({
  creator: 'Dr. Brian Park',
  title: 'SDVC 웹서비스 서버 구축 WBS 및 작업일정표 v2.0',
  description: 'SDVC 유료 웹서비스 구축 프로젝트의 작업분해구조와 일정 — 3계층 역할·등급·권한 모델 반영',
  styles: { default: { document: { run: { font: FONT, size: 20 }, paragraph: { spacing: { line: 280 } } } } },
  numbering: {
    config: [{
      reference: 'bl',
      levels: [
        { level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 200 } } } },
        { level: 1, format: 'bullet', text: '–', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 200 } } } },
      ],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'SDVC 서버 구축 WBS v2.0  ·  ', size: 16, color: '808080' }),
                     new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '808080' })],
        })],
      }),
    },
    children: [
      /* 표지 */
      new Paragraph({ spacing: { before: 1100, after: 0 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'SDVC 웹서비스 서버 구축', bold: true, size: 52, color: '1F3864' })] }),
      new Paragraph({ spacing: { before: 120, after: 300 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'WBS(작업분해구조) 및 상세 작업일정표', bold: true, size: 32, color: '2E5496' })] }),
      new Paragraph({ spacing: { before: 0, after: 60 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Structured Document & Vibe Coding — 구조화된 문서가 AI 코딩을 이끈다', size: 20, italics: true, color: '595959' })] }),
      new Paragraph({ spacing: { before: 500, after: 60 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '문서 버전 v2.0     |     작성일 2026-09-08     |     대상 스킬 sdvc-guide v2.1.0', size: 20 })] }),
      new Paragraph({ spacing: { before: 60, after: 60 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '주요 개정 : 3계층 역할·등급·권한 모델 반영, 개발자 모드·서버관리자 모드 신설', size: 20, color: '385723' })] }),
      new Paragraph({ spacing: { before: 60, after: 60 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '작업 시작·재개 명령 : "SDVC서버 구축"     |     중단 명령 : "작업 휴식"', size: 20, bold: true, color: '833C00' })] }),
      new Paragraph({ children: [new PageBreak()] }),

      /* 1. 개요 */
      h1('1. 문서 개요'),
      p('이 문서는 SDVC를 "내 PC의 Claude Code에서 호출하는 방법론"에서 "서버에서 상시 작동하는 유료 웹서비스"로 전환하기 위한 전체 작업 목록과 일정이다.'),
      h2('1.1 v1.0 → v2.0 변경 요약'),
      simpleTable(
        ['구분', 'v1.0 (2026-09-07)', 'v2.0 (이 문서)'],
        [
          ['역할 모델', '2계층 (고객 / 운영자)', '3계층 (서버관리자 / 개발자 / 사용자) + 계층별 등급·권한'],
          ['Phase 수', '9개', '11개 — 개발자 모드·서버관리자 모드를 별도 Phase로 신설'],
          ['작업 수', '51개', '71개 (신규 20개, 표에서 연두색 배경으로 표시)'],
          ['승인 게이트', '6개', '7개 — 역할·권한 모델 확정(G2) 추가'],
          ['총 규모', '53 세션', '75.5 세션'],
          ['SDVC 자체 유지보수', '미정', '웹 화면 제외 — 내 PC의 Claude Code로 수행 (P8-8)'],
          ['산출물 회원기능', '언급 없음', 'MVP 제외 — 공개범위 3단계로 대체 (P5-3)'],
        ],
        [2200, 5200, 7278]
      ),
      p(''),
      h2('1.2 이 문서를 읽는 법'),
      bullet('작업 ID는 Phase 번호 + 순번이다. 예 : P7-3 은 Phase 7의 세 번째 작업.'),
      bullet('상세 WBS 표에서 연두색 배경 행은 v2.0에서 새로 추가되거나 크게 바뀐 작업이다.'),
      bullet('"담당"은 Claude(코드로 처리) / 사용자(대신할 수 없는 일) / 공동(함께 결정·확인)으로 구분한다.'),
      bullet('★G번호는 승인 게이트다. 사용자의 명시적 승인 없이는 다음으로 넘어가지 않는다.'),
      bullet('"예상 세션"은 1회 대화(약 1~2시간)를 1세션으로 본 추정치다.'),
      new Paragraph({ children: [new PageBreak()] }),

      /* 2. 역할 모델 */
      h1('2. 역할·등급·권한 모델'),
      h2('2.1 기본 구조 — 3계층'),
      p('이 서비스에는 성격이 완전히 다른 세 종류의 사람이 있다. 핵심은 "사용자"가 SDVC의 고객이 아니라 고객의 고객이라는 점이다.'),
      simpleTable(
        ['계층', '역할', '하는 일', 'SDVC 입장에서', '접속하는 곳'],
        [
          ['1', '서버관리자', 'SDVC 플랫폼 전체 운영 — 개발자 관리, 사용량·비용 관리, 신고 처리, 비상 차단',
           '나 (플랫폼 운영자)', 'SDVC 관리자 화면'],
          ['2', '개발자', 'SDVC로 프로젝트를 제작하고 유지보수 — 명세→구현, 버그 수정, 기능 추가',
           '돈을 내는 유료 고객', 'SDVC 콘솔'],
          ['3', '사용자', '개발자가 만든 산출물(예: 홈페이지)을 이용',
           '고객의 고객 (SDVC와 직접 계약 없음)', '산출물 URL'],
        ],
        [900, 1900, 5578, 3300, 3000]
      ),
      p(''),
      h2('2.2 용어 정리 — 반드시 구분할 것'),
      p('당초 분류에서 "시스템"이라는 단어가 두 가지 뜻으로 쓰이고 있었다. 이 둘을 섞으면 설계와 대화 모두에서 혼선이 생기므로 아래처럼 용어를 고정한다.', { color: 'C00000' }),
      simpleTable(
        ['모호했던 표현', '이 문서에서 쓰는 용어', '무엇을 가리키나'],
        [
          ['시스템 / 시스템(프로젝트)', '프로젝트 또는 산출물', '개발자가 SDVC로 만든 결과물 (예: 홈페이지)'],
          ['시스템 / 시스템(SDVC)', '플랫폼 또는 SDVC', 'SDVC 웹서비스 그 자체'],
          ['개발자의 "시스템 관리"', '프로젝트 관리', '개발자가 자기 산출물을 관리하는 것'],
          ['서버관리자의 "시스템 관리"', '플랫폼 관리', '서버관리자가 SDVC 자체를 관리하는 것'],
          ['버그 등록', '① 프로젝트 버그 / ② 플랫폼 신고', '① 내 산출물의 문제(P7-2) ② SDVC 자체의 문제(P7-5). 창구가 다르다'],
        ],
        [3200, 3200, 8278]
      ),
      p(''),
      h2('2.3 계층별 등급'),
      p('3계층을 골격으로 하되, 각 계층 안에서 등급을 나눠 권한을 세분한다.'),
      simpleTable(
        ['계층', '등급', '설명', 'MVP 포함 여부'],
        [
          ['서버관리자', '최고관리자', '전권. 정책 변경, 다른 관리자 임명, 감사 로그 열람', 'O (1명)'],
          ['서버관리자', '운영자', '개발자 관리·차단·사용량 조회 가능. 정책 변경 불가', '△ 틀만 (P8-1)'],
          ['서버관리자', '지원', '읽기 전용 + 문의 응대. 개인정보는 가려서 표시', '△ 틀만 (P8-1)'],
          ['개발자', '체험', '가입 직후 N일. 프로젝트 1개, 토큰 한도 낮음', 'O'],
          ['개발자', '기본', '유료 구독. 프로젝트 수·토큰 한도 확대', 'O (Phase 6)'],
          ['개발자', '프로', '상위 구독. 한도 대폭 확대, 우선 지원', 'O (Phase 6)'],
          ['사용자', '익명 방문자', '전체 공개된 산출물을 누구나 열람', 'O (P5-3)'],
          ['사용자', '링크 보유자', '주소를 아는 사람만 열람 (비공개 산출물)', 'O (P5-3)'],
          ['사용자', '산출물 회원', '산출물에 가입·로그인하는 최종 사용자', 'X — MVP 제외, 별도 과제'],
        ],
        [1800, 2000, 7378, 3500]
      ),
      p(''),
      p('※ "산출물 회원" 등급은 개발자가 만든 홈페이지 자체에 회원 기능이 들어가는 경우인데, 산출물마다 개별 DB와 인증이 필요해 난이도가 급격히 올라간다. 따라서 MVP는 정적 사이트로 한정하고, 개발자 모드의 "사용자관리" 기능도 이 단계에 함께 미룬다.', { italics: true, color: '595959' }),
      new Paragraph({ children: [new PageBreak()] }),

      h2('2.4 권한 매트릭스'),
      p('모든 화면과 서버 기능은 이 표를 근거로 접근을 통제한다. ○=가능, △=제한적, ✕=불가', { after: 140 }),
      simpleTable(
        ['기능', '서버관리자', '개발자', '사용자', '구현 작업'],
        [
          ['SDVC 대화로 프로젝트 제작', '○', '○', '✕', 'P3'],
          ['산출물 열람', '○ 전체', '△ 자기 것', '△ 공개된 것', 'P5-1, P5-3'],
          ['산출물 공개범위 변경', '○', '△ 자기 것', '✕', 'P5-3'],
          ['프로젝트 버그 등록·수정', '○', '△ 자기 것', '✕', 'P7-2, P7-3'],
          ['프로젝트 기능 추가 요청', '○', '△ 자기 것', '✕', 'P7-4'],
          ['프로젝트 버전 롤백', '○', '△ 자기 것', '✕', 'P7-6'],
          ['SDVC 플랫폼 신고', '— (접수측)', '○', '✕', 'P7-5, P8-5'],
          ['산출물 사용자 관리', '○', '△ 자기 것', '✕', 'MVP 제외'],
          ['전체 개발자 목록·등급 조회', '○', '✕', '✕', 'P8-2'],
          ['등급·구독 강제 변경, 계정 정지', '○', '✕ (결제로만)', '✕', 'P8-2'],
          ['사용량·비용 조회', '○ 전체', '△ 자기 것', '✕', 'P7-1, P8-3'],
          ['비상 차단 (Kill Switch)', '○', '✕', '✕', 'P8-6'],
          ['감사 로그 열람', '△ 최고관리자만', '✕', '✕', 'P8-7'],
          ['SDVC 플랫폼 유지보수', '내 PC Claude Code로 수행', '✕', '✕', 'P8-8 (웹 제외)'],
        ],
        [4478, 2800, 2600, 2400, 2400]
      ),
      p(''),
      h2('2.5 당초 분류에서 보완한 점'),
      bullet('"시스템"의 두 가지 뜻(플랫폼 / 산출물)을 용어로 분리했다 — 2.2절. 이것을 섞으면 "개발자가 시스템을 유지보수한다"와 "서버관리자가 시스템을 유지보수한다"가 같은 말처럼 보인다.'),
      bullet('"버그 등록"의 대상이 두 종류임을 분리했다 — 내 프로젝트의 버그(P7-2, 개발자가 직접 고침)와 SDVC 플랫폼의 버그(P7-5, 서버관리자에게 신고). 창구를 하나로 만들면 누가 고쳐야 할 문제인지 구분되지 않는다.'),
      bullet('개발자의 "사용자관리"는 산출물에 회원 기능이 있어야 성립한다는 점을 확인하고, MVP에서 제외했다 — 2.3절 각주.'),
      bullet('3계층 골격에 계층별 등급과 기능별 권한 매트릭스를 더했다 — 2.3, 2.4절.'),
      h2('2.6 추가로 넣은 기능 (당초 목록에 없던 것)'),
      simpleTable(
        ['추가 기능', '왜 필요한가', '작업 ID'],
        [
          ['프로젝트 버전 관리·롤백', '"고쳤더니 더 망가졌다"에 대비. 유지보수 기능을 넣는 이상 반드시 짝으로 있어야 한다', 'P7-6'],
          ['비상 차단 (Kill Switch)', '산출물이 우리 도메인에서 서빙되므로, 불법·유해 콘텐츠가 올라오면 즉시 내릴 수단이 법적으로 필요하다', 'P8-6'],
          ['감사 로그', '서버관리자가 개발자 데이터를 열람·변경한 내역 기록. 분쟁 시 유일한 증거가 된다', 'P8-7'],
          ['서버관리자 2단계 인증', '이 계정 하나가 뚫리면 전체 고객 데이터가 노출된다. 일반 로그인과 같은 강도로 두면 안 된다', 'P2-7'],
          ['탈퇴·구독해지 시 산출물 처리', '해지하면 그 사람 홈페이지는 즉시 내려가는가, 유예를 주는가. 사업적·법적으로 먼저 정해야 할 정책', 'P9-3'],
          ['역할 겸직 처리', '한 사람이 개발자이면서 남의 산출물의 사용자일 수 있다. 계정 하나로 자연스럽게 처리되어야 한다', 'P9-4'],
          ['관리자 등급 세분(운영자·지원)', '지금은 혼자 운영하지만, 나중에 고객지원 인력을 쓸 때 개인정보 전체를 보여줄 수는 없다. 틀만 미리 잡아둔다', 'P8-1'],
        ],
        [3400, 8878, 2400]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      /* 3. 역할 분담 */
      h1('3. 작업 역할 분담 (Claude / 사용자)'),
      h2('3.1 Claude가 하는 일'),
      bullet('모든 코드 작성 — 기능 코드와 테스트 코드 전부'),
      bullet('테스트 실행 및 결과 보고 — 실행하지 않은 것을 "통과했다"고 말하지 않고, 실제 명령과 출력을 근거로 첨부'),
      bullet('오류 원인 분석과 수정, 그 이유를 초보자 눈높이로 설명'),
      bullet('문서 작성 — spec.md, plan.md, tasks.md, permissions.md, progress.md, 최종 설계서'),
      bullet('Git 커밋·푸시 (커밋 컨벤션 준수)'),
      h2('3.2 사용자가 직접 해야 하는 일 (Claude가 대신할 수 없음)'),
      bullet('외부 서비스 계정 생성 — Anthropic Console, Vercel, Supabase, Stripe'),
      bullet('결제수단 등록 및 요금 부담'),
      bullet('API 키·비밀번호의 실제 값 입력 — 헌장 규칙상 Claude는 빈 틀만 만들고 값은 절대 채우지 않는다'),
      bullet('승인 게이트에서의 결정 (7곳)'),
      bullet('브라우저에서 실제로 눈으로 확인 — 화면 기능은 테스트 통과만으로 부족하다'),
      bullet('도메인 구입, 등급별 요금 결정'),
      bullet('정책 결정 — 체험 일수, 등급별 한도, 구독 해지 시 산출물 처리 방침'),
      bullet('약관·개인정보처리방침·환불정책의 법률 전문가 검토 의뢰'),
      h2('3.3 함께 하는 일'),
      bullet('기술 선택 (G1), 역할·권한 모델 확정 (G2)'),
      bullet('화면 구성과 사용자 경험 방향 결정'),
      bullet('우선순위 조정 — 무엇을 먼저 만들고 무엇을 미룰지'),
      bullet('검증 시나리오 실행 — Claude가 절차를 안내하고 사용자가 실제로 눌러본다'),
      new Paragraph({ children: [new PageBreak()] }),

      /* 4. 요약 */
      h1('4. WBS 전체 구조 요약'),
      simpleTable(
        ['Phase', '내용', '구분', '예상 세션', '누적'],
        [
          ['Phase 0', '준비 — 계정·환경·기술·역할모델 결정', '선행 필수', '4.5', '4.5'],
          ['Phase 1', '명세·계획 문서화 (방법론 블록 1~4)', '선행 필수', '5.5', '10'],
          ['Phase 2', '슬라이스 1 — 로그인·인증·권한 체계', 'MVP', '8', '18'],
          ['Phase 3', '슬라이스 2 — SDVC 엔진(서버 API)', 'MVP', '8.5', '26.5'],
          ['Phase 4', '슬라이스 3 — 산출물 생성·저장', 'MVP', '4', '30.5'],
          ['Phase 5', '슬라이스 4 — 산출물 URL 서빙', 'MVP 완성', '6', '36.5'],
          ['Phase 6', '유료화 — 결제·등급 연동', '수익화', '9', '45.5'],
          ['Phase 7', '개발자 모드 — 내 프로젝트 유지보수', '신규', '9', '54.5'],
          ['Phase 8', '서버관리자 모드 — 플랫폼 운영', '신규', '9', '63.5'],
          ['Phase 9', 'UI 고도화·정책 기능', '고도화', '7', '70.5'],
          ['Phase 10', '출시 준비', '최종', '5', '75.5'],
        ],
        [1700, 6478, 2000, 2200, 2300]
      ),
      p(''),
      p('진행 속도별 예상 기간 (1세션 = 1~2시간)', { bold: true }),
      simpleTable(
        ['진행 속도', 'MVP 완성 (36.5세션)', '판매 가능 (45.5세션)', '전체 완료 (75.5세션)'],
        [
          ['주 2세션', '약 18주 (4.5개월)', '약 23주 (5.5개월)', '약 38주 (9개월)'],
          ['주 3세션', '약 12주 (3개월)', '약 15주 (3.5개월)', '약 25주 (6개월)'],
          ['주 5세션', '약 7~8주', '약 9주', '약 15주 (3.5개월)'],
        ],
        [2600, 4026, 4026, 4026]
      ),
      p(''),
      p('※ 추정치다. Phase 3(엔진 이식)과 Phase 7(개발자 모드)이 가장 불확실하다. 매 세션 progress.md에 실적을 기록해 조정한다. 규모를 줄이고 싶다면 Phase 9를 출시 후로 미루는 것이 가장 안전한 절단면이다(70.5 → 68.5세션).', { italics: true, color: '595959' }),
      new Paragraph({ children: [new PageBreak()] }),

      /* 5. 상세 WBS */
      h1('5. 상세 WBS — 작업 단위 분해'),
      p('연두색 배경은 v2.0에서 신규 추가되거나 크게 바뀐 작업이다. Phase 2~5(MVP)는 슬라이스 하나가 끝날 때마다 실제 동작을 눈으로 확인한 뒤 다음으로 넘어간다.', { after: 160 }),
      taskTable([{ type: 'head' }, ...ALL]),
      new Paragraph({ children: [new PageBreak()] }),

      /* 6. 게이트 */
      h1('6. 승인 게이트 — 사용자 결정이 반드시 필요한 지점'),
      simpleTable(
        ['게이트', '시점', '결정할 내용', '결정하지 않으면'],
        [
          ['G1', 'P0-5', '백엔드 언어, Claude 호출 방식, 저장소 구성', '코드를 시작할 수 없음'],
          ['G2', 'P0-6', '3계층 역할, 계층별 등급, 권한 매트릭스 확정', 'DB 설계(P2-4)를 시작할 수 없음'],
          ['G3', 'P1-3', '기술 설계(plan.md) 승인', '작업 분해로 넘어가지 않음'],
          ['G4', 'P1-4', '작업 목록(tasks.md)과 순서 승인', '코드 작성을 시작하지 않음'],
          ['G5', 'P5-5', 'MVP가 실제로 동작하는지 최종 확인', '유료화 단계로 넘어가지 않음'],
          ['G6', 'P6-8', '결제·등급 전환이 정상인지 확인', '실제 고객을 받지 않음'],
          ['G7', 'P10-4', '출시 승인', '서비스를 공개하지 않음'],
        ],
        [1400, 1600, 6678, 5000]
      ),
      p(''),

      /* 7. 준비물 */
      h1('7. 사용자 준비물 체크리스트'),
      simpleTable(
        ['시점', '준비물', '비용', '비고'],
        [
          ['P0-1', 'Anthropic Console 계정 + 결제수단 + API 키', '사용한 만큼 종량제', '신규 가입 시 소액 무료 크레딧 제공'],
          ['P0-2', 'Vercel 계정 (GitHub 로그인)', '초기 무료 티어 가능', '트래픽이 늘면 유료 전환 필요'],
          ['P0-3', 'Supabase 계정 + 프로젝트', '초기 무료 티어 가능', '리전은 서울(ap-northeast-2) 권장'],
          ['P0-4', 'Node.js 20 이상', '무료', '설치 여부만 확인'],
          ['P0-6', '역할·등급 정책 구상', '—', '체험 일수, 등급별 프로젝트 수·토큰 한도를 대략이라도 정해둘 것'],
          ['P6-1', 'Stripe 계정 + 사업자 정보', '결제액의 일정 비율 수수료', '국내 결제는 토스페이먼츠 등도 검토 가능'],
          ['P9-3', '구독 해지 시 산출물 처리 방침', '—', '즉시 중단 / 유예기간 / 데이터 삭제 시점을 결정'],
          ['P10-1', '도메인', '연 1~3만원 수준', '없으면 vercel.app 주소로도 운영 가능'],
          ['P10-2', '법률 전문가 검토 (약관·개인정보·환불)', '별도 견적', 'AI가 대신 판단할 수 없는 영역'],
        ],
        [1300, 4300, 3400, 5678]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      /* 8. 리스크 */
      h1('8. 리스크와 대응'),
      simpleTable(
        ['리스크', '내용', '대응', '대응 시점'],
        [
          ['API 원가가 구독료를 초과', '개발자가 많이 쓸수록 Anthropic API 비용이 커져 적자가 날 수 있음',
           '등급별 월 사용 상한, 프롬프트 캐싱으로 재사용분 할인, 단순 작업은 저렴한 모델로 분리', 'P8-3, P8-4'],
          ['유해·불법 산출물', '개발자가 만든 사이트가 우리 도메인에서 서빙되므로 법적 책임 문제가 생길 수 있음',
           '비상 차단 스위치, 약관에 금지 콘텐츠 명시, 신고 접수 경로 마련', 'P8-6, P10-2'],
          ['서버관리자 계정 탈취', '이 계정 하나가 뚫리면 전체 고객 데이터와 결제 정보가 노출',
           '2단계 인증 필수, 관리자 등급 분리, 모든 관리 행위를 감사 로그에 기록', 'P2-7, P8-1, P8-7'],
          ['Anthropic 정책 변경', '서드파티 서비스의 API 이용 조건이나 브랜딩 규정이 바뀔 수 있음',
           '착수 직전 약관 재확인, API 키 종량제 전제 설계, "Claude Code" 명칭 미사용', 'P10-3'],
          ['체험기간 남용', '이메일만 바꿔 무한 재가입하는 것을 완전히 막을 수는 없음',
           '이메일 인증, 카드 사전등록 요구 등으로 억제. 정책 수위는 사업 판단', 'P6-6'],
          ['유지보수가 오히려 망가뜨림', '버그를 고쳤는데 다른 곳이 깨지는 상황',
           'TDD로 재현 테스트를 먼저 만들고 수정, 버전 보관 + 롤백 기능을 짝으로 제공', 'P7-3, P7-6'],
          ['Phase 3·7에서 지연', 'SDVC 엔진 이식과 개발자 모드가 가장 어렵고 불확실한 구간',
           '한 번에 완성하려 하지 말고 잘게 쪼개 진행. 슬라이스 단위로 끊어 중간에 멈춰도 동작하게 유지', 'P3, P7'],
          ['세션이 끊겨 맥락 소실', '작업이 여러 달에 걸치므로 이전 내용을 잊을 위험',
           '"작업 휴식"으로 progress.md에 6블록 형식 저장, "SDVC서버 구축"으로 이어받기', '상시'],
        ],
        [2200, 4200, 5278, 3000]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      /* 9. 진행 방법 */
      h1('9. 작업 진행 방법'),
      h2('9.1 시작과 중단'),
      simpleTable(
        ['명령', '동작'],
        [
          ['"SDVC서버 구축"', '작업 시작 또는 재개. progress.md를 읽어 지난 내용을 요약해 보여준 뒤, 기록된 "다음 할 일"부터 이어서 진행한다. 최초 시작도 같은 명령을 쓴다.'],
          ['"작업 휴식"', '작업 중단. 지금까지 진행한 내용(어디까지 왔나 · 방금 한 일 · 검증 증거 · 다음 할 일 · 막힌 것 · 알아둘 함정)을 progress.md에 저장하고 커밋한 뒤 종료한다.'],
        ],
        [3000, 11678]
      ),
      p(''),
      h2('9.2 매 세션의 흐름'),
      bullet('세션 시작 : "SDVC서버 구축" → Claude가 progress.md를 읽고 현재 위치를 보고 → 사용자가 확인'),
      bullet('작업 수행 : 이 WBS의 다음 작업 ID를 진행. 코드 작업은 RED(실패 테스트) → GREEN(구현) → REFACTOR(정리) 순서로, 각 단계마다 별도 커밋'),
      bullet('슬라이스 완료 시 : 브라우저에서 동작을 확인하고, 실행한 명령과 출력을 증거로 첨부'),
      bullet('세션 종료 : "작업 휴식" → progress.md 갱신 및 커밋'),
      h2('9.3 지켜지는 원칙 (헌장)'),
      bullet('TDD 필수 — 테스트를 먼저 쓰고 나중에 코드를 짠다'),
      bullet('보안 — API 키·비밀번호는 AI가 값을 채우지 않고, 커밋하지 않는다'),
      bullet('기록 — 모든 결정을 문서와 커밋 메시지에 남긴다'),
      bullet('증거 — 실제로 실행하지 않은 것을 "통과했다"고 말하지 않는다'),
      p(''),
      p('문서 끝.', { align: AlignmentType.CENTER, color: '808080', italics: true }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = process.argv[2];
  fs.writeFileSync(out, buf);
  console.log('WROTE', out, buf.length, 'bytes');

  const mdOut = process.argv[3];
  if (!mdOut) return;
  const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const L = [];
  L.push('# SDVC 웹서비스 서버 구축 — WBS 및 작업일정표 v2.0');
  L.push('');
  L.push('> 작성일 2026-09-08 · v2.0 · 대상 스킬 sdvc-guide v2.1.0');
  L.push('> 배포본(docx): `20260908_SDVC_서버구축WBS.docx` — 이 md와 docx는 `_wbs_docx생성.js` 하나로 함께 생성한다.');
  L.push('> 시작·재개 `SDVC서버 구축` / 중단 `작업 휴식`');
  L.push('');
  L.push('## 역할 모델 (3계층 + 등급)');
  L.push('');
  L.push('| 계층 | 역할 | 하는 일 | SDVC 입장에서 |');
  L.push('|---|---|---|---|');
  L.push('| 1 | 서버관리자 | 플랫폼 전체 운영 (개발자관리·비용·신고·차단) | 나 (운영자) |');
  L.push('| 2 | 개발자 | SDVC로 프로젝트 제작·유지보수 | 유료 고객 |');
  L.push('| 3 | 사용자 | 개발자가 만든 산출물 이용 | 고객의 고객 |');
  L.push('');
  L.push('**용어 고정**: "프로젝트/산출물" = 개발자가 만든 결과물 · "플랫폼/SDVC" = 서비스 자체.');
  L.push('"버그"는 ① 프로젝트 버그(P7-2, 개발자가 고침) ② 플랫폼 신고(P7-5 → P8-5, 서버관리자가 고침)로 창구가 나뉜다.');
  L.push('');
  L.push('**등급**: 서버관리자(최고관리자/운영자/지원) · 개발자(체험/기본/프로) · 사용자(익명방문자/링크보유자/[산출물회원=MVP제외])');
  L.push('');
  L.push('## 상세 WBS');
  L.push('');
  L.push('| 작업 ID | 작업명 | 작업 내용 | 담당 | 산출물 | 예상 세션 |');
  L.push('|---|---|---|---|---|---|');
  let total = 0, ntask = 0;
  for (const r of ALL) {
    if (r.type === 'phase' || r.type === 'mile') { L.push(`| **${esc(r.label)}** | | | | | |`); continue; }
    const mark = r.isNew ? ' 🆕' : '';
    L.push('| ' + r.c[0] + mark + ' | ' + r.c.slice(1).map(esc).join(' | ') + ' |');
    const n = parseFloat(r.c[5]); if (!isNaN(n)) { total += n; ntask++; }
  }
  L.push('');
  L.push(`**작업 ${ntask}건 · 합계 ${total} 세션** (1세션 = 약 1~2시간). 🆕 = v2.0 신규/변경`);
  L.push('');
  L.push('## 마일스톤');
  L.push('');
  L.push('| 마일스톤 | 시점 | 누적 세션 |');
  L.push('|---|---|---|');
  L.push('| M1 MVP 완성 | P5-5 완료 | 36.5 |');
  L.push('| M2 판매 가능 | P6-8 완료 | 45.5 |');
  L.push('| M3 출시 | P10-4 완료 | 75.5 |');
  L.push('');
  L.push('## 승인 게이트');
  L.push('');
  L.push('| 게이트 | 시점 | 결정할 내용 |');
  L.push('|---|---|---|');
  L.push('| G1 | P0-5 | 백엔드 언어, Claude 호출 방식, 저장소 구성 |');
  L.push('| G2 | P0-6 | 3계층 역할·등급·권한 매트릭스 확정 |');
  L.push('| G3 | P1-3 | 기술 설계(plan.md) 승인 |');
  L.push('| G4 | P1-4 | 작업 목록(tasks.md) 승인 |');
  L.push('| G5 | P5-5 | MVP 실제 동작 최종 확인 |');
  L.push('| G6 | P6-8 | 결제·등급 전환 정상 확인 |');
  L.push('| G7 | P10-4 | 출시 승인 |');
  L.push('');
  L.push('권한 매트릭스·리스크 대응·준비물 체크리스트 상세는 docx 배포본 2·7·8장 참조.');
  L.push('');
  fs.writeFileSync(mdOut, L.join('\n'), 'utf8');
  console.log('WROTE', mdOut, '| tasks:', ntask, '| sessions:', total);
});
