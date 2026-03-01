"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import React, { useState } from 'react'
import Header, { User, } from './_components/Header';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}> ){
    const [userDetail,setUserDetail]=useState <User|undefined>(undefined);
    return(
        <div>
            {/* @ts-ignore */}
            <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
                {/* Header */}
                <Header/>
            {children}
            </UserDetailContext.Provider>
            
        </div>
    )
}

export default Provider