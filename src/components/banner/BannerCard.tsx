import { BannerDto } from '../../services/dto/banner.dto.ts'
import { AspectRatio, Card, CardActions, CardOverflow, Grid, Skeleton, Typography, Stack } from '@mui/joy'
import Box from '@mui/joy/Box'
import IconButton from '@mui/joy/IconButton'
import { Delete, Edit, Launch } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import Image from '../Image.tsx'

export default function BannerCard(props: { banner?: BannerDto; delete?: () => void }) {
    const navigate = useNavigate()

    return (
        <Grid xs={12} sm={6} md={6} lg={4} xl={3}>
            <Card
                variant="outlined"
                sx={{
                    height: '100%',
                    minHeight: { xs: 380, md: 420 },
                    maxWidth: { xs: '100%', sm: '100%', md: '450px', lg: '400px' },
                    width: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: 'background.surface',
                    boxShadow: 'sm',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 'md',
                        borderColor: 'primary.300',
                    },
                }}
            >
                <CardOverflow>
                    <AspectRatio 
                        ratio="16/9"
                        sx={{ 
                            minHeight: { xs: 180, md: 200, lg: 220 },
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Image url={props.banner?.imageUrl} />
                    </AspectRatio>
                </CardOverflow>
                
                <Box sx={{ p: { xs: 2, md: 2.5 }, flex: 1 }}>
                    <Stack spacing={2}>
                        <Typography
                            level="title-md"
                            fontWeight="bold"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            <Skeleton loading={!props.banner} variant="text">
                                {props.banner?.link}
                            </Skeleton>
                        </Typography>
                        
                        <Typography 
                            level="body-sm" 
                            color="neutral"
                            sx={{
                                fontSize: { md: '0.875rem', lg: '0.9rem' }
                            }}
                        >
                            <Skeleton loading={!props.banner} variant="text">
                                Banner destination URL
                            </Skeleton>
                        </Typography>
                    </Stack>
                </Box>

                <CardActions sx={{ 
                    p: { xs: 2, md: 2.5 },
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.level1',
                    gap: { xs: 1, md: 1.5 }
                }}>
                    <IconButton
                        variant="soft"
                        color="danger"
                        size="sm"
                        onClick={props.delete}
                        sx={{
                            '&:hover': { bgcolor: 'danger.softBg' }
                        }}
                    >
                        <Delete />
                    </IconButton>
                    <IconButton
                        variant="soft"
                        color="primary"
                        size="sm"
                        onClick={() => navigate(`/banners/${props.banner?.id}`)}
                        sx={{
                            '&:hover': { bgcolor: 'primary.softBg' }
                        }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        variant="soft"
                        color="neutral"
                        size="sm"
                        component="a"
                        href={props.banner?.link}
                        target="_blank"
                        sx={{ 
                            ml: 'auto',
                            '&:hover': { bgcolor: 'neutral.softBg' }
                        }}
                    >
                        <Launch />
                    </IconButton>
                </CardActions>
            </Card>
        </Grid>
    )
}
