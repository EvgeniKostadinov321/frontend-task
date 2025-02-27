import { Box, Button, Card, CardContent, Modal, ModalClose, ModalDialog, Step, StepIndicator, Stepper, Typography } from '@mui/joy'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AddCircleOutline, EditOutlined, DeleteOutlined } from '@mui/icons-material'

export default function WelcomeGuide() {
  const [open, setOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  
  useEffect(() => {
    // Only show on first visit
    const hasSeenGuide = localStorage.getItem('hasSeenWelcomeGuide')
    if (!hasSeenGuide) {
      setOpen(true)
      localStorage.setItem('hasSeenWelcomeGuide', 'true')
    }
  }, [])

  const steps = [
    {
      title: 'Welcome to Banner Manager',
      content: 'This tool helps you create and manage banners for your website. Let\'s go through a quick tutorial.',
      icon: null
    },
    {
      title: 'Creating Banners',
      content: 'Click the + button in the bottom right corner to create a new banner. You\'ll need an image URL and a destination link.',
      icon: <AddCircleOutline sx={{ fontSize: 40 }} />
    },
    {
      title: 'Editing Banners',
      content: 'Click the edit button on any banner card to modify its details.',
      icon: <EditOutlined sx={{ fontSize: 40 }} />
    },
    {
      title: 'Deleting Banners',
      content: 'Use the delete button to remove banners you no longer need. Don\'t worry, you\'ll be asked to confirm first.',
      icon: <DeleteOutlined sx={{ fontSize: 40 }} />
    }
  ]

  const handleNext = () => {
    setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
  }

  const handleBack = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev))
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        variant="outlined"
        sx={{
          maxWidth: 500,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <ModalClose />
        <Typography level="h4" component="h2">
          Getting Started
        </Typography>
        
        <Stepper sx={{ my: 2 }}>
          {steps.map((step, index) => (
            <Step 
              key={index}
              active={activeStep === index}
              completed={activeStep > index}
              onClick={() => setActiveStep(index)}
              sx={{ cursor: 'pointer' }}
            >
              <StepIndicator>{index + 1}</StepIndicator>
            </Step>
          ))}
        </Stepper>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="soft" sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 2,
                  }}
                >
                  {steps[activeStep].icon && (
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      {steps[activeStep].icon}
                    </motion.div>
                  )}
                  <Typography level="title-lg">
                    {steps[activeStep].title}
                  </Typography>
                  <Typography>
                    {steps[activeStep].content}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Button
            variant="plain"
            color="neutral"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            onClick={activeStep < steps.length - 1 ? handleNext : () => setOpen(false)}
          >
            {activeStep < steps.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}
