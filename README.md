# Space84 StudyCafe

Space84 스터디카페 홈페이지 및 관리 시스템

## 기술 스택

- **Backend**: FastAPI (Python)
- **Frontend**: React + Material UI
- **배포**: Vercel

## 프로젝트 구조

```
space84-vercel/
├── api/                    # FastAPI 백엔드
│   └── main.py
├── frontend/               # React 프론트엔드
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── requirements.txt        # Python 의존성
├── vercel.json            # Vercel 배포 설정
└── package.json           # 루트 package.json
```

## 로컬 개발

### Backend (FastAPI)

```bash
# 의존성 설치
pip install -r requirements.txt

# 서버 실행
cd api
uvicorn main:app --reload --port 8000
```

### Frontend (React)

```bash
# 의존성 설치
cd frontend
npm install

# 개발 서버 실행
npm start
```

## Vercel 배포

1. Vercel CLI 설치
```bash
npm i -g vercel
```

2. 배포
```bash
vercel
```

3. 프로덕션 배포
```bash
vercel --prod
```

## API 엔드포인트

- `GET /` - 루트 엔드포인트
- `GET /api/health` - 헬스체크
- `GET /api/info` - API 정보

## 기능

- 좌석 관리 시스템
- 이용권 관리
- 카페 서비스 주문
