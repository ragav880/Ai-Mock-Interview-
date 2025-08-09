import Agent from '@/components/Agent'
import React from 'react'

const page = () => {
  return (
   <>
   <h3>Interview generation</h3>
   <Agent userName="you" userId ="id" type= "generate" />
   
   </>
  )
}

export default page
