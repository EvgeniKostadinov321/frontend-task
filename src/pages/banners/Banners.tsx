import BannerService from '../../services/banner.service.ts'
import ScrollableCards from '../../components/ScrollableCards.tsx'
import { useEffect, useState } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import BannerCard from '../../components/banner/BannerCard.tsx'
import FAB from '../../components/FAB.tsx'
import { Box, Typography } from '@mui/joy'
import ConfirmModal from '../../components/ConfirmModal'

export default function Banners() {
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleteItemFunction, setDeleteItemFunction] = useState<((id: string) => void) | undefined>()
    const { setPageData } = usePageData()

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
            } catch (error) {
                console.error('Failed to delete banner:', error)
            }
            setDeleteId(null)
            setDeleteItemFunction(undefined)
        }
    }

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
                        delete={() => handleDelete(banner.id!, deleteItem)}
                    />
                )}
                skeletonMap={(_, i) => <BannerCard key={'skeleton-' + i} />}
                onDelete={confirmDelete}  // Add this prop
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
