import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  Icon
} from '@chakra-ui/react'
import { FaGithubAlt } from 'react-icons/fa'
import { AiFillTwitterCircle } from "react-icons/ai";
import useTranslation from 'next-translate/useTranslation'

const SocialButton = ({
  children,
  label,
  href
}: {
  children: React.ReactNode
  label: string
  href: string
}) => {
  return (
    <Button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      // w={8}
      // h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  )
}

export const DALabFooter = () => {
  const { t } = useTranslation('common')

  return (
    <Box
      p={5}
      bottom={0}
      position="relative"
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2022 Digital Architecture Lab</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton
            label={'github'}
            href={'https://github.com/henkaku-center/omise-interface'}
          >
            <Text mr={1}>I/F</Text>
            <Icon as={FaGithubAlt} />
          </SocialButton>
          <SocialButton
            label={'github'}
            href={'https://github.com/henkaku-center/badge'}
          >
            <Text mr={1}>SC</Text>
            <Icon as={FaGithubAlt} />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  )
}

export const Footer = () => {
  const { t } = useTranslation('common')

  return (
    <Box
      p={5}
      bottom={0}
      position="relative"
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>{t('COPYRIGHT_LINE')}</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton
            label={'github'}
            href={'https://github.com/orgs/dalab-web3garage/repositories'}
          >
            <Icon as={FaGithubAlt} />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  )
}
