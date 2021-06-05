declare module '@ensdomains/ensjs'

interface Window {
  ethereum?: any
}

interface RequestArguments {
  method: string
  params?: unknown[] | object
}
