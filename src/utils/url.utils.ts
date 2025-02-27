export const isValidImageUrl = (url: string): boolean => {
    try {
        const parsed = new URL(url)
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(parsed.pathname)
    } catch {
        return false
    }
}
