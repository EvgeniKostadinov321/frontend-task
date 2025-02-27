import { Grid, Box, CircularProgress, Typography } from '@mui/joy'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useCallback, useEffect, useState } from 'react'
import { PageRequest } from '../services/dto/page.request.ts'
import { PageResponse } from '../services/dto/page.response.ts'

export default function ScrollableCards<T>(props: {
    loadMore: (page: PageRequest) => Promise<PageResponse<T> | undefined>
    mapCard: (value: T, deleteItem: (id: string) => void) => React.JSX.Element
    skeletonMap: (_: any, index: number) => React.JSX.Element
    onDelete: (deleteItem: (id: string) => void) => Promise<void>
}) {
    const [cards, setCards] = useState<React.JSX.Element[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loadedPages, setLoadedPages] = useState(new Set<number>())

    const deleteItem = useCallback((id: string) => {
        setCards((prevCardsState) => {
            const i = prevCardsState.findIndex((card) => card.key === id)
            if (i !== -1) {
                const newCards = [...prevCardsState]
                newCards.splice(i, 1)
                // If we're deleting the last item on a page, load more
                if (newCards.length === 0 && page > 0) {
                    setPage(prev => prev - 1)
                }
                return newCards
            }
            return prevCardsState
        })
    }, [page])

    const loadBanners = useCallback(async () => {
        if (loadedPages.has(page)) {
            setLoading(false)
            return
        }
        
        try {
            setLoading(true)
            const newCards = await props.loadMore({ page, pageSize: 12 })
            
            if (!newCards) {
                setHasMore(false)
                return
            }
            
            setLoadedPages(prev => new Set(prev).add(page))
            setPage(newCards.pageNumber + 1)
            setHasMore(newCards.maxPageNumber > newCards.pageNumber)
            
            const newElements = newCards.content.map((value) => props.mapCard(value, deleteItem))
            
            if (page === 0) {
                setCards(newElements)
            } else {
                setCards(prev => [...prev, ...newElements])
            }
        } finally {
            setLoading(false)
        }
    }, [page, props, deleteItem, loadedPages])

    // Reset states when component mounts
    useEffect(() => {
        setCards([])
        setPage(0)
        setLoadedPages(new Set())
        setHasMore(true)
    }, [])

    useEffect(() => {
        if (page != 0) return
        loadBanners().catch((reason) => console.error(reason))
    }, [loadBanners, page])

    const loadMore = () => {
        loadBanners().catch((reason) => console.error(reason))
    }

    return (
        <Box sx={{ 
            width: '100%',
            px: { xs: 1, sm: 2, md: 3 },
            py: 2
        }}>
            <InfiniteScroll
                dataLength={cards.length}
                next={loadMore}
                hasMore={hasMore}
                scrollableTarget="scroll"
                style={{
                    width: '100%',
                    overflow: 'visible'
                }}
                loader={loading && (
                    <Box sx={{ 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4
                    }}>
                        <CircularProgress size="lg" />
                    </Box>
                )}
                endMessage={
                    <Box sx={{
                        width: '100%',
                        p: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Typography 
                            level="body-lg"
                            sx={{ 
                                color: 'neutral.500',
                                fontStyle: 'italic'
                            }}
                        >
                            No more banners to load
                        </Typography>
                    </Box>
                }
            >
                <Grid 
                    container 
                    spacing={{ xs: 1, sm: 2, md: 3 }}
                    columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
                    sx={{ 
                        width: '100%',
                        margin: 0,
                        '--Grid-columnSpacing': { xs: '8px', sm: '16px', md: '24px' },
                        '--Grid-rowSpacing': { xs: '8px', sm: '16px', md: '24px' },
                    }}
                >
                    {cards}
                </Grid>
            </InfiniteScroll>
        </Box>
    )
}
