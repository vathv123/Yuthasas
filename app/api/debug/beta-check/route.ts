import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { isPromoActive } from "@/lib/promo"

export const runtime = "nodejs"

export async function GET() {
  const db = prisma as any
  
  try {
    // Check all tables
    const userCount = await db.user.count()
    const profileCount = await db.userProfile.count()
    const premiumCount = await db.userProfile.count({ where: { isPremium: true } })
    const allProfiles = await db.userProfile.findMany({
      select: { userId: true, isPremium: true, premiumSince: true, premiumSource: true }
    })
    
    return NextResponse.json({
      dbConnected: true,
      promoActive: isPromoActive(),
      counts: {
        users: userCount,
        profiles: profileCount,
        premium: premiumCount
      },
      allProfiles: allProfiles,
      dbUrl: process.env.DATABASE_URL?.slice(0, 40) + "..."
    })
  } catch (error: any) {
    return NextResponse.json({
      dbConnected: false,
      error: error.message,
      dbUrl: process.env.DATABASE_URL?.slice(0, 40) + "..."
    }, { status: 500 })
  }
}