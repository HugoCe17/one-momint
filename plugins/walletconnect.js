import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export default function (context, inject) {
  inject(
    'connector',
    new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
      qrcodeModal: QRCodeModal,
    })
  )
}
