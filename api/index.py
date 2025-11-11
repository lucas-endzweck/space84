from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json
import random

app = FastAPI(title="Space84 Artist Fanfic API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 프로젝트 내부 데이터 경로
BASE_DIR = Path(__file__).parent.parent
ARTISTS_DATA_DIR = BASE_DIR / "data" / "artists"

def load_artist_data(artist_slug):
    """JSON 파일에서 아티스트 데이터 로드"""
    json_path = ARTISTS_DATA_DIR / f"{artist_slug}.json"

    if not json_path.exists():
        return None

    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_fanfic(artist_data):
    """아티스트 데이터를 기반으로 팬픽 생성"""
    artist_name = artist_data.get('artist_name', 'Unknown')
    metadata = artist_data.get('metadata', {})
    tracks = artist_data.get('tracks', [])
    similar_artists = artist_data.get('similar_artists', [])
    youtube_videos = artist_data.get('youtube_videos', [])
    images = artist_data.get('images', [])
    spotify_url = artist_data.get('spotify_url', None)

    genres = metadata.get('genres', [])
    country = metadata.get('country', 'Unknown')

    # 이미지가 없으면 Unsplash placeholder 사용
    if not images:
        images = [
            f"https://source.unsplash.com/800x600/?music,concert,{artist_name.replace(' ', ',')}",
            f"https://source.unsplash.com/800x600/?musician,band,performance",
            f"https://source.unsplash.com/800x600/?music,festival,stage"
        ]

    # 장르 문자열 처리
    genre_str = genres[0] if isinstance(genres, list) and genres else 'rock'

    # 팬픽 템플릿
    fanfic_templates = [
        {
            "title": f"{artist_name}의 잃어버린 앨범",
            "story": f"""
어느 날, 한 음악 수집가가 중고 레코드 가게에서 먼지 덮인 LP를 발견했다.
커버에는 '{artist_name}'이라는 이름이 희미하게 적혀 있었다.

이 앨범은 {genre_str} 장르의 잃어버린 걸작으로,
{len(tracks)}개의 트랙이 담겨 있었다. 특히 '{tracks[0] if tracks else 'Unknown Track'}'은
청취자를 다른 세계로 데려가는 듯한 마법을 품고 있었다.

많은 사람들이 이 아티스트를 {similar_artists[0] if similar_artists else 'legendary musicians'}와
비교하곤 했지만, {artist_name}만의 독특한 색깔은 결코 복제될 수 없었다.

지금도 어딘가에서 이 레코드의 복사본을 찾는 팬들이 있다고 한다...
            """.strip()
        },
        {
            "title": f"한강변에서 울려 퍼진 {artist_name}의 멜로디",
            "story": f"""
서울의 한강변, 밤 11시.

누군가 작은 앰프를 들고 나타나 '{tracks[-1] if tracks else 'Unknown Track'}'을 연주하기 시작했다.
{artist_name}의 음악은 강물처럼 흘러갔고, 지나가던 사람들의 발걸음을 멈추게 했다.

{genre_str}의 리듬이 서울의 밤하늘에 녹아들었다.
누군가는 이 순간을 영상으로 남겼고, 그 영상은 곧 바이럴되었다.

"이게 진짜 음악이지," 한 댓글이 달렸다.
"{artist_name}, 당신의 음악은 시대를 초월합니다."

하지만 연주자는 이미 사라지고 없었다.
강변에는 오직 여운만이 남아 물결에 실려 흘러갔다...
            """.strip()
        },
        {
            "title": f"미스터리한 아티스트: {artist_name}의 정체",
            "story": f"""
{artist_name}은 음악계의 미스터리다.

겨우 {metadata.get('lastfm_listeners', 711)}명의 청취자만이 이 아티스트를 알고 있지만,
그들은 자신들이 특별한 비밀을 공유하고 있다고 믿는다.

일각에서는 {artist_name}이 사실 {similar_artists[0] if similar_artists else 'a famous musician'}의
비밀 프로젝트라고 추측한다. {country} 출신으로 알려져 있지만, 확실하지 않다.

{len(tracks)}개의 트랙만이 인터넷에 떠돌아다닌다:
{chr(10).join(f'- {track}' for track in tracks)}

이 곡들은 마치 퍼즐 조각처럼, 더 큰 그림의 일부분인 것 같다.
언젠가 {artist_name}의 전체 이야기가 밝혀질 날이 올까?

그때까지, 우리는 계속 듣고 또 들을 것이다...
            """.strip()
        }
    ]

    # 랜덤하게 팬픽 선택
    selected_fanfic = random.choice(fanfic_templates)

    response = {
        "artist_name": artist_name,
        "title": selected_fanfic["title"],
        "story": selected_fanfic["story"],
        "metadata": {
            "country": country,
            "genres": genres if isinstance(genres, list) else [genres],
            "tracks_count": len(tracks),
            "tracks": tracks,
            "similar_artists": similar_artists[:3]
        },
        "youtube_videos": youtube_videos,
        "images": images
    }

    if spotify_url:
        response["spotify_url"] = spotify_url

    return response

@app.get("/")
async def root():
    return {"message": "Welcome to Space84 StudyCafe"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/info")
async def info():
    return {
        "name": "Space84 StudyCafe",
        "version": "1.0.0",
        "description": "스터디카페 관리 시스템"
    }

@app.get("/api/artists")
async def list_artists():
    """모든 아티스트 목록 반환"""
    if not ARTISTS_DATA_DIR.exists():
        raise HTTPException(status_code=404, detail="Artists directory not found")

    artists = []
    for file_path in ARTISTS_DATA_DIR.glob("*.json"):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                artist_data = json.load(f)
                artists.append({
                    "name": artist_data.get('artist_name', file_path.stem),
                    "slug": artist_data.get('slug', file_path.stem),
                    "tracks_count": len(artist_data.get('tracks', []))
                })
        except Exception as e:
            continue

    return {"artists": artists, "total": len(artists)}

@app.get("/api/artists/{artist_slug}")
async def get_artist(artist_slug: str):
    """특정 아티스트 정보 반환"""
    artist_data = load_artist_data(artist_slug)

    if not artist_data:
        raise HTTPException(status_code=404, detail=f"Artist '{artist_slug}' not found")

    return artist_data

@app.get("/api/artists/{artist_slug}/fanfic")
async def get_artist_fanfic(artist_slug: str):
    """특정 아티스트의 팬픽 생성 및 반환"""
    artist_data = load_artist_data(artist_slug)

    if not artist_data:
        raise HTTPException(status_code=404, detail=f"Artist '{artist_slug}' not found")

    fanfic = generate_fanfic(artist_data)
    return fanfic
