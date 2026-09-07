const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  PageOrientation, PageBreak, Footer, PageNumber, convertInchesToTwip,
} = require('docx');
const fs = require('fs');

const FONT = '맑은 고딕';
const CONTENT_W = 14678; // A4 landscape, 0.75in margins
const COLS = [1100, 2500, 5578, 1600, 2400, 1500];

const HDR_BG = 'D9E2F3';
const PHASE_BG = 'EDEDED';
const MILE_BG = 'FFF2CC';

const p = (text, opts = {}) => new Paragraph({
  spacing: { before: opts.before ?? 60, after: opts.after ?? 60, line: 280 },
  alignment: opts.align,
  indent: opts.indent,
  children: [new TextRun({ text, bold: opts.bold, size: opts.size ?? 20, color: opts.color, italics: opts.italics })],
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 320, after: 160 },
  children: [new TextRun({ text, bold: true, size: 30, color: '1F3864', font: FONT })],
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 240, after: 120 },
  children: [new TextRun({ text, bold: true, size: 24, color: '2E5496', font: FONT })],
});

const bullet = (text, level = 0) => new Paragraph({
  numbering: { reference: 'bl', level },
  spacing: { before: 40, after: 40, line: 280 },
  children: [new TextRun({ text, size: 20 })],
});

const cell = (text, opts = {}) => new TableCell({
  width: { size: opts.w, type: WidthType.DXA },
  columnSpan: opts.span,
  shading: opts.bg ? { type: ShadingType.CLEAR, fill: opts.bg, color: 'auto' } : undefined,
  margins: { top: 60, bottom: 60, left: 100, right: 100 },
  verticalAlign: 'center',
  children: String(text).split('\n').map((line) => new Paragraph({
    spacing: { before: 20, after: 20, line: 260 },
    alignment: opts.align,
    children: [new TextRun({ text: line, bold: opts.bold, size: opts.size ?? 18, color: opts.color })],
  })),
});

// rows: {type:'head'} | {type:'phase', label} | {type:'task', c:[...]} | {type:'mile', label}
function taskTable(rows) {
  const trs = rows.map((r) => {
    if (r.type === 'head') {
      return new TableRow({
        tableHeader: true,
        children: ['작업 ID', '작업명', '작업 내용', '담당', '산출물', '예상 세션'].map(
          (t, i) => cell(t, { w: COLS[i], bg: HDR_BG, bold: true, align: AlignmentType.CENTER })
        ),
      });
    }
    if (r.type === 'phase') {
      return new TableRow({ children: [cell(r.label, { w: CONTENT_W, span: 6, bg: PHASE_BG, bold: true, size: 19 })] });
    }
    if (r.type === 'mile') {
      return new TableRow({ children: [cell(r.label, { w: CONTENT_W, span: 6, bg: MILE_BG, bold: true, size: 19, color: '833C00' })] });
    }
    return new TableRow({
      children: r.c.map((t, i) => cell(t, {
        w: COLS[i],
        align: (i === 0 || i === 3 || i === 5) ? AlignmentType.CENTER : undefined,
        bold: i === 0,
      })),
    });
  });
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: COLS,
    rows: trs,
  });
}

function simpleTable(header, rows, widths) {
  const trs = [
    new TableRow({
      tableHeader: true,
      children: header.map((t, i) => cell(t, { w: widths[i], bg: HDR_BG, bold: true, align: AlignmentType.CENTER })),
    }),
    ...rows.map((r) => new TableRow({
      children: r.map((t, i) => cell(t, { w: widths[i], size: 19 })),
    })),
  ];
  return new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, rows: trs });
}

/* ============================ 내용 ============================ */

const P0 = [
  { type: 'phase', label: 'Phase 0 — 준비 : 계정·환경·기술 결정  (예상 3.5 세션)' },
  { type: 'task', c: ['P0-1', 'Anthropic API 키 발급', 'console.anthropic.com 가입 → 결제수단 등록 → API 키 생성. 이 키가 SDVC 서버가 Claude를 호출하는 "열쇠"이며, 사용량만큼 요금이 청구된다.', '사용자', 'API 키 (사용자 보관)', '0.5'] },
  { type: 'task', c: ['P0-2', 'Vercel 계정 생성·GitHub 연결', 'vercel.com에 GitHub 계정으로 가입 → pinusian 저장소 접근 권한 허용. 이후 push하면 자동 배포되는 통로가 열린다.', '사용자', 'Vercel 계정', '0.5'] },
  { type: 'task', c: ['P0-3', 'Supabase 계정·프로젝트 생성', 'supabase.com 가입 → 새 프로젝트 생성(리전 서울 권장). 회원정보·프로젝트정보를 담을 데이터베이스와 파일 저장소가 여기 생긴다.', '사용자', 'Supabase 프로젝트', '0.5'] },
  { type: 'task', c: ['P0-4', '로컬 개발 환경 점검', 'Node.js 20 이상 설치 여부 확인(없으면 설치). Git은 이미 설치되어 있음을 확인함.', '공동', 'node -v 실행 출력', '0.5'] },
  { type: 'task', c: ['P0-5', '기술 스택 최종 확정 ★', '① 백엔드 언어 : TypeScript 단일 vs Python 분리  ② Claude 호출 방식 : Claude API 직접 vs Claude Agent SDK  ③ 저장소 : 신규 sdvc-app 분리(권장) vs 기존 sdvc 안에 폴더 추가', '공동 ★승인', '결정 기록 (context.md)', '1'] },
  { type: 'task', c: ['P0-6', '앱 저장소 생성', 'P0-5 결정에 따라 GitHub에 앱 전용 private 저장소 생성. 방법론·문서 저장소(sdvc)와 코드 저장소를 분리해 관리를 단순화한다.', 'Claude', 'GitHub 저장소', '0.5'] },
];

const P1 = [
  { type: 'phase', label: 'Phase 1 — 명세·계획 문서화 : SDVC 방법론 블록 1~4  (예상 5 세션)' },
  { type: 'task', c: ['P1-1', 'Specify — 명세 작성', '"무엇을 만드는가"를 User Story·기능요구사항(FR)·성공기준(SC)으로 확정. 이미 합의한 6단계 로드맵과 우선순위(P1 MVP / P2 결제 / P3 관리자·UI)를 재료로 사용.', '공동', 'docs/spec.md', '1'] },
  { type: 'task', c: ['P1-2', 'Clarify — 애매한 점 확정', 'AI가 최대 5개 질문 + 예시 답안 제시. 예 : 산출물은 정적 사이트만 허용하는가 / 1인당 프로젝트 개수 제한 / 무료 체험 일수 / 산출물 공개 범위.', '공동', 'spec.md Clarifications 절', '1'] },
  { type: 'task', c: ['P1-3', 'Plan — 기술 설계 ★', '폴더 구조, 데이터베이스 표 구성, 화면 목록, 서버 기능(API) 목록, 데이터 흐름을 초보자 눈높이 용어로 정리해 제시하고 승인받는다.', 'Claude 주도 ★승인', 'docs/plan.md', '1.5'] },
  { type: 'task', c: ['P1-4', 'Tasks — 작업 분해 ★', '이 WBS를 코드 수준으로 정밀화. 기능 하나가 화면까지 완결되는 "버티컬 슬라이스" 단위로 쪼개 순서를 확정하고 승인받는다.', 'Claude 주도 ★승인', 'docs/tasks.md', '1'] },
  { type: 'task', c: ['P1-5', 'Analyze — 모순 점검', 'spec·plan·tasks 세 문서 사이의 누락·충돌을 점검하고 보고. 문제가 있으면 수정 승인 후 반영.', 'Claude', '점검 보고', '0.5'] },
];

const P2 = [
  { type: 'phase', label: 'Phase 2 — 슬라이스 1 : 로그인·인증  [MVP]  (예상 5 세션)' },
  { type: 'task', c: ['P2-1', 'Next.js 프로젝트 생성', '앱 뼈대 생성, 폴더 구조 세팅, 저장소에 최초 커밋. 아직 화면은 비어 있어도 무방.', 'Claude', '실행되는 빈 앱', '1'] },
  { type: 'task', c: ['P2-2', 'Vercel 첫 배포', '저장소를 Vercel에 연결하고 push → 자동 배포가 실제로 도는지 확인. 임시 주소(◯◯.vercel.app) 확보.', '공동', '접속 가능한 URL', '0.5'] },
  { type: 'task', c: ['P2-3', 'Supabase 연결·환경변수 틀', 'Claude가 빈 .env.example 틀을 만들고, 실제 접속 값은 사용자가 로컬과 Vercel 양쪽에 직접 입력(헌장 보안 규칙).', '공동 (값 입력=사용자)', '.env.example, 연결 확인', '0.5'] },
  { type: 'task', c: ['P2-4', '회원가입·로그인 기능 (TDD)', '실패 테스트 작성(RED) → 이메일 가입·로그인 구현(GREEN) → 코드 정리(REFACTOR). 각 단계마다 별도 커밋.', 'Claude', '테스트 + 인증 코드', '1.5'] },
  { type: 'task', c: ['P2-5', '로그인 화면·대시보드', '가입·로그인·로그아웃 화면과, 로그인해야만 보이는 대시보드 화면 제작.', 'Claude', '화면 3종', '1'] },
  { type: 'task', c: ['P2-6', '슬라이스 1 검증', '실제 브라우저에서 가입 → 로그인 → 대시보드 → 로그아웃 전 과정을 눈으로 확인하고 증거 남김.', '공동', '실행 증거(화면·테스트 출력)', '0.5'] },
];

const P3 = [
  { type: 'phase', label: 'Phase 3 — 슬라이스 2 : SDVC 엔진(서버 API)  [MVP · 최대 난이도]  (예상 8.5 세션)' },
  { type: 'task', c: ['P3-1', 'ANTHROPIC_API_KEY 설정', 'Claude는 빈 틀만 만들고, 사용자가 로컬 .env와 Vercel 환경변수에 실제 키를 직접 입력. AI는 절대 값을 채우지 않음(헌장 규칙).', '사용자 (틀=Claude)', '환경변수 설정 완료', '0.5'] },
  { type: 'task', c: ['P3-2', '대화 API 뼈대 (TDD)', '/api/chat 엔드포인트 제작. 사용자의 말을 받아 Claude에 전달하고 답을 돌려주는 최소 기능부터 테스트와 함께 구현.', 'Claude', 'API + 테스트', '1.5'] },
  { type: 'task', c: ['P3-3', 'SDVC 진행 대본 이식', '현재 스킬 파일(00-guided-session-script.md)의 5블록 7단계 절차·예시 답안·승인 게이트 규칙을 서버 프롬프트 모듈로 옮긴다. SDVC의 두뇌에 해당하는 핵심 작업.', 'Claude 주도', '프롬프트 모듈', '2'] },
  { type: 'task', c: ['P3-4', '대화 상태 저장', '프로젝트별로 "지금 몇 블록인지, 어떤 문서가 만들어졌는지"를 DB에 저장. 사용자가 창을 닫았다 와도 이어서 진행되게 한다.', 'Claude', 'DB 표 + 저장 로직', '1.5'] },
  { type: 'task', c: ['P3-5', '채팅 화면', '사용자가 대화하는 화면. 답변이 한 글자씩 흘러나오는 스트리밍 표시 포함.', 'Claude', '채팅 UI', '1.5'] },
  { type: 'task', c: ['P3-6', '승인 게이트 UI', '계획·작업분해 단계에서 "승인 / 수정 요청" 버튼 제공. 승인 전에는 다음 단계로 넘어가지 못하게 서버에서 차단.', 'Claude', '승인 화면', '1'] },
  { type: 'task', c: ['P3-7', '슬라이스 2 검증', '웹에서 "홈페이지 만들고 싶어" 입력 → 헌장·명세·계획까지 실제로 대화가 진행되는지 확인.', '공동', '실행 증거', '0.5'] },
];

const P4 = [
  { type: 'phase', label: 'Phase 4 — 슬라이스 3 : 산출물 생성·저장  [MVP]  (예상 4 세션)' },
  { type: 'task', c: ['P4-1', '저장소(Storage) 준비', 'Supabase Storage 버킷 생성, 프로젝트별 폴더 규칙과 접근 권한 정책 설정(남의 프로젝트를 못 보게).', '공동', '버킷 + 권한 정책', '0.5'] },
  { type: 'task', c: ['P4-2', '프로젝트 메타 표 설계', '프로젝트명·주소이름(slug)·소유자·생성일·공개여부를 저장하는 DB 표 설계 및 생성.', 'Claude', 'DB 표', '0.5'] },
  { type: 'task', c: ['P4-3', '파일 생성·저장 로직 (TDD)', 'AI가 만들어낸 HTML·CSS·JS 내용을 받아 Storage에 실제 파일로 저장. 덮어쓰기·버전 처리 포함.', 'Claude', '저장 로직 + 테스트', '1.5'] },
  { type: 'task', c: ['P4-4', '생성 진행 표시 UI', '"파일 3개 중 2개 생성 중…" 같이 진행 상황을 사용자에게 보여주는 화면.', 'Claude', '진행 표시 UI', '1'] },
  { type: 'task', c: ['P4-5', '슬라이스 3 검증', '구현 단계까지 진행한 뒤 Supabase 관리화면에서 파일이 실제로 쌓였는지 확인.', '공동', '실행 증거', '0.5'] },
];

const P5 = [
  { type: 'phase', label: 'Phase 5 — 슬라이스 4 : 산출물 URL 서빙  [MVP 완성]  (예상 5.5 세션)' },
  { type: 'task', c: ['P5-1', '산출물 서빙 라우트 (TDD)', '/site/{프로젝트이름}/… 주소로 들어오면 Storage에서 해당 파일을 꺼내 보여주는 페이지 1개. 프로젝트마다 만드는 게 아니라 이 하나가 전부를 처리한다.', 'Claude', '라우트 + 테스트', '1.5'] },
  { type: 'task', c: ['P5-2', '파일 형식·자산 처리', 'CSS·JS·이미지가 깨지지 않고 불러와지도록 파일 형식(MIME) 처리와 경로 보정.', 'Claude', '처리 로직', '1'] },
  { type: 'task', c: ['P5-3', '공개/비공개 설정', '"나만 보기 ↔ 링크 아는 사람 공개" 전환 기능. 기본값은 비공개.', 'Claude', '설정 기능', '1'] },
  { type: 'task', c: ['P5-4', '내 프로젝트 목록 화면', '대시보드에서 내가 만든 프로젝트들과 각각의 접속 URL을 한눈에 보여준다.', 'Claude', '목록 화면', '1'] },
  { type: 'task', c: ['P5-5', 'MVP 전 구간 검증 (E2E)', '가입 → 로그인 → "홈페이지 만들어줘" → 대화 → 생성 → URL 접속 → 홈페이지가 실제로 열리는 전 과정을 처음부터 끝까지 실행하고 증거를 남긴다.', '공동', '실행 증거·화면 기록', '1'] },
  { type: 'mile', label: '★ 마일스톤 1 : MVP 완성 — 서비스가 근본적으로 성립하는지 여기서 판가름 난다. 누적 약 31.5 세션' },
];

const P6 = [
  { type: 'phase', label: 'Phase 6 — 유료화 : 결제·체험기간  [P2]  (예상 8 세션)' },
  { type: 'task', c: ['P6-1', 'Stripe 계정·상품 등록', 'Stripe 가입, 월 구독 상품과 가격 등록, 테스트용 키 발급. 가격 결정은 사용자 몫.', '사용자', 'Stripe 상품·키', '1'] },
  { type: 'task', c: ['P6-2', '구독 상태 DB 설계', '가입일·체험만료일·구독상태·결제고객ID를 담는 표 설계. 관리자 통계(P7-4)에서 쓸 항목까지 미리 반영.', 'Claude', 'DB 표', '0.5'] },
  { type: 'task', c: ['P6-3', '결제 연동 (TDD)', 'Stripe Checkout 연결, 결제 완료 후 돌아왔을 때의 처리. 카드정보는 Stripe가 직접 받으므로 우리 서버에 저장하지 않는다.', 'Claude', '결제 코드 + 테스트', '2'] },
  { type: 'task', c: ['P6-4', 'Webhook 처리', '결제 성공·실패·해지 알림을 Stripe로부터 받아 DB 상태를 자동 갱신. 위변조 검증 포함.', 'Claude', 'Webhook 엔드포인트', '1.5'] },
  { type: 'task', c: ['P6-5', '접근 판정 미들웨어', '요청이 올 때마다 서버가 "체험 기간인가 / 결제했는가"를 판정해 통과·차단. 브라우저 쪽 판정은 우회가 쉬우므로 반드시 서버에서 판단.', 'Claude', '판정 로직 + 테스트', '1'] },
  { type: 'task', c: ['P6-6', '요금제·결제 화면', '가격 안내, 결제하기, 구독 관리(해지·영수증) 화면.', 'Claude', '화면 3종', '1'] },
  { type: 'task', c: ['P6-7', '결제 검증', 'Stripe 테스트 모드로 가입 → 체험 → 만료 → 결제 → 계속 사용 시나리오를 실제로 돌려본다.', '공동', '실행 증거', '1'] },
  { type: 'mile', label: '★ 마일스톤 2 : 판매 가능 상태 — 이 시점부터 실제 유료 고객을 받을 수 있다. 누적 약 39.5 세션' },
];

const P7 = [
  { type: 'phase', label: 'Phase 7 — 부가기능 : 단계별 UI·관리자 모드  [P3]  (예상 9 세션)' },
  { type: 'task', c: ['P7-1', '방법론 단계별 UI 고도화', '채팅 일변도에서 벗어나 : 명세는 표 형태, 계획은 카드+승인 버튼, 작업분해는 체크리스트 형태로 각 단계 전용 화면 제작.', '공동 (구성 결정)', '화면 개편', '2.5'] },
  { type: 'task', c: ['P7-2', '관리자 모드 — 기반', '관리자 권한 구분(일반 사용자와 분리), 관리자 전용 화면 진입 및 접근 차단 로직.', 'Claude', '권한 체계', '1'] },
  { type: 'task', c: ['P7-3', '관리자 모드 — 사용자 관리', '가입자 목록, 구독 상태 조회, 체험 연장·강제 해지 등 운영 기능.', 'Claude', '관리 화면', '1.5'] },
  { type: 'task', c: ['P7-4', '관리자 모드 — 사용량·비용', '사용자별 토큰 사용량과 API 원가를 집계해 보여주는 대시보드. 적자 구조를 조기에 발견하기 위한 필수 기능.', 'Claude', '통계 화면', '1.5'] },
  { type: 'task', c: ['P7-5', '사용량 상한·비용 방어', '사용자별 월 사용 상한 설정, 초과 시 차단. 프롬프트 캐싱·모델 선택으로 원가 절감.', 'Claude', '상한 로직', '1.5'] },
  { type: 'task', c: ['P7-6', '산출물 내려받기', '만든 프로젝트를 zip 파일로 내려받는 기능. 사용자가 결과물을 소유한다는 신뢰를 준다.', 'Claude', '다운로드 기능', '1'] },
];

const P8 = [
  { type: 'phase', label: 'Phase 8 — 출시 준비  (예상 4.5 세션)' },
  { type: 'task', c: ['P8-1', '도메인 연결', '도메인 구입(사용자) 후 Vercel에 연결. ◯◯.vercel.app → 정식 주소로 전환.', '공동', '정식 주소', '0.5'] },
  { type: 'task', c: ['P8-2', '약관·정책 문서', '이용약관·개인정보처리방침·환불정책 초안 작성. 초안은 Claude가 쓰되 최종 검토는 반드시 법률 전문가에게 의뢰(AI가 단정할 수 없는 영역).', 'Claude 초안 / 사용자 검토의뢰', '정책 문서 3종', '1.5'] },
  { type: 'task', c: ['P8-3', 'Anthropic 정책 재확인', '서비스 착수 직전 API 이용약관·브랜딩 규정("Claude Code" 명칭 사용 금지 등)을 다시 확인.', '공동', '확인 기록', '0.5'] },
  { type: 'task', c: ['P8-4', '최종 점검·설계서', '전체 테스트 재실행, 운영 매뉴얼 및 설계서(docx) 작성, 실행 증거 정리.', 'Claude 주도', '설계서·실행 증거', '2'] },
  { type: 'mile', label: '★ 마일스톤 3 : 출시 — 누적 약 53 세션' },
];

/* ============================ 문서 조립 ============================ */

const doc = new Document({
  creator: 'Dr. Brian Park',
  title: 'SDVC 웹서비스 서버 구축 WBS 및 작업일정표',
  description: 'SDVC(Structured Document & Vibe Coding) 유료 웹서비스 구축 프로젝트의 작업분해구조와 일정',
  styles: {
    default: {
      document: { run: { font: FONT, size: 20 }, paragraph: { spacing: { line: 280 } } },
    },
  },
  numbering: {
    config: [{
      reference: 'bl',
      levels: [
        { level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 200 } } } },
        { level: 1, format: 'bullet', text: '–', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 200 } } } },
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
          children: [new TextRun({ text: 'SDVC 서버 구축 WBS  ·  ', size: 16, color: '808080' }),
                     new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '808080' })],
        })],
      }),
    },
    children: [
      /* ---- 표지 ---- */
      new Paragraph({ spacing: { before: 1200, after: 0 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'SDVC 웹서비스 서버 구축', bold: true, size: 52, color: '1F3864' })] }),
      new Paragraph({ spacing: { before: 120, after: 400 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'WBS(작업분해구조) 및 상세 작업일정표', bold: true, size: 32, color: '2E5496' })] }),
      new Paragraph({ spacing: { before: 0, after: 60 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Structured Document & Vibe Coding — 구조화된 문서가 AI 코딩을 이끈다', size: 20, italics: true, color: '595959' })] }),
      new Paragraph({ spacing: { before: 600, after: 60 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '작성일 : 2026-09-07     |     문서 버전 : v1.0     |     대상 스킬 : sdvc-guide v2.1.0', size: 20 })] }),
      new Paragraph({ spacing: { before: 60, after: 60 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '작업 시작·재개 명령 : "SDVC서버 구축"     |     중단 명령 : "작업 휴식"', size: 20, bold: true, color: '833C00' })] }),
      new Paragraph({ children: [new PageBreak()] }),

      /* ---- 1. 문서 개요 ---- */
      h1('1. 문서 개요'),
      p('이 문서는 SDVC를 "내 PC의 Claude Code에서 호출하는 방법론"에서 "서버에서 상시 작동하는 유료 웹서비스"로 전환하기 위한 전체 작업 목록과 일정을 정리한 것이다.'),
      h2('1.1 이 문서를 읽는 법'),
      bullet('작업 ID는 Phase 번호 + 순번이다. 예 : P3-4 는 Phase 3의 네 번째 작업.'),
      bullet('"담당" 열은 Claude(내가 코드로 처리) / 사용자(내가 대신할 수 없는 일) / 공동(함께 결정하거나 함께 확인)으로 구분한다.'),
      bullet('★ 표시는 승인 게이트다. 사용자의 명시적 승인 없이는 다음 단계로 넘어가지 않는다.'),
      bullet('"예상 세션"은 1회 대화(약 1~2시간)를 1세션으로 본 추정치다. 실제 진행하며 조정한다.'),
      h2('1.2 AI-VC와 SDVC의 차이'),
      simpleTable(
        ['구분', 'AI-VC (기존)', 'SDVC (구축 대상)'],
        [
          ['성격', 'Claude Code용 개인 스킬 (마크다운 문서)', '독립 실행되는 유료 웹서비스'],
          ['실행 주체', '사용자 PC의 Claude Code가 문서를 읽고 수행', '서버 프로그램이 Claude API를 직접 호출해 수행'],
          ['사용자 준비물', 'Claude Code 설치 + 구독 필요', '브라우저만 있으면 됨 (설치 없음)'],
          ['인증·과금', '없음 (개인용)', '회원 로그인 + 체험기간 + 월 구독 결제'],
          ['산출물 전달', '사용자 PC의 폴더에 파일 생성', '서버에 저장 후 고유 URL로 즉시 열람'],
          ['운영 기능', '없음', '관리자 모드(사용자·사용량·비용 관리)'],
        ],
        [2200, 6000, 6478]
      ),
      p(''),
      h2('1.3 목표 구조 (한눈에)'),
      p('사용자 브라우저 → [SDVC 콘솔 : 로그인·대화 화면] → [SDVC 엔진 : 서버에서 Claude API 호출] → [저장소 : 생성된 파일 보관] → [산출물 URL : 사용자가 만든 결과물을 열람]', { bold: true }),
      p('여기서 핵심은 "콘솔"과 "산출물"이 서로 다른 두 개의 웹서비스라는 점이다. 콘솔은 하나뿐이지만, 산출물은 사용자·프로젝트마다 계속 늘어난다.'),
      new Paragraph({ children: [new PageBreak()] }),

      /* ---- 2. 역할 분담 ---- */
      h1('2. 역할 분담'),
      h2('2.1 Claude가 하는 일'),
      bullet('모든 코드 작성 — 기능 코드와 테스트 코드 전부'),
      bullet('테스트 실행 및 결과 보고 — 실행하지 않은 것을 "통과했다"고 말하지 않고, 실제 명령과 출력을 근거로 첨부'),
      bullet('오류 원인 분석과 수정, 그리고 그 이유를 초보자 눈높이로 설명'),
      bullet('문서 작성 — spec.md, plan.md, tasks.md, progress.md, 최종 설계서'),
      bullet('Git 커밋·푸시 (커밋 컨벤션 준수)'),
      h2('2.2 사용자가 직접 해야 하는 일 (Claude가 대신할 수 없음)'),
      bullet('외부 서비스 계정 생성 — Anthropic Console, Vercel, Supabase, Stripe'),
      bullet('결제수단 등록 및 요금 부담'),
      bullet('API 키·비밀번호의 실제 값 입력 — 헌장 규칙상 Claude는 빈 틀만 만들고 값은 절대 채우지 않는다'),
      bullet('승인 게이트에서의 결정 — "이대로 진행" 또는 "이 부분을 수정"'),
      bullet('브라우저에서 실제로 눈으로 확인 (테스트 통과만으로는 부족한 화면 기능)'),
      bullet('도메인 구입, 요금제 가격 결정'),
      bullet('약관·개인정보처리방침·환불정책의 법률 전문가 검토 의뢰'),
      h2('2.3 함께 하는 일'),
      bullet('기술 선택 — 백엔드 언어, Claude 호출 방식, 저장소 구성'),
      bullet('화면 구성과 사용자 경험 방향 결정'),
      bullet('우선순위 조정 — 무엇을 먼저 만들고 무엇을 미룰지'),
      bullet('검증 시나리오 실행 — Claude가 절차를 안내하고 사용자가 실제로 눌러본다'),
      new Paragraph({ children: [new PageBreak()] }),

      /* ---- 3. WBS 요약 ---- */
      h1('3. WBS 전체 구조 요약'),
      simpleTable(
        ['Phase', '내용', '우선순위', '예상 세션', '누적'],
        [
          ['Phase 0', '준비 — 계정·환경·기술 결정', '선행 필수', '3.5', '3.5'],
          ['Phase 1', '명세·계획 문서화 (방법론 블록 1~4)', '선행 필수', '5', '8.5'],
          ['Phase 2', '슬라이스 1 — 로그인·인증', 'P1 (MVP)', '5', '13.5'],
          ['Phase 3', '슬라이스 2 — SDVC 엔진(서버 API)', 'P1 (MVP)', '8.5', '22'],
          ['Phase 4', '슬라이스 3 — 산출물 생성·저장', 'P1 (MVP)', '4', '26'],
          ['Phase 5', '슬라이스 4 — 산출물 URL 서빙', 'P1 (MVP 완성)', '5.5', '31.5'],
          ['Phase 6', '유료화 — 결제·체험기간', 'P2', '8', '39.5'],
          ['Phase 7', '부가기능 — 단계별 UI·관리자 모드', 'P3', '9', '48.5'],
          ['Phase 8', '출시 준비', '최종', '4.5', '53'],
        ],
        [1800, 6478, 2400, 2000, 2000]
      ),
      p(''),
      p('진행 속도별 예상 기간 (1세션 = 1~2시간)', { bold: true }),
      simpleTable(
        ['진행 속도', 'MVP 완성 (31.5세션)', '판매 가능 (39.5세션)', '전체 완료 (53세션)'],
        [
          ['주 2세션', '약 16주 (4개월)', '약 20주 (5개월)', '약 27주 (6.5개월)'],
          ['주 3세션', '약 11주 (2.5개월)', '약 13주 (3개월)', '약 18주 (4.5개월)'],
          ['주 5세션', '약 6~7주', '약 8주', '약 11주'],
        ],
        [2600, 4026, 4026, 4026]
      ),
      p(''),
      p('※ 위 수치는 추정치다. 실제로는 Phase 3(엔진 이식)에서 예상보다 시간이 더 걸릴 가능성이 가장 크며, 진행하면서 매 세션 progress.md에 실적을 기록해 조정한다.', { italics: true, color: '595959' }),
      new Paragraph({ children: [new PageBreak()] }),

      /* ---- 4. 상세 WBS ---- */
      h1('4. 상세 WBS — 작업 단위 분해'),
      p('아래 표가 이 프로젝트의 실행 목록이다. 각 Phase는 위에서 아래 순서로 진행하며, 슬라이스(Phase 2~5) 하나가 끝날 때마다 실제로 동작하는 것을 눈으로 확인한 뒤 다음으로 넘어간다.', { after: 160 }),
      taskTable([{ type: 'head' }, ...P0, ...P1, ...P2, ...P3, ...P4, ...P5, ...P6, ...P7, ...P8]),
      new Paragraph({ children: [new PageBreak()] }),

      /* ---- 5. 승인 게이트 ---- */
      h1('5. 승인 게이트 — 사용자 결정이 반드시 필요한 지점'),
      p('아래 지점에서는 사용자의 명시적 승인 없이 다음 단계로 진행하지 않는다. 이것이 "AI가 알아서 다 만들어버려 통제권을 잃는" 상황을 막는 장치다.', { after: 160 }),
      simpleTable(
        ['게이트', '시점', '결정할 내용', '결정하지 않으면'],
        [
          ['G1', 'P0-5', '백엔드 언어, Claude 호출 방식, 저장소 구성', '코드를 시작할 수 없음'],
          ['G2', 'P1-3', '기술 설계(plan.md) 승인', '작업 분해로 넘어가지 않음'],
          ['G3', 'P1-4', '작업 목록(tasks.md)과 순서 승인', '코드 작성을 시작하지 않음'],
          ['G4', 'P5-5', 'MVP가 실제로 동작하는지 최종 확인', '유료화 단계로 넘어가지 않음'],
          ['G5', 'P6-7', '결제 흐름이 정상인지 확인', '실제 고객을 받지 않음'],
          ['G6', 'P8-4', '출시 승인', '서비스를 공개하지 않음'],
        ],
        [1400, 1600, 6678, 5000]
      ),
      p(''),

      /* ---- 6. 사용자 준비물 ---- */
      h1('6. 사용자 준비물 체크리스트'),
      p('아래는 Claude가 대신할 수 없어 사용자가 직접 준비해야 하는 항목이다. Phase 0에서 대부분 처리하고, 결제 관련은 Phase 6에서 준비한다.', { after: 160 }),
      simpleTable(
        ['시점', '준비물', '비용', '비고'],
        [
          ['P0-1', 'Anthropic Console 계정 + 결제수단 + API 키', '사용한 만큼 종량제', '신규 가입 시 소액 무료 크레딧 제공'],
          ['P0-2', 'Vercel 계정 (GitHub 로그인)', '초기 무료 티어로 시작 가능', '트래픽이 늘면 유료 전환 필요'],
          ['P0-3', 'Supabase 계정 + 프로젝트', '초기 무료 티어로 시작 가능', '리전은 서울(ap-northeast-2) 권장'],
          ['P0-4', 'Node.js 20 이상', '무료', '설치 여부만 확인하면 됨'],
          ['P6-1', 'Stripe 계정 + 사업자 정보', '결제액의 일정 비율 수수료', '국내 결제는 토스페이먼츠 등도 검토 가능'],
          ['P8-1', '도메인', '연 1~3만원 수준', '없으면 vercel.app 주소로도 운영 가능'],
          ['P8-2', '법률 전문가 검토 (약관·개인정보·환불)', '별도 견적', 'AI가 대신 판단할 수 없는 영역'],
        ],
        [1400, 4500, 3500, 5278]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      /* ---- 7. 리스크 ---- */
      h1('7. 리스크와 대응'),
      simpleTable(
        ['리스크', '내용', '대응', '대응 시점'],
        [
          ['API 원가가 구독료를 초과', '사용자가 많이 쓸수록 Anthropic API 비용이 커져 적자가 날 수 있음',
           '사용자별 월 사용 상한 설정, 프롬프트 캐싱으로 재사용분 할인, 단순 작업은 저렴한 모델로 분리', 'P7-4, P7-5'],
          ['Anthropic 정책 변경', '서드파티 서비스의 API 이용 조건이나 브랜딩 규정이 바뀔 수 있음',
           '착수 직전 약관 재확인, 처음부터 API 키 종량제를 전제로 설계, "Claude Code" 명칭 미사용', 'P8-3'],
          ['체험기간 남용', '이메일만 바꿔 무한 재가입하는 것을 완전히 막을 수는 없음',
           '이메일 인증, 카드 사전등록 요구 등으로 억제. 정책 수위는 사업 판단으로 결정', 'P6-5'],
          ['산출물 범위가 커짐', '"홈페이지"를 넘어 서버가 필요한 프로그램까지 요구하면 구조가 달라짐',
           'MVP는 정적 사이트(HTML·CSS·JS)로 한정. 확장은 별도 과제로 분리', 'P1-2 (Clarify)'],
          ['Phase 3에서 예상보다 지연', 'SDVC 엔진 이식이 이 프로젝트에서 가장 어려운 부분',
           '한 번에 완성하려 하지 말고 "대화만 되는 상태 → 문서 생성 → 파일 생성" 순으로 쪼개 진행', 'P3 전체'],
          ['세션이 끊겨 맥락 소실', '작업이 여러 날·여러 주에 걸치므로 이전 내용을 잊을 위험',
           '"작업 휴식"으로 progress.md에 6블록 형식 저장, "SDVC서버 구축"으로 이어받기', '상시'],
        ],
        [2200, 4200, 5278, 3000]
      ),
      p(''),

      /* ---- 8. 진행 방법 ---- */
      h1('8. 작업 진행 방법'),
      h2('8.1 시작과 중단'),
      simpleTable(
        ['명령', '동작'],
        [
          ['"SDVC서버 구축"', '작업 시작 또는 재개. progress.md를 읽어 지난 내용을 요약해 보여준 뒤, 기록된 "다음 할 일"부터 이어서 진행한다. 최초 시작도 같은 명령을 쓴다.'],
          ['"작업 휴식"', '작업 중단. 지금까지 진행한 내용(어디까지 왔나 · 방금 한 일 · 검증 증거 · 다음 할 일 · 막힌 것 · 알아둘 함정)을 progress.md에 저장하고 커밋한 뒤 종료한다.'],
        ],
        [3000, 11678]
      ),
      p(''),
      h2('8.2 매 세션의 흐름'),
      bullet('세션 시작 : "SDVC서버 구축" → Claude가 progress.md를 읽고 현재 위치를 보고 → 사용자가 확인'),
      bullet('작업 수행 : 이 WBS의 다음 작업 ID를 진행. 코드 작업은 RED(실패 테스트) → GREEN(구현) → REFACTOR(정리) 순서로, 각 단계마다 별도 커밋'),
      bullet('슬라이스 완료 시 : 실제로 브라우저에서 동작을 확인하고, 실행한 명령과 출력을 증거로 첨부'),
      bullet('세션 종료 : "작업 휴식" → progress.md 갱신 및 커밋'),
      h2('8.3 지켜지는 원칙 (헌장)'),
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

  // ---- 같은 데이터로 마크다운 쌍둥이 생성 (저장소 기록용) ----
  const mdOut = process.argv[3];
  if (!mdOut) return;
  const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const lines = [];
  lines.push('# SDVC 웹서비스 서버 구축 — WBS 및 작업일정표');
  lines.push('');
  lines.push('> 작성일 2026-09-07 · v1.0 · 대상 스킬 sdvc-guide v2.1.0');
  lines.push('> 배포본(docx): `20260907_SDVC_서버구축WBS.docx` — 이 md가 원본이며 docx는 `wbs.js`로 생성한다.');
  lines.push('> 시작·재개 명령 `SDVC서버 구축` / 중단 명령 `작업 휴식`');
  lines.push('');
  lines.push('## 상세 WBS');
  lines.push('');
  lines.push('| 작업 ID | 작업명 | 작업 내용 | 담당 | 산출물 | 예상 세션 |');
  lines.push('|---|---|---|---|---|---|');
  let total = 0;
  for (const r of [...P0, ...P1, ...P2, ...P3, ...P4, ...P5, ...P6, ...P7, ...P8]) {
    if (r.type === 'phase' || r.type === 'mile') {
      lines.push(`| **${esc(r.label)}** | | | | | |`);
    } else {
      lines.push('| ' + r.c.map(esc).join(' | ') + ' |');
      const n = parseFloat(r.c[5]);
      if (!isNaN(n)) total += n;
    }
  }
  lines.push('');
  lines.push(`**합계: ${total} 세션** (1세션 = 약 1~2시간 대화)`);
  lines.push('');
  lines.push('## 마일스톤');
  lines.push('');
  lines.push('| 마일스톤 | 시점 | 누적 세션 |');
  lines.push('|---|---|---|');
  lines.push('| M1 MVP 완성 | P5-5 완료 | 31.5 |');
  lines.push('| M2 판매 가능 | P6-7 완료 | 39.5 |');
  lines.push('| M3 출시 | P8-4 완료 | 53 |');
  lines.push('');
  lines.push('## 승인 게이트');
  lines.push('');
  lines.push('| 게이트 | 시점 | 결정할 내용 |');
  lines.push('|---|---|---|');
  lines.push('| G1 | P0-5 | 백엔드 언어, Claude 호출 방식, 저장소 구성 |');
  lines.push('| G2 | P1-3 | 기술 설계(plan.md) 승인 |');
  lines.push('| G3 | P1-4 | 작업 목록(tasks.md)과 순서 승인 |');
  lines.push('| G4 | P5-5 | MVP 실제 동작 최종 확인 |');
  lines.push('| G5 | P6-7 | 결제 흐름 정상 확인 |');
  lines.push('| G6 | P8-4 | 출시 승인 |');
  lines.push('');
  lines.push('상세한 역할 분담·준비물 체크리스트·리스크 대응은 docx 배포본을 참조한다.');
  lines.push('');
  fs.writeFileSync(mdOut, lines.join('\n'), 'utf8');
  console.log('WROTE', mdOut);
});
