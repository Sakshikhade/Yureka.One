export type HubbleProductStatus = 'ACTIVE' | 'INACTIVE' | string

export interface HubbleAmountRestrictions {
  minAmount?: number | null
  maxAmount?: number | null
  minOrderAmount?: number | null
  maxOrderAmount?: number | null
  minVoucherAmount?: number | null
  maxVoucherAmount?: number | null
  maxVouchersPerOrder?: number | null
  denominations?: number[] | null
}

export interface HubbleProductRaw {
  id: string
  status: HubbleProductStatus
  title: string
  brandDescription?: string | null
  category?: string[] | string | null
  tags?: string[] | null
  denominationType?: string | null
  cardType?: string | null
  redemptionType?: string | null
  amountRestrictions?: HubbleAmountRestrictions | null
  iconImageUrl?: string | null
  thumbnailUrl?: string | null
  logoUrl?: string | null
  tncUrl?: string | null
  termsAndConditions?: string[] | null
  usageInstructions?: Record<string, string[]> | null
  howToUseInstructions?: Array<{
    retailMode?: string
    retailModeName?: string
    instructions?: string[]
  }> | null
  discountPercentage?: number | null
  parentBrand?: { id?: string; name?: string } | null
  voucherExpiryInMonths?: number | null
}

/** Normalized gift card for the Yureka platform UI */
export interface GiftCard {
  id: string
  title: string
  brand: string
  description: string
  status: HubbleProductStatus
  categories: string[]
  tags: string[]
  redemptionType: string
  denominationType: string
  denominations: number[]
  minAmount: number | null
  maxAmount: number | null
  discountPercentage: number | null
  imageUrl: string | null
  logoUrl: string | null
  tncUrl: string | null
  termsAndConditions: string[]
  howToUse: string[]
  voucherExpiryInMonths: number | null
}
