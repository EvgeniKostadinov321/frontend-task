import { Button, FormControl, FormLabel, Input, Stack } from '@mui/joy'
import { FormEvent, useState } from 'react'
import { BannerDto } from '../../services/dto/banner.dto.ts'
import Image from '../Image.tsx'
import { isValidImageUrl } from '../../utils/url.utils.ts'

interface BannerFormProps {
    banner?: BannerDto
    onSubmit: (banner: BannerDto) => Promise<void>
    onCancel: () => void
    isLoading?: boolean
}

export default function BannerForm({ banner, onSubmit, onCancel, isLoading }: BannerFormProps) {
    const [imageUrl, setImageUrl] = useState(banner?.imageUrl || '')
    const [link, setLink] = useState(banner?.link || '')
    const [errors, setErrors] = useState<{imageUrl?: string, link?: string}>({})

    const validate = () => {
        const newErrors: {imageUrl?: string, link?: string} = {}
        if (!imageUrl) {
            newErrors.imageUrl = 'Image URL is required'
        } else if (!isValidImageUrl(imageUrl)) {
            newErrors.imageUrl = 'Please enter a valid image URL'
        }
        if (!link) newErrors.link = 'Link is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        await onSubmit({
            id: banner?.id,
            imageUrl,
            link
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <FormControl error={!!errors.imageUrl}>
                    <FormLabel>Image URL</FormLabel>
                    <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        disabled={isLoading}
                    />
                </FormControl>
                
                {imageUrl && (
                    <Image url={imageUrl} />
                )}

                <FormControl error={!!errors.link}>
                    <FormLabel>Link</FormLabel>
                    <Input
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        disabled={isLoading}
                    />
                </FormControl>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button 
                        variant="plain" 
                        color="neutral" 
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        loading={isLoading}
                    >
                        {banner ? 'Update' : 'Create'} Banner
                    </Button>
                </Stack>
            </Stack>
        </form>
    )
}
