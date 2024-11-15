import { SignUp } from '@clerk/nextjs'

const page = () => {
  return (
    <SignUp fallbackRedirectUrl="/dashboard" />
  )
}

export default page