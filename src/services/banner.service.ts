import { PageRequest } from './dto/page.request.ts'
import { BannerDto } from './dto/banner.dto.ts'
import { PageResponse } from './dto/page.response.ts'

class BannerService {
    private readonly BANNER_KEY = 'banners'

    async createBanner(banner: BannerDto) {
        const newBanner = {
            ...banner,
            id: crypto.randomUUID()
        }
        this.saveBanners([newBanner, ...this.listBanners()])
        return newBanner
    }

    async getBanners(page: PageRequest) {
        if (!page.page) page.page = 0
        if (!page.pageSize) page.pageSize = 12
        let banners = this.listBanners()
        const total = banners.length
        // Ensure we're getting the correct slice of banners for the current page
        banners = banners.slice(page.page * page.pageSize, (page.page + 1) * page.pageSize)
        if (page.orderBy) {
            banners = banners.sort((a, b) => {
                const valueA = (Object.entries(a).find(value => value[0] === page.orderBy) || [])[1]
                const valueB = (Object.entries(b).find(value => value[0] === page.orderBy) || [])[1]
                if (valueA < valueB) return -1
                if (valueA > valueB) return 1
                return 0
            })
            if (page.orderType === 'desc') {
                banners = banners.reverse()
            }
        }

        return {
            content: banners,
            pageSize: page.pageSize,
            pageNumber: page.page,
            maxPageNumber: total / page.pageSize,
        } as PageResponse<BannerDto>
    }

    async getBanner(id: string) {
        return this.listBanners().find(banner => banner.id === id)
    }

    async updateBanner(id: string, banner: BannerDto) {
        const banners = this.listBanners()
        const index = banners.findIndex(b => b.id === id)
        if (index !== -1) {
            banners[index] = { ...banner, id }
            this.saveBanners(banners)
            return banners[index]
        }
        return null
    }

    async deleteBanner(id: string) {
        const banners = this.listBanners()
        const filteredBanners = banners.filter(banner => banner.id !== id)
        this.saveBanners(filteredBanners)
    }

    private listBanners() {
        return JSON.parse(localStorage.getItem(this.BANNER_KEY) || '[]') as BannerDto[]
    }

    private saveBanners(banners: BannerDto[]) {
        localStorage.setItem(this.BANNER_KEY, JSON.stringify(banners))
    }
}

export default new BannerService()
