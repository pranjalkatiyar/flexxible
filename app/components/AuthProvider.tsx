'use client'

import React from 'react'
import { useState,useEffect } from 'react'
import {getProviders,signIn} from 'next-auth/react'
import Button from '@/app/components/Button'

type Provider={
  id:string;
  name:string;
  type:string;
  signinUrl:string;
  callbackUrl:string;
  signinUrlParams?:Record<string,string> | null;
}

type Providers=Record<string,Provider>;

const AuthProvider = () => {
  const [providers,setProviders] = useState<Providers | null>(null);
  
  useEffect(()=>{
    const getProvidersData = async()=>{
      const providers = await getProviders();
      // console.log(providers);
      setProviders(providers);
    }
    getProvidersData();
  },[])

  if(providers){
    return (
      <div>
        {Object.values(providers).map((provider:Provider,i)=>(
        <Button key={i} type="button" title="Sign In" handleClick={()=>signIn(provider?.id)}/>))
        }
      </div>
    )
  }
}

export default AuthProvider