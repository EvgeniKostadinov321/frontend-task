import { Grid } from '@mui/joy'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useCallback, useEffect, useState } from 'react'
import { PageRequest } from '../services/dto/page.request.ts'
import { PageResponse } from '../services/dto/page.response.ts'

export default function ScrollableCards<T>(props: {
    loadMore: (page: PageRequest) => Promise<PageResponse<T> | undefined>
    mapCard: (value: T, deleteItem: (id: string) => void) => React.JSX.Element
    skeletonMap: (_: any, index: number) => React.JSX.Element
}) {
    const [cards, setCards] = useState<React.JSX.Element[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loadedPages, setLoadedPages] = useState(new Set<number>())

    const deleteItem = useCallback((id: string) => {
        setCards((prevCardsState) => {
            const i = prevCardsState.findIndex((card) => card.key == id)
            if (i != -1) {
                const newCards = [...prevCardsState]
                newCards.splice(i, 1)
                return newCards
            }
            return prevCardsState
        })
    }, [])

    const loadBanners = useCallback(async () => {
        if (loadedPages.has(page)) return; // Skip if page already loaded
        
        try {
            const newCards = await props.loadMore({ page, pageSize: 12 })
            if (!newCards) return;
            
            setLoadedPages(prev => new Set(prev).add(page))
            setPage(newCards.pageNumber + 1) // Increment page for next load
            setHasMore(newCards.maxPageNumber > newCards.pageNumber)
            
            const newElements = newCards.content.map((value) => props.mapCard(value, deleteItem))
            
            if (page === 0) {
                setCards(newElements) // Replace cards for first page
            } else {
                setCards(prev => [...prev, ...newElements]) // Append for subsequent pages
            }
        } finally {
            setLoading(false)
        }
    }, [page, props, deleteItem, loadedPages])

    useEffect(() => {
        if (page != 0) return
        loadBanners().catch((reason) => console.error(reason))
    }, [loadBanners, page])

    const loadMore = () => {
        loadBanners().catch((reason) => console.error(reason))
    }

    return (
        <Grid container spacing={2}>
            {loading && props.skeletonMap(null, 0)}
            <InfiniteScroll
                dataLength={cards.length}
                next={loadMore}
                hasMore={hasMore}
                scrollableTarget="scroll"
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>There are no more items available...</b>
                    </p>
                }
            >
                {cards}
            </InfiniteScroll>
        </Grid>
    )
}
