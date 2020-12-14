import React from 'react'
import { Redirect } from 'react-router-dom'



// Redirects to Earn on landing 
export function RedirectPathToEarn() {
    return <Redirect to='/xETHG/SimpleStaking/'/>
  }

  // Redirects to stake but only replace the pathname
export function RedirectToStake() {
    return <Redirect to='/xETHG/SimpleStaking/0x3863ea7577fc91bfbaeae6a6a3e403524afcf787'/>
  }
  
  