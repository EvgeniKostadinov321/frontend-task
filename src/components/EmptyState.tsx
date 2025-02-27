import { Box, Button, Typography } from '@mui/joy'
import { Add, ImageOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion' // Note: We'd need to add framer-motion dependency

interface EmptyStateProps {
  title: string
  description: string
  actionLabel: string
  actionPath: string
  icon?: React.ReactNode
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionPath,
  icon = <ImageOutlined sx={{ fontSize: 60 }}/>
}: EmptyStateProps) {
  const navigate = useNavigate()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 4,
          gap: 2,
          minHeight: 300,
          border: '2px dashed',
          borderColor: 'neutral.200',
          borderRadius: 'lg',
          backgroundColor: 'background.level1',
        }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8] 
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        >
          {icon}
        </motion.div>

        <Typography level="h4" component="h2">
          {title}
        </Typography>
        <Typography level="body-md" color="neutral" sx={{ maxWidth: 450, mb: 2 }}>
          {description}
        </Typography>
        
        <Button
          startDecorator={<Add />}
          onClick={() => navigate(actionPath)}
          size="lg"
          color="primary"
        >
          {actionLabel}
        </Button>
      </Box>
    </motion.div>
  )
}
