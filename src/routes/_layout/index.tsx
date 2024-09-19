import { Box, Container, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import useAuth from "../../hooks/useAuth"
import Home from "../../components/Home/Index"

export const Route = createFileRoute("/_layout/")({
  component: HomePage,
})

function HomePage() {
  const { user: currentUser } = useAuth()

  return (
    <>
      <Container maxW="full">
        <Home/>
      </Container>
    </>
  )
}
