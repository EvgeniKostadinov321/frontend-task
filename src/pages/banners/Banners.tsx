import BannerService from '../../services/banner.service.ts'
import ScrollableCards from '../../components/ScrollableCards.tsx'
import { useEffect } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import BannerCard from '../../components/banner/BannerCard.tsx'
import FAB from '../../components/FAB.tsx'
import { Box, Typography } from '@mui/joy'

export default function Banners() {
    const { setPageData } = usePageData()

    useEffect(() => {
        setPageData({ title: 'Banners' })
    }, [setPageData])

    return (
        <Box sx={{ width: '100%' }}>
            <Box 
                sx={{ 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <Typography level="h2">Banner Gallery</Typography>
            </Box>
            <ScrollableCards
                loadMore={page => BannerService.getBanners(page)}
                mapCard={(banner, deleteItem) => (
                    <BannerCard
                        key={banner.id}
                        banner={banner}
                        delete={async () => {
                            if (window.confirm('Are you sure you want to delete this banner?')) {
                                deleteItem(banner.id!)
                                await BannerService.deleteBanner(banner.id!)
                            }
                        }}
                    />
                )}
                skeletonMap={(_, i) => <BannerCard key={'skeleton-' + i} />}
            />
            <FAB />
        </Box>
    )
}
