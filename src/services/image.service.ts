class ImageService {
    async fetchImage(url: string) {
        try {
            const response = await fetch(url, {
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })

            if (response.ok) {
                const blob = await response.blob()
                return URL.createObjectURL(blob)
            }
        } catch (error) {
            console.error('Error loading image:', error)
            // Return a placeholder image URL or null
            return null
        }
        return null
    }
}

export default new ImageService()
