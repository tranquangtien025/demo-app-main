import {
    Alert,
    AlertIcon,
  } from '@chakra-ui/react'

export const CustomAlert = ({ message, status }) => {
    return (
        <Alert status={status}>
            <AlertIcon />
            {message}
        </Alert>
    )
}