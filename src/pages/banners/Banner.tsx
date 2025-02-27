import { Grid } from '@mui/joy'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import { BannerDto } from '../../services/dto/banner.dto.ts'
import BannerService from '../../services/banner.service.ts'
import BannerForm from '../../components/banner/BannerForm.tsx'

export default function Banner() {
    const { setPageData } = usePageData()
    const { id } = useParams()
    const navigate = useNavigate()
    const [banner, setBanner] = useState<BannerDto>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadBanner = async () => {
            if (id) {
                const result = await BannerService.getBanner(id)
                setBanner(result)
                setLoading(false)
                setPageData({ title: `Edit Banner` })
            }
        }
        loadBanner()
    }, [id, setPageData])

    const handleSubmit = async (updatedBanner: BannerDto) => {
        if (id) {
            await BannerService.updateBanner(id, updatedBanner)
            navigate('/banners')
        }
    }

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid xs={12} md={8} lg={6}>
                <BannerForm
                    banner={banner}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/banners')}
                    isLoading={loading}
                />
            </Grid>
        </Grid>
    )
}
