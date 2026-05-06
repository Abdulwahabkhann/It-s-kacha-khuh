import type { CartItem, CustomerInfo } from './types'

export function generateWhatsAppMessage(
  items: CartItem[],
  customerInfo: CustomerInfo,
  total: number
): string {
  const lines = items
    .map(
      (item) =>
        `• ${item.name} x${item.qty} = PKR ${(item.price * item.qty).toLocaleString()}`
    )
    .join('\n')

  return (
    `Hi! I'd like to place an order 🛵\n\n` +
    `${lines}\n\n` +
    `💰 *Total: PKR ${total.toLocaleString()}*\n\n` +
    `---\n` +
    `👤 Name: ${customerInfo.name}\n` +
    `📞 Phone: ${customerInfo.phone}\n` +
    `📍 Address: ${customerInfo.address}`
  )
}

export function openWhatsApp(phone: string, message: string): void {
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank')
}
