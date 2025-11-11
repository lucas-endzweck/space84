import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button
} from '@mui/material';
import { LocalCafe, EventSeat, AccessTime, MusicNote } from '@mui/icons-material';
import axios from 'axios';
import ArtistFanfic from './ArtistFanfic';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [apiInfo, setApiInfo] = useState(null);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
        const response = await axios.get(`${apiUrl}/api/info`);
        setApiInfo(response.data);
      } catch (error) {
        console.error('API 호출 실패:', error);
      }
    };
    fetchData();
  }, []);

  if (currentView === 'fanfic') {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ArtistFanfic
          artistSlug="2-day-old-sneakers"
          onBack={() => setCurrentView('home')}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <LocalCafe sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Space84 StudyCafe
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            환영합니다!
          </Typography>

          {apiInfo && (
            <Box sx={{ mb: 4, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body1">
                API 연결 성공: {apiInfo.name} v{apiInfo.version}
              </Typography>
            </Box>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <EventSeat color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h5" component="div" gutterBottom>
                    좌석 관리
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    실시간 좌석 현황 확인 및 예약
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2 }}>
                    좌석 보기
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <AccessTime color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h5" component="div" gutterBottom>
                    이용권 관리
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    시간권, 기간권 구매 및 관리
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2 }}>
                    이용권 구매
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <LocalCafe color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h5" component="div" gutterBottom>
                    카페 서비스
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    음료 및 간식 주문
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2 }}>
                    주문하기
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <CardContent>
                  <MusicNote sx={{ fontSize: 40, mb: 2, color: 'white' }} />
                  <Typography variant="h5" component="div" gutterBottom sx={{ color: 'white' }}>
                    아티스트 팬픽
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    207명의 아티스트 팬픽 보기
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: 'white',
                      color: '#667eea',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                    onClick={() => setCurrentView('fanfic')}
                  >
                    팬픽 보기
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;