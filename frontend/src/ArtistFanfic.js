import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  ImageList,
  ImageListItem,
  Grid
} from '@mui/material';
import { MusicNote, Refresh, Home, PhotoLibrary, VideoLibrary } from '@mui/icons-material';
import axios from 'axios';

function ArtistFanfic({ artistSlug, onBack }) {
  const [fanfic, setFanfic] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFanfic = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      const response = await axios.get(`${apiUrl}/api/artists/${artistSlug}/fanfic`);
      setFanfic(response.data);
    } catch (error) {
      console.error('팬픽 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [artistSlug]);

  useEffect(() => {
    fetchFanfic();
  }, [fetchFanfic]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!fanfic) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>팬픽을 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onBack} sx={{ mr: 2 }}>
            <Home />
          </IconButton>
          <MusicNote sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            아티스트 팬픽
          </Typography>
          <Button
            color="inherit"
            startIcon={<Refresh />}
            onClick={fetchFanfic}
          >
            새로고침
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {fanfic.title}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                아티스트: {fanfic.artist_name}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={fanfic.metadata.country} size="small" color="primary" variant="outlined" />
                {fanfic.metadata.genres.map((genre, idx) => (
                  <Chip key={idx} label={genre} size="small" />
                ))}
              </Stack>
            </Box>

            <Box sx={{
              bgcolor: 'grey.50',
              p: 3,
              borderRadius: 2,
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              mb: 3
            }}>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-line',
                  lineHeight: 1.8,
                  fontSize: '1.1rem'
                }}
              >
                {fanfic.story}
              </Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                💿 플레이리스트 곡 ({fanfic.metadata.tracks_count}개)
              </Typography>
              <Stack spacing={1}>
                {fanfic.metadata.tracks.map((track, idx) => (
                  <Box key={idx} sx={{
                    p: 1.5,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <MusicNote sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>{track}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {fanfic.metadata.similar_artists.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  🎵 유사 아티스트
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {fanfic.metadata.similar_artists.map((artist, idx) => (
                    <Chip key={idx} label={artist} variant="outlined" />
                  ))}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* 이미지 갤러리 */}
        {fanfic.images && fanfic.images.length > 0 && (
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhotoLibrary sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  📸 아티스트 이미지 갤러리
                </Typography>
              </Box>
              <ImageList cols={3} gap={8}>
                {fanfic.images.map((image, idx) => (
                  <ImageListItem key={idx}>
                    <img
                      src={image}
                      alt={`${fanfic.artist_name} ${idx + 1}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </CardContent>
          </Card>
        )}

        {/* 유튜브 비디오 */}
        {fanfic.youtube_videos && fanfic.youtube_videos.length > 0 && (
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <VideoLibrary sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">
                  🎬 대표곡 유튜브
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {fanfic.youtube_videos.map((video, idx) => (
                  <Grid item xs={12} md={4} key={idx}>
                    <Box>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {video.title}
                      </Typography>
                      <Box
                        sx={{
                          position: 'relative',
                          paddingBottom: '56.25%',
                          height: 0,
                          overflow: 'hidden',
                          borderRadius: 2,
                          bgcolor: 'grey.200'
                        }}
                      >
                        <iframe
                          src={`https://www.youtube.com/embed/${video.video_id || 'dQw4w9WgXcQ'}`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onBack}
            startIcon={<Home />}
          >
            홈으로 돌아가기
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ArtistFanfic;
