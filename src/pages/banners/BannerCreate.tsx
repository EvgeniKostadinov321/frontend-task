import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import BannerForm from '../../components/banner/BannerForm.tsx'
import BannerService from '../../services/banner.service.ts'
import { BannerDto } from '../../services/dto/banner.dto.ts'
import { Grid } from '@mui/joy'
import { useNotification } from '../../context/notification/notification.context.ts'

export default function BannerCreate() {
    const navigate = useNavigate()
    const { setPageData } = usePageData()
    const { showNotification } = useNotification()
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setPageData({ title: 'Create Banner' })
    }, [setPageData])

    const handleSubmit = async (banner: BannerDto) => {
        try {
            setIsSubmitting(true)
            await BannerService.createBanner(banner)
            showNotification('Banner created successfully!', 'success')
            navigate('/banners')
        } catch (error) {
            console.error('Failed to create banner:', error)
            showNotification('Failed to create banner', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid xs={12} md={8} lg={6}>
                <BannerForm 
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/banners')}
                    isLoading={isSubmitting}
                />
            </Grid>
        </Grid>
    )
}
