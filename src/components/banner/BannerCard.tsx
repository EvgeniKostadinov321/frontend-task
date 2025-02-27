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
        <Grid xs={12} sm={6} md={4} lg={3}>
            <Card
                variant="outlined"
                sx={{
                    minHeight: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: 'background.surface',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 'lg',
                        borderColor: 'primary.300',
                    },
                }}
            >
                <CardOverflow sx={{ mb: 1 }}>
                    <AspectRatio 
                        ratio="16/9"
                        sx={{ 
                            minHeight: 200,
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Image url={props.banner?.imageUrl} />
                    </AspectRatio>
                </CardOverflow>
                
                <Box sx={{ p: 2, flex: 1 }}>
                    <Stack spacing={2}>
                        <Typography
                            level="title-md"
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
                        
                        <Typography level="body-sm" color="neutral">
                            <Skeleton loading={!props.banner} variant="text">
                                Click to visit the banner destination
                            </Skeleton>
                        </Typography>
                    </Stack>
                </Box>

                <CardActions sx={{ 
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.level1',
                    gap: 1 
                }}>
                    <IconButton
                        variant="plain"
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
                        variant="plain"
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
                        variant="plain"
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
