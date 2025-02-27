import { Grid } from '@mui/joy'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import { BannerDto } from '../../services/dto/banner.dto.ts'
import BannerService from '../../services/banner.service.ts'
import BannerForm from '../../components/banner/BannerForm.tsx'
import { useNotification } from '../../context/notification/notification.context.ts'

export default function Banner() {
    const { setPageData } = usePageData()
    const { id } = useParams()
    const navigate = useNavigate()
    const { showNotification } = useNotification()
    const [banner, setBanner] = useState<BannerDto>()
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const loadBanner = async () => {
            if (id) {
                try {
                    const result = await BannerService.getBanner(id)
                    if (!result) {
                        showNotification('Banner not found', 'error')
                        navigate('/banners')
                        return
                    }
                    setBanner(result)
                    setPageData({ title: `Edit Banner` })
                } catch (error) {
                    showNotification('Failed to load banner', 'error')
                    navigate('/banners')
                } finally {
                    setLoading(false)
                }
            }
        }
        loadBanner()
    }, [id, setPageData, navigate, showNotification])

    const handleSubmit = async (updatedBanner: BannerDto) => {
        if (id) {
            try {
                setIsSubmitting(true)
                await BannerService.updateBanner(id, updatedBanner)
                showNotification('Banner updated successfully', 'success')
                navigate('/banners')
            } catch (error) {
                showNotification('Failed to update banner', 'error')
                console.error('Error updating banner:', error)
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid xs={12} md={8} lg={6}>
                <BannerForm
                    banner={banner}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/banners')}
                    isLoading={loading || isSubmitting}
                />
            </Grid>
        </Grid>
    )
}
