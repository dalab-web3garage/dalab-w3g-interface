import type { NextPage } from 'next'
import {
  Text,
  Heading,
  Image,
  Box,
  Button,
  Input,
  Stack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useNetwork } from 'wagmi'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { Layout } from '@/components/layouts/layout'
import { useToast } from '@/hooks/useToast'
import { useMounted } from '@/hooks/useMounted'
import { useKeywordSubmit } from '@/hooks/quest/useKeywordSubmit'
import { useUpdateOwnNFT } from '@/hooks/quest/useUpdateToken'
import { useHasNFT } from '@/hooks/useHasNFT'
import { useTokenIdOf } from '@/hooks/useTokenIdOf'
import { useTokenURI } from '@/hooks/useTokenURI'
import { getContractAddress } from '@/utils/contractAddress'
import { useUpdateTokenMetadata, KamonToken } from '@/hooks/useUpdateTokenMetadata'

const Quests: NextPage = () => {
  const { t } = useTranslation('common')
  const { toast } = useToast()
  const mounted = useMounted()
  const { connect, connectors } = useConnect()
  const [metaMask] = connectors
  const { data } = useAccount()
  const { keyword, inputChange, submit, isSubmitting, keywordSubmitSucceeded } = useKeywordSubmit()
  const { hasNFT } = useHasNFT()
  const { activeChain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })
  const { tokenIdOf } = useTokenIdOf(kamonNFT, data?.address)
  const { tokenURI } = useTokenURI(kamonNFT, tokenIdOf?.toNumber() || 0)
  const [tokenId, setTokenId] = useState<BigInt>(BigInt(0))
  const [tokenJSON, setTokenJSON] = useState<KamonToken>()
  const [finalTokenUri, setFinalTokenUri] = useState('')
  const [updateTxLaunched, setUpdateTxLaunched] = useState<boolean>()

  const { updateTokenMetadata, updateTokenMetadataIsSubmitting } = useUpdateTokenMetadata()
  const { update, isUpdating } = useUpdateOwnNFT(
    kamonNFT,
    tokenId,
    finalTokenUri,
  )

  useEffect(() => {
    if (tokenURI) {
      const fetchData = async () => {
        const pinataRequest = await fetch(tokenURI.toString())
        const responseJson = await pinataRequest.json()
        setTokenJSON(responseJson)
      }
      fetchData()
    }
  }, [tokenURI])

  const updateTokenMetadataWrapper = async () => {
    if (data?.address == undefined || tokenJSON == undefined) return
    const userAddress: string = data?.address
    toast({
      title: t('QUEST.TOAST.GENERATING.TITLE'),
      description: t('QUEST.TOAST.GENERATING.DESCRIPTION'),
      status: 'info'
    })
    const updateTokenMetadataRet: string = await updateTokenMetadata(tokenJSON, userAddress)
    if (updateTokenMetadataRet.indexOf('Error') === 0) {
      toast({
        title: updateTokenMetadataRet,
        description: t('QUEST.TOAST.UPDATETOKENMETADATA_ERROR.DESCRIPTION'),
        status: 'error'
      })
      return
    }
    const finalTokenUri = updateTokenMetadataRet

    setUpdateTxLaunched(false)
    const theTokenId = tokenIdOf? tokenIdOf: BigInt(0)
    if(theTokenId == BigInt(0)) { return }
    setTokenId(BigInt(parseInt(theTokenId.toString())))
    setFinalTokenUri(finalTokenUri)
  }

  useEffect(() => {
    if (!finalTokenUri || updateTxLaunched == true) return
    setUpdateTxLaunched(true) // Avoids concurrent transactions
    update()
  }, [finalTokenUri, update, toast, t])

  return (
    <>
      <Layout>
        <Heading mt={50}>{t('QUEST.HEADING')}</Heading>
        <Box display={{ md: 'flex', xl: 'flex' }}>
          <Box p={2} minW={300}>
            <Image
              src="/joi-ito-henkaku-podcast.png"
              alt="{t('QUEST.IMAGE_ALT')}"
            />
          </Box>
          <Box p={2}>
            <Box w="100%" p={4}>
              {keywordSubmitSucceeded ? (
                <>
                  <Heading size="md">{t('QUEST.PRE_UPDATE_HEADING')}</Heading>
                  <Text>{t('QUEST.PRE_UPDATE_BODY')}</Text>
                </>
              ) : hasNFT ? (
                <>
                  <Heading size="md">{t('QUEST.EXPLANATION_HEADING')}</Heading>
                  <Text>{t('QUEST.EXPLANATION_BODY')}</Text>
                </>
              ) : (
                <>
                  <Heading size="md">
                    {t('QUEST.MINT_YOUR_KAMON_HEADING')}
                  </Heading>
                  <Text>{t('QUEST.MINT_YOUR_KAMON_EXPLANATION')}</Text>
                </>
              )}
            </Box>

            {mounted && !data?.address && !hasNFT ? (
              <Button
                mt={10}
                w="100%"
                colorScheme="teal"
                onClick={() => connect(metaMask)}
              >
                {t('CONNECT_WALLET_BUTTON')}
              </Button>
            ) : keywordSubmitSucceeded ? (
              <Box mt={4}>
                <Stack>

                  <Button
                    mt={10}
                    w="100%"
                    colorScheme="teal"
                    onClick={() => updateTokenMetadataWrapper()}
                    isLoading={updateTokenMetadataIsSubmitting || isUpdating}
                    loadingText={t('BUTTON_SUBMITTING')}
                    disabled={updateTokenMetadataIsSubmitting || isUpdating}
                  >
                    {t('QUEST.UPDATE_NFT_BUTTON')}
                  </Button>
                </Stack>
              </Box>
            ) : hasNFT ? (
              <Box mt={4}>
                <Stack>
                  <Input
                    placeholder={t('QUEST.INPUT_PLACEHOLDER')}
                    onChange={inputChange}
                    textTransform="uppercase"
                  />

                  <Button
                    mt={10}
                    w="100%"
                    colorScheme="teal"
                    onClick={() => submit()}
                    isLoading={isSubmitting}
                    loadingText={t('BUTTON_SUBMITTING')}
                    disabled={keyword == '' || isSubmitting}
                  >
                    {t('QUEST.SUBMIT_BUTTON')}
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Link href="/" passHref>
                <Button mt={10} w="100%" colorScheme="teal">
                  {t('QUEST.MINT_BUTTON')}
                </Button>
              </Link>
            )}
          </Box>
        </Box>
      </Layout>
    </>
  )
}

export default Quests
