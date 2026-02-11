import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Businesses from "../Businesses"
import PopupHandler from "./PopupHandler"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/authentications/signup")
  }

  const params = await searchParams
  const forceOnboarding = params?.edit === "1"

  return (
    <>
      <PopupHandler />
      <Businesses forceOnboarding={forceOnboarding} />
    </>
  )
}
