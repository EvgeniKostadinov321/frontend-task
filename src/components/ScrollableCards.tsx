import { Grid, Box, CircularProgress, Typography } from '@mui/joy'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useCallback, useEffect, useState } from 'react'
import { PageRequest } from '../services/dto/page.request.ts'
import { PageResponse } from '../services/dto/page.response.ts'
import EmptyState from './EmptyState'
import { motion } from 'framer-motion' // Add missing import

export default function ScrollableCards<T>(props: {
    loadMore: (page: PageRequest) => Promise<PageResponse<T> | undefined>
    mapCard: (value: T, deleteItem: (id: string) => void) => React.JSX.Element
    skeletonMap: (_: any, index: number) => React.JSX.Element
    onDelete: (deleteItem: (id: string) => void) => Promise<void>
    emptyStateProps?: {
        title: string;
        description: string;
        actionLabel: string;
        actionPath: string;
    }
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

    // Check if there are no banners
    const isEmpty = !loading && cards.length === 0

    return (
        <Box sx={{ 
            width: '100%',
            px: { xs: 0, sm: 0, md: 0, lg: 0 },
            py: 2
        }}>
            {isEmpty && props.emptyStateProps ? (
                <EmptyState {...props.emptyStateProps} />
            ) : (
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
                            mt: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderTop: '1px solid',
                            borderColor: 'divider'
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Grid 
                            container 
                            spacing={{ xs: 1, sm: 1.5, md: 2, lg: 3 }}  // Reduced spacing on medium screens
                            columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
                            sx={{ 
                                width: '100%',
                                margin: 0,
                                '--Grid-columnSpacing': { 
                                    xs: '8px', 
                                    sm: '12px', 
                                    md: '16px',  // Reduced from 24px
                                    lg: '24px' 
                                },
                                '--Grid-rowSpacing': { 
                                    xs: '12px', 
                                    sm: '16px', 
                                    md: '20px',  // Reduced from 28px
                                    lg: '28px' 
                                },
                            }}
                        >
                            {cards}
                        </Grid>
                    </motion.div>
                </InfiniteScroll>
            )}
        </Box>
    )
}
