import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Search, MusicNote, VideoLibrary } from '@mui/icons-material';
import axios from 'axios';

function ArtistList({ onSelectArtist, onBack }) {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
        const response = await axios.get(`${apiUrl}/api/artists`);
        const sortedArtists = response.data.artists.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setArtists(sortedArtists);
        setFilteredArtists(sortedArtists);
      } catch (error) {
        console.error('아티스트 목록 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = artists.filter(artist =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArtists(filtered);
    } else {
      setFilteredArtists(artists);
    }
  }, [searchQuery, artists]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{ color: 'white', mr: 2 }}
          >
            돌아가기
          </Button>
          <MusicNote sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            아티스트 팬픽 라이브러리
          </Typography>
          <Chip
            label={`${filteredArtists.length}명`}
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="아티스트 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#667eea',
                },
              }
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredArtists.map((artist) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={artist.slug}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      borderColor: '#667eea',
                      borderWidth: 2
                    },
                    border: '2px solid transparent'
                  }}
                  onClick={() => onSelectArtist(artist.slug)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontWeight: 600,
                          fontSize: '1rem',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '2.6rem'
                        }}
                      >
                        {artist.name}
                      </Typography>
                      {artist.tracks_count > 0 && (
                        <VideoLibrary sx={{ color: '#667eea', ml: 1, fontSize: 20 }} />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                      <Chip
                        label={`${artist.tracks_count} tracks`}
                        size="small"
                        sx={{
                          bgcolor: artist.tracks_count > 0 ? '#e3f2fd' : '#f5f5f5',
                          color: artist.tracks_count > 0 ? '#1976d2' : '#9e9e9e'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && filteredArtists.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              검색 결과가 없습니다
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default ArtistList;
