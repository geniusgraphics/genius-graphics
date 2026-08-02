export type Category = 'All' | 'Cars' | 'Portraits' | 'Nature' | 'Abstract'

export interface Cover {
  id: string
  title: string
  category: Exclude<Category, 'All'>
  slug: string
  description: string
  imageFile: string
  videoCount: number
  videoFiles?: string[]
  priceImage: number
  priceWithVideos: number
  sold: boolean
  soldAt?: string
  featured?: boolean
}

export interface Purchase {
  id: string
  userId: string
  coverId: string
  purchaseType: 'image_only' | 'with_videos'
  amountPaid: number
  videoUpgradeDeadline?: string
  stripePaymentId?: string
  createdAt: string
}

export interface SavedCover {
  id: string
  userId: string
  coverId: string
  createdAt: string
}

export interface RecentlyViewed {
  id: string
  userId: string
  coverId: string
  viewedAt: string
}

export interface UserProfile {
  id: string
  email: string
  displayName?: string
  avatarUrl?: string
  createdAt: string
}
