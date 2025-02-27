import * as React from 'react'
import { useState } from 'react'
import GlobalStyles from '@mui/joy/GlobalStyles'
import Box from '@mui/joy/Box'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/List'
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton'
import ListItemContent from '@mui/joy/ListItemContent'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'
import ImageIcon from '@mui/icons-material/Image'
import IconButton from '@mui/joy/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import ColorSchemeToggle from './ColorSchemeToggle'
import { closeSidebar } from '../utils'
import { useLocation, useNavigate } from 'react-router-dom'

const items = [
    {
        title: 'Banners',
        icon: <ImageIcon />,
        href: '/banners',
    },
]

function SidebarItems({ isCollapsed }: { isCollapsed: boolean }) {
    const [selected, setSelected] = useState<string>(useLocation().pathname || '/')
    const navigate = useNavigate()

    const handleNavigation = (href: string) => {
        setSelected(href)
        navigate(href)
    }
    return items.map((item, index) => (
        <React.Fragment key={index}>
            <ListItem
                key={index}
            >
                <ListItemButton
                    selected={selected === item.href}
                    role="menuitem"
                    onClick={() => handleNavigation(item.href)}
                    sx={{
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        minHeight: 44,
                    }}
                >
                    {item.icon}
                    {!isCollapsed && (
                        <ListItemContent>
                            <Typography level="title-sm">{item.title}</Typography>
                        </ListItemContent>
                    )}
                </ListItemButton>
            </ListItem>
        </React.Fragment>
    ))
}

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <Sheet
            className="Sidebar"
            sx={{
                position: { xs: 'fixed', md: 'sticky' },
                display: { xs: 'none', md: 'flex' },
                transform: {
                    xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                    md: 'none',
                },
                transition: 'transform 0.4s, width 0.4s',
                zIndex: 10000,
                height: '100dvh',
                width: isCollapsed ? 'var(--Sidebar-width-collapsed)' : 'var(--Sidebar-width)',
                top: 0,
                p: 2,
                flexShrink: 0,
                flexDirection: 'column',
                gap: 2,
                borderRight: '1px solid',
                borderColor: 'divider',
                // Position is already defined above
            }}
        >
            <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        '--Sidebar-width': '220px',
                        '--Sidebar-width-collapsed': '64px',
                        [theme.breakpoints.up('lg')]: {
                            '--Sidebar-width': '240px',
                        },
                    },
                })}
            />
            <Box
                className="Sidebar-overlay"
                sx={{
                    position: 'fixed',
                    zIndex: 9998,
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    opacity: 'var(--SideNavigation-slideIn)',
                    backgroundColor: 'var(--joy-palette-background-backdrop)',
                    transition: 'opacity 0.4s',
                    transform: {
                        xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
                        lg: 'translateX(-100%)',
                    },
                }}
                onClick={() => closeSidebar()}
            />
            <IconButton
                onClick={() => setIsCollapsed(!isCollapsed)}
                sx={{
                    position: 'absolute',
                    right: '-20px', // Half the button width to stick out
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderRadius: '50%',
                    backgroundColor: 'background.surface',
                    border: '1px solid',
                    borderColor: 'divider',
                    zIndex: 1000,
                    '&:hover': {
                        backgroundColor: 'background.level1',
                    }
                }}
                size="sm"
            >
                {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: isCollapsed ? 'center' : 'flex-start',
                }}
            >
                {!isCollapsed && (
                    <Typography 
                        level="title-lg"
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        Domain Management
                    </Typography>
                )}
                <ColorSchemeToggle />
            </Box>
            <Box
                sx={{
                    minHeight: 0,
                    overflow: 'hidden auto',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    [`& .${listItemButtonClasses.root}`]: {
                        gap: 1.5,
                    },
                }}
            >
                <List
                    size="sm"
                    sx={{
                        gap: 1,
                        '--List-nestedInsetStart': '30px',
                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                    }}
                >
                    <SidebarItems isCollapsed={isCollapsed} />
                </List>
            </Box>
        </Sheet>
    )
}
