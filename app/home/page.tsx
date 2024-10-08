
'use client'
import React, {useState, useEffect} from 'react'
import Admin_User_dashboard from '../pages/admin_user_dashboard'
import Single_User_dashboard from '../pages/single_user_dashboard'
import Business_User_dashboard from '../pages/business_user_dashboard'

import { useRouter } from 'next/navigation'

const Dashboard = () => {
    const router = useRouter()
    const [userRole, setUserRole] = useState('')

    useEffect(() => {
        const user_role = localStorage.getItem('user_role')
        if (!user_role || user_role == null || !['admin', 'single_user', 'business_user'].includes(user_role) ){
            router.push('/auth/login')
        }else{
            setUserRole(user_role)
        }
    }, [])

    return (
        <div className="">
            {userRole === 'admin' && <Admin_User_dashboard />  }
            {userRole === 'single_user' && <Single_User_dashboard />  }
            {userRole === 'business_user' && <Business_User_dashboard />  }

        </div>
    )
}

export default Dashboard