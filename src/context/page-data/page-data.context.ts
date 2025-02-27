import { createContext, ReactNode, useContext } from 'react'

export interface PageDataContext {
    title: string
    button?: {
        label: string
        icon: ReactNode
        click: () => void
    }
}

export const PageDataContext = createContext({
    pageData: <PageDataContext>{},
    setPageData: (_pageData: PageDataContext) => {
    },
})

export function usePageData() {
    return useContext(PageDataContext)
}
