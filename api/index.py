from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import re
import random

app = FastAPI(title="Space84 StudyCafe API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 아티스트 데이터 경로
ARTISTS_DIR = Path("/Users/lucas.t/Desktop/obsidian/Publish/music/artists")

def parse_artist_file(file_path):
    """아티스트 마크다운 파일 파싱"""
    content = file_path.read_text(encoding='utf-8')

    # YAML frontmatter 추출
    frontmatter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not frontmatter_match:
        return None

    metadata = {}
    yaml_content = frontmatter_match.group(1)

    for line in yaml_content.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            metadata[key] = value

    # 플레이리스트 곡 목록 추출
    tracks_section = re.search(r'## 🎧 내 플레이리스트에 있는 곡\n\n(.*?)(?=\n##|\Z)', content, re.DOTALL)
    tracks = []
    if tracks_section:
        for line in tracks_section.group(1).split('\n'):
            line = line.strip()
            if line.startswith('- '):
                tracks.append(line[2:])

    # 유사 아티스트 추출
    similar_artists = []
    similar_section = re.search(r'Last\.fm 기반 \(유사도 순\):\n\n(.*?)(?=\n##|\Z)', content, re.DOTALL)
    if similar_section:
        for line in similar_section.group(1).split('\n'):
            match = re.match(r'\d+\.\s+\[(.*?)\]', line)
            if match:
                similar_artists.append(match.group(1))

    return {
        'metadata': metadata,
        'tracks': tracks,
        'similar_artists': similar_artists
    }

def get_youtube_videos(artist_name, tracks):
    """아티스트의 유튜브 비디오 ID 생성 (실제로는 검색 API를 사용해야 함)"""
    # 실제 구현에서는 YouTube API를 사용하거나, 아티스트 마크다운 파일에서 읽어올 수 있습니다
    # 여기서는 샘플로 일반적인 검색 쿼리 기반 임베드를 생성합니다
    videos = []

    # 트랙 기반으로 유튜브 검색 쿼리 생성
    for i, track in enumerate(tracks[:3]):
        # 유튜브 검색 URL 형식
        search_query = f"{artist_name} {track}".replace(' ', '+')
        videos.append({
            'title': track,
            'search_query': search_query,
            # 실제 비디오 ID는 YouTube API를 통해 가져와야 합니다
            # 여기서는 임시로 검색 결과 페이지 링크를 제공
            'embed_url': f"https://www.youtube.com/results?search_query={search_query}"
        })

    return videos

def get_artist_images(artist_name):
    """아티스트 이미지 URL 생성"""
    # 실제 구현에서는 Last.fm API나 MusicBrainz API에서 이미지를 가져올 수 있습니다
    # 여기서는 Unsplash의 music 관련 이미지를 샘플로 사용
    images = [
        f"https://source.unsplash.com/800x600/?music,concert,{artist_name.replace(' ', ',')}",
        f"https://source.unsplash.com/800x600/?musician,band,performance",
        f"https://source.unsplash.com/800x600/?music,festival,stage"
    ]
    return images

def generate_fanfic(artist_data):
    """아티스트 데이터를 기반으로 팬픽 생성"""
    metadata = artist_data['metadata']
    tracks = artist_data['tracks']
    similar_artists = artist_data['similar_artists']

    artist_name = metadata.get('artist_name', 'Unknown')
    genres = metadata.get('genres', '[]').strip('[]').split(', ')
    country = metadata.get('country', 'Unknown')

    # 유튜브 비디오와 이미지 추가
    youtube_videos = get_youtube_videos(artist_name, tracks)
    artist_images = get_artist_images(artist_name)

    # 팬픽 템플릿
    fanfic_templates = [
        {
            "title": f"{artist_name}의 잃어버린 앨범",
            "story": f"""
어느 날, 한 음악 수집가가 중고 레코드 가게에서 먼지 덮인 LP를 발견했다.
커버에는 '{artist_name}'이라는 이름이 희미하게 적혀 있었다.

이 앨범은 {genres[0] if genres else 'rock'} 장르의 잃어버린 걸작으로,
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

{genres[0] if genres else 'rock'}의 리듬이 서울의 밤하늘에 녹아들었다.
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

겨우 {metadata.get('lastfm_listeners', '711')}명의 청취자만이 이 아티스트를 알고 있지만,
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

    return {
        "artist_name": artist_name,
        "title": selected_fanfic["title"],
        "story": selected_fanfic["story"],
        "metadata": {
            "country": country,
            "genres": genres,
            "tracks_count": len(tracks),
            "tracks": tracks,
            "similar_artists": similar_artists[:3]
        },
        "youtube_videos": youtube_videos,
        "images": artist_images
    }

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
    if not ARTISTS_DIR.exists():
        raise HTTPException(status_code=404, detail="Artists directory not found")

    artists = []
    for file_path in ARTISTS_DIR.glob("*.md"):
        artist_data = parse_artist_file(file_path)
        if artist_data:
            artists.append({
                "name": artist_data['metadata'].get('artist_name', file_path.stem),
                "slug": file_path.stem,
                "tracks_count": len(artist_data['tracks'])
            })

    return {"artists": artists, "total": len(artists)}

@app.get("/api/artists/{artist_slug}")
async def get_artist(artist_slug: str):
    """특정 아티스트 정보 반환"""
    file_path = ARTISTS_DIR / f"{artist_slug}.md"

    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"Artist '{artist_slug}' not found")

    artist_data = parse_artist_file(file_path)
    if not artist_data:
        raise HTTPException(status_code=500, detail="Failed to parse artist file")

    return artist_data

@app.get("/api/artists/{artist_slug}/fanfic")
async def get_artist_fanfic(artist_slug: str):
    """특정 아티스트의 팬픽 생성 및 반환"""
    file_path = ARTISTS_DIR / f"{artist_slug}.md"

    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"Artist '{artist_slug}' not found")

    artist_data = parse_artist_file(file_path)
    if not artist_data:
        raise HTTPException(status_code=500, detail="Failed to parse artist file")

    fanfic = generate_fanfic(artist_data)
    return fanfic
