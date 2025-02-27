import { Button, FormControl, FormLabel, Input, Stack, Box, Typography } from '@mui/joy'
import { FormEvent, useState } from 'react'
import { BannerDto } from '../../services/dto/banner.dto.ts'
import Image from '../Image.tsx'
import { isValidImageUrl } from '../../utils/url.utils.ts'
import { motion } from 'framer-motion'
import TooltipHelper from '../TooltipHelper'

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <FormControl error={!!errors.imageUrl}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormLabel>Image URL</FormLabel>
                            <TooltipHelper
                                title="Image URL"
                                description="Enter a direct URL to an image (JPG, PNG, etc). The image will be displayed on the banner card."
                                placement="right"
                            />
                        </Box>
                        <Input
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            disabled={isLoading}
                            slotProps={{
                                input: {
                                    component: motion.input,
                                    initial: { x: -20, opacity: 0 },
                                    animate: { x: 0, opacity: 1 },
                                    transition: { delay: 0.1 }
                                }
                            }}
                        />
                        {errors.imageUrl && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.2 }}
                            >
                                <Typography level="body-xs" color="danger">
                                    {errors.imageUrl}
                                </Typography>
                            </motion.div>
                        )}
                    </FormControl>
                    
                    {imageUrl && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image url={imageUrl} />
                        </motion.div>
                    )}

                    <FormControl error={!!errors.link}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormLabel>Link</FormLabel>
                            <TooltipHelper
                                title="Destination URL"
                                description="Enter the URL where users will be directed when they click on the banner."
                                placement="right"
                            />
                        </Box>
                        <Input
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            disabled={isLoading}
                            slotProps={{
                                input: {
                                    component: motion.input,
                                    initial: { x: -20, opacity: 0 },
                                    animate: { x: 0, opacity: 1 },
                                    transition: { delay: 0.2 }
                                }
                            }}
                        />
                        {errors.link && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.2 }}
                            >
                                <Typography level="body-xs" color="danger">
                                    {errors.link}
                                </Typography>
                            </motion.div>
                        )}
                    </FormControl>

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button 
                                variant="plain" 
                                color="neutral" 
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button 
                                type="submit" 
                                loading={isLoading}
                            >
                                {banner ? 'Update' : 'Create'} Banner
                            </Button>
                        </motion.div>
                    </Stack>
                </Stack>
            </form>
        </motion.div>
    )
}
