import BannerService from '../../services/banner.service.ts'
import ScrollableCards from '../../components/ScrollableCards.tsx'
import { useEffect, useState } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import BannerCard from '../../components/banner/BannerCard.tsx'
import FAB from '../../components/FAB.tsx'
import { Box, Typography } from '@mui/joy'
import ConfirmModal from '../../components/ConfirmModal'
import { useNotification } from '../../context/notification/notification.context.ts'

export default function Banners() {
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleteItemFunction, setDeleteItemFunction] = useState<((id: string) => void) | undefined>()
    const { setPageData } = usePageData()
    const { showNotification } = useNotification()

    useEffect(() => {
        setPageData({ title: 'Banners' })
    }, [setPageData])

    const handleDelete = (id: string, deleteItem: (id: string) => void) => {
        setDeleteId(id)
        setDeleteItemFunction(() => deleteItem)
    }

    const confirmDelete = async (deleteItem: (id: string) => void) => {
        if (deleteId) {
            try {
                await BannerService.deleteBanner(deleteId)
                deleteItem(deleteId) // Only remove from UI after successful deletion
                showNotification('Banner deleted successfully', 'success')
            } catch (error) {
                console.error('Failed to delete banner:', error)
                showNotification('Failed to delete banner', 'error')
            }
            setDeleteId(null)
            setDeleteItemFunction(undefined)
        }
    }

    return (
        <Box 
            sx={{ 
                width: '100%',
                maxWidth: { xs: '100%', sm: '100%', md: '95%', lg: '1400px' },  // Adjusted for better fit on laptops
                margin: '0 auto',
                px: { xs: 1, sm: 1, md: 2 }  // Added horizontal padding
            }}
        >
            <Box 
                sx={{ 
                    mb: { xs: 2, md: 3 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pb: 2
                }}
            >
                <Typography level="h2">Banner Gallery</Typography>
                
                {/* Optional: Add filter/sort controls here */}
                {/* <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="soft" size="sm" startDecorator={<FilterList />}>
                        Filter
                    </Button>
                </Box> */}
            </Box>
            
            <ScrollableCards
                loadMore={page => BannerService.getBanners(page)}
                mapCard={(banner, deleteItem) => (
                    <BannerCard
                        key={banner.id}
                        banner={banner}
                        delete={() => handleDelete(banner.id!, deleteItem)}
                    />
                )}
                skeletonMap={(_, i) => <BannerCard key={'skeleton-' + i} />}
                onDelete={confirmDelete}
                emptyStateProps={{
                    title: "No Banners Yet",
                    description: "Create your first banner to get started. Banners can be used to display promotions, announcements, or important information on your website.",
                    actionLabel: "Create First Banner",
                    actionPath: "/banners/create"
                }}
            />
            <FAB />
            <ConfirmModal
                open={!!deleteId}
                onClose={() => {
                    setDeleteId(null)
                    setDeleteItemFunction(undefined)
                }}
                confirm={confirmDelete}
                action="delete this banner"
                deleteItemFunction={deleteItemFunction}
            />
        </Box>
    )
}
