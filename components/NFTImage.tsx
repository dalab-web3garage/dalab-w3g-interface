import { Box, Text, Badge, Image } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

interface Prop {
  imageUrl: string
  boxSize?: string
}

export const NFTImage: React.FC<Prop> = ({ imageUrl, boxSize }) => {
  const { t } = useTranslation('common')

  return (
    <Box boxSize={boxSize ? boxSize : 'md'}>
      <Text fontSize="xl" fontWeight="bold">
        <Badge ml={1} variant="outline" colorScheme="yellow">
          {t('IMAGE_PREVIEW_BADGE')}
        </Badge>
      </Text>
      <Image mt={1} src={imageUrl} alt={t('IMAGE_PREVIEW_ALT')} />
    </Box>
  )
}
