import { InfoOutlined } from '@mui/icons-material'
import { IconButton, Tooltip, Typography } from '@mui/joy'
import React from 'react'

interface TooltipHelperProps {
  title: string
  description: string | React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export default function TooltipHelper({ title, description, placement = 'top' }: TooltipHelperProps) {
  return (
    <Tooltip
      title={
        <React.Fragment>
          <Typography fontWeight="bold" fontSize="sm">
            {title}
          </Typography>
          {typeof description === 'string' ? (
            <Typography fontSize="sm">{description}</Typography>
          ) : (
            description
          )}
        </React.Fragment>
      }
      variant="soft"
      placement={placement}
      arrow
    >
      <IconButton
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ ml: 0.5, p: 0.5, '&:hover': { bgcolor: 'transparent' } }}
      >
        <InfoOutlined fontSize="small" />
      </IconButton>
    </Tooltip>
  )
}
