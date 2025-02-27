import { ReactNode, useState } from 'react'
import { PageDataContext } from './page-data.context.ts'

export function PageDataProvider(props: { children: ReactNode }) {
    const [pageData, setPageData] = useState<PageDataContext>({
        title: 'Banners',
    })

    return (
        <PageDataContext.Provider value={{ pageData, setPageData }}>
            {props.children}
        </PageDataContext.Provider>
    )
}
