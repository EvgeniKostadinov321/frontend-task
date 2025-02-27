import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import BannerForm from '../../components/banner/BannerForm.tsx'
import BannerService from '../../services/banner.service.ts'
import { BannerDto } from '../../services/dto/banner.dto.ts'
import { Grid } from '@mui/joy'

export default function BannerCreate() {
    const navigate = useNavigate()
    const { setPageData } = usePageData()

    useEffect(() => {
        setPageData({ title: 'Create Banner' })
    }, [setPageData])

    const handleSubmit = async (banner: BannerDto) => {
        try {
            await BannerService.createBanner(banner)
            navigate('/banners')
        } catch (error) {
            console.error('Failed to create banner:', error)
            // TODO: Add error notification
        }
    }

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid xs={12} md={8} lg={6}>
                <BannerForm 
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/banners')}
                />
            </Grid>
        </Grid>
    )
}
