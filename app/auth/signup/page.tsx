'use client'
import React, {useState, useEffect} from 'react'
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { IoMdEyeOff } from 'react-icons/io';
import { IoEye } from 'react-icons/io5';
import Alert from "../../component/alert"
import { CiLock } from 'react-icons/ci';
import { signup_user_role } from '@/constants';
import { post_auth_request, post_request } from '@/app/api';



const Signup = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [auth, setAuth] = useState({first_name: '', last_name: '', email: '', password: '', user_role: '', phone_number: '' })
    const [inputError, setInputError] = useState({first_nameError: false, last_nameError: false, emailError: false, passwordError: false, phoneError: false})
    const [loading, setLoading] = useState(false); 
    const [alert, setAlert] = useState({message: '', type: ''})
    const [current_stage, setCurrent_stage] = useState('role')

    useEffect(() => {
        if (auth.first_name){setInputError({...inputError, first_nameError: false})}
        if (auth.last_name){setInputError({...inputError, last_nameError: false})}
        if (auth.email){setInputError({...inputError, emailError: false})}
        if (auth.phone_number){setInputError({...inputError, phoneError: false})}
        if (auth.password){setInputError({...inputError, passwordError: false})}
    }, [auth])

    function handlePassword() {
        if (showPassword){setShowPassword(false)}
        else if (!showPassword){setShowPassword(true)}
    }

    function handleChange (e:any){
        const name = e.target.name
        const value = e.target.value
        setAuth({...auth, [name]: value})
    }


    function showAlert(message: string, type: string){
        setAlert({message: message, type: type})
            setTimeout(() => {
                setAlert({message: '', type: ''})
            }, 3000);
    }
    
    async function create_user_account(e:any){
        e.preventDefault()
        if (!auth.first_name || !auth.last_name || !auth.email || !auth.password || !auth.phone_number){
            showAlert("Please fill all fields", "warning")
            setInputError({...inputError, emailError: auth.email === "", first_nameError: auth.first_name === '', last_nameError: auth.last_name === '', passwordError: auth.password === ''})
        }else {
            setLoading(true); 

            try {
                
                const response = await post_request('app/signup', auth)

                if (response.status == 201){

                    showAlert(response.data.msg, "success")

                    setAuth({first_name: '', last_name: '', email: '', password: '', user_role: '', phone_number: '' })

                    setLoading(false)

                    router.push('/auth/login')
                    
                }else{
                    showAlert(response.response.data.err, "error")
                    setLoading(false)
                    return;
                }

            } catch (err:any) {
                showAlert('Something went worong, try again later ', 'error')
                setLoading(false)
            }


            showAlert('Account created succesfully', 'success')
            setLoading(false)
        }   
    }

    async function create_business_account(e:any){
        e.preventDefault()
        if (!auth.first_name || !auth.last_name || !auth.email || !auth.password || !auth.phone_number){
            showAlert("Please fill all fields", "warning")
            setInputError({...inputError, emailError: auth.email === "", first_nameError: auth.first_name === '', last_nameError: auth.last_name === '', passwordError: auth.password === ''})
        }else {
            setLoading(true); 

            try {
                
                const response = await post_request('app/signup', auth)

                if (response.status == 201){

                    showAlert(response.data.msg, "success")                    

                    localStorage.setItem('key' ,response.headers.get('x-id-key'));       

                    setAuth({...auth, first_name: '', last_name: '', password: '', user_role: '', phone_number: '' })

                    setLoading(false)

                    setCurrent_stage('update_business')
                    
                }else{
                    showAlert(response.response.data.err, "error")
                    setLoading(false)
                    return;
                }

            } catch (err:any) {
                showAlert('Something went worong, try again later ', 'error')
                setLoading(false)
            }


            showAlert('Account created succesfully', 'success')
            setLoading(false)
        }   
    }

    async function update_business_account(e:any){
        e.preventDefault()
        if (!auth.first_name || !auth.last_name ){
            showAlert("Please fill all fields", "warning")
            setInputError({...inputError, emailError: auth.email === "", first_nameError: auth.first_name === '', last_nameError: auth.last_name === '', passwordError: auth.password === ''})
        }else {
            setLoading(true); 

            try {
                
                const response = await post_auth_request('app/add-business', {
                    "business_name":auth.first_name, "business_address": auth.last_name, "avatar":""
                })

                if (response.status == 200 || response.status == 201){

                    showAlert(response.data.msg, "success")

                    setAuth({first_name: '', last_name: '', email: '', password: '', user_role: '', phone_number: '' })

                    setLoading(false)

                    router.push('/auth/verify-otp')
                    
                }else{
                    showAlert(response.response.data.err, "error")
                    setLoading(false)
                    return;
                }

            } catch (err:any) {
                showAlert('Something went worong, try again later ', 'error')
                setLoading(false)
            }


            showAlert('Account created succesfully', 'success')
            setLoading(false)
        }   
    }

    

    return (
        <div className="relative w-full h-[100vh] sm:p-[20px] flex items-center jusitify-center bg-slate-200 ">
            <span className="w-[90%] md:w-1/2  flex items-center justify-end absolute top-[20px] right-[20px] z-20 ">
                {alert.message && <Alert message={alert.message} type={alert.type} />} {/* Display alert */}
            </span>
            {current_stage == 'role' && 
            <div className="w-full flex flex-row items-center justify-between h-full gap-[20px] bg-black rounded-[10px]">
                <div className=" relative max-sm:hidden w-[40%] h-full rounded-[20px] flex items-center justify-center bg-black ">
                    
                    <div className="mx-auto relative w-[400px] h-[400px] rounded-[10px] overflow-hidden auth-bg">
                        <Image
                            src="/logo.jpg"
                            alt="Authentication"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    
                </div>

                <div className=" max-sm:w-full w-[60%] h-full flex items-start justify-start overflow-y-auto ">
                    
                    <div className="w-full min-h-full flex flex-col items-start justify-center max-sm:justify-start sm:rounded-[20px] gap-10 max-sm:gap-[15px] my-auto bg-black  max-sm:p-[20px] max-md:px-[20px] sm:py-[20px] ">
                        
                        <div className="hidden mx-auto max-sm:block relative w-[250px] h-[125px] rounded-[10px] overflow-hidden auth-bg">
                            <Image
                                src="/logo.jpg"
                                alt="Authentication"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>

                        <span className="mx-auto w-auto flex flex-col items-center justify-start gap-5">
                            <h2 className="text-xl lg:text-2xl max-sm:w-[95%] font-semibold text-teal-600 text-center">What are you registering as?</h2>
                            <h4 className="text-sm sm:text-sm max-sm:w-[90%] text-slate-200 text-center">In order to proceed, you need to select one.</h4>
                            <p className="text-sm font-normal text-teal-500 cursor-pointer hover:underline mt-[5px] text-center " onClick={()=> {router.push('/auth/login')}} >Already have an account login</p>
                        </span>


                        <div className="  w-full md:px-[20px] lg:px-[10px] lg:max-h-[450px] flex items-start justify-center sm:overflow-y-auto rounded-[15px] py-[20px] ">
                            <div className="flex flex-wrap gap-[20px]  justify-center max-w-max">
                                {signup_user_role.map((data, ind) => {
                                    const {title, description, id} = data;
                                    return (
                                        <div key={ind} className="w-full lg:w-[40%] min-h-[175px] bg-slate-200 cursor-pointer rounded-lg p-[20px] hover:border-teal-600 group" onClick={()=> {setAuth({...auth, user_role: id}); setCurrent_stage(id) }} >
                                            <h2 className="text-lg text-slate-700 font-semibold group-hover:text-teal-600 mb-[20px] ">{title}</h2>
                                            {description.map((dat, ind)=>{
                                                return(

                                                    <p key={ind} className="mt-2 text-slate-700 text-[17.5px] group-hover:text-teal-600">{dat}</p>
                                                )
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>

            </div>}

            {current_stage == 'single_user' && 
            <div className="w-full flex flex-row items-center justify-between h-full gap-[20px] bg-black rounded-[10px]">
                <div className=" relative max-sm:hidden w-[50%] h-full rounded-[20px] flex items-center justify-center bg-black ">
                    
                    <div className="mx-auto relative w-[400px] h-[400px] rounded-[10px] overflow-hidden auth-bg">
                        <Image
                            src="/logo.jpg"
                            alt="Authentication"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    
                </div>

                <div className="max-sm:w-full w-[50%] h-full flex items-start justify-start overflow-y-auto " >
                    <div className="w-full min-h-full flex flex-col items-start justify-center max-sm:justify-start sm:rounded-[20px] gap-10 max-sm:gap-[15px] my-auto bg-black  max-sm:p-[20px] max-md:px-[20px] sm:py-[20px]">

                        <div className="hidden mx-auto max-sm:block relative w-[250px] h-[125px] rounded-[10px] overflow-hidden auth-bg">
                            <Image
                                src="/logo.jpg"
                                alt="Authentication"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>

                        <span className="mx-auto w-auto flex flex-col items-center justify-start gap-2">
                            <h2 className="text-xl md:text-2xl font-semibold text-center text-slate-200">Create Account</h2>
                        </span>
                        <form action="" className='w-full md:w-[90%] xl:w-[80%] mx-auto flex flex-col gap-[15px] sm:gap-[30px]'>
                            <span className="w-full flex flex-col items-start jusitify-start gap-2">
                                <h4 className="text-sm  text-slate-200 ">First Name</h4>
                                <input onChange={handleChange} value={auth.first_name} name='first_name' type="text" className={inputError.first_nameError ? 'signup-input-error':'signup-input'} />
                            </span>
                            <span className="w-full flex flex-col items-start jusitify-start gap-2">
                                <h4 className="text-sm  text-slate-200 ">Last Name</h4>
                                <input onChange={handleChange} value={auth.last_name} name='last_name' type="text" className={inputError.last_nameError ? 'signup-input-error':'signup-input'} />
                            </span>
                            <span className="w-full flex flex-col items-start jusitify-start gap-2">
                                <h4 className="text-sm  text-slate-200 ">Email</h4>
                                <input onChange={handleChange} value={auth.email} name='email' type="text" className={inputError.emailError ? 'signup-input-error':'signup-input'} />
                            </span>
                            <span className="w-full flex flex-col items-start jusitify-start gap-2">
                                <h4 className="text-sm  text-slate-200 ">Phone</h4>
                                <input onChange={handleChange} value={auth.phone_number} name='phone_number' type="text" className={inputError.emailError ? 'signup-input-error':'signup-input'} />
                            </span>
                            
                            <span className="w-full flex flex-col items-start justify-start gap-2">
                                <h4 className="text-sm text-slate-200 ">Password</h4>
                                <span className="w-full relative  ">
                                    <input  type={showPassword ? "text" : "password"} name='password' className={inputError.passwordError ? 'password-input-error':'password-input'} value={auth.password} onChange={handleChange} />
                                    <span className='absolute w-[40px] flex items-center justify-center top-[30%] right-0 text-teal-600' onClick={handlePassword} >
                                        {showPassword ? <IoEye size={20} className='cursor-pointer' />: <IoMdEyeOff size={20} className='cursor-pointer' /> }
                                    </span>
                                </span>
                            </span>

                            <p className="text-sm font-normal text-teal-500 cursor-pointer hover:underline mt-[5px] text-center " onClick={()=> {router.push('/auth/login')}} >Already have an account login</p>


                            <div className="w-full max-md:flex-wrap flex sm:items-center sm:justify-between mt-[10px] gap-[20px] ">
                                <button type="button" className="w-full md:w-[200px] h-[50px] bg-amber-600 hover:bg-amber-700 rounded-[3px] text-white  text-sm" onClick={()=>setCurrent_stage('role')}>
                                    Change Role
                                </button>
                            
                                <button className="w-full md:w-[200px] h-[50px] text-white bg-teal-600 rounded-[3px] hover:bg-teal-700 flex items-center justify-center text-sm " onClick={create_user_account} disabled={loading}>
                                    {loading ? (
                                    <svg className="w-[25px] h-[25px] animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    ) : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>}

            {current_stage == 'business_user' && 
            <div className="w-full flex flex-row items-center justify-between h-full gap-[20px] bg-black rounded-[10px] ">
                <div className=" relative max-sm:hidden w-[50%] h-full rounded-[20px] flex items-center justify-center bg-black ">
                    
                    <div className="mx-auto relative w-[400px] h-[400px] rounded-[10px] overflow-hidden auth-bg">
                        <Image
                            src="/logo.jpg"
                            alt="Authentication"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    
                </div>

                <div className="max-sm:w-full w-[50%] h-full flex items-start justify-start overflow-y-auto " >
                    <div className="w-full min-h-full flex flex-col items-start justify-center max-sm:justify-start sm:rounded-[20px] gap-10 max-sm:gap-[15px] my-auto bg-black  max-sm:p-[20px] max-md:px-[20px] sm:py-[20px]">

                        <div className="hidden mx-auto max-sm:block relative w-[250px] h-[125px] rounded-[10px] overflow-hidden auth-bg">
                            <Image
                                src="/logo.jpg"
                                alt="Authentication"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>

                        <span className="mx-auto w-auto flex flex-col items-center justify-start gap-2">
                            <h2 className="text-xl md:text-2xl font-semibold text-center text-slate-200">Create Business Account</h2>
                        </span>
                        <form action="" className='w-full md:w-[90%] xl:w-[80%] mx-auto flex flex-col gap-[15px] sm:gap-[30px]'>
                            <span className="w-full flex flex-col items-start jusitify-start gap-2">
                                <h4 className="text-sm  text-slate-200 ">First Name</h4>
                                <input onChange={handleChange} value={auth.first_name} name='first_name' type="text" className={inputError.first_nameError ? 'signup-input-error':'signup-input'} />
                            </span>
                            <span className="w-full flex flex-col items-start jusitify-start gap-2">
                                <h4 className="text-sm  text-slate-200 ">Last Name</h4>
                                <input onChange={handleChange} value={auth.last_name} name='last_name' type="text" className={inputError.last_nameError ? 'signup-input-error':'signup-input'} />
                            </span>
                            <span className="w-full flex flex-col items-start jusitify-start gap-2">
                                <h4 className="text-sm  text-slate-200 ">Email</h4>
                                <input onChange={handleChange} value={auth.email} name='email' type="text" className={inputError.emailError ? 'signup-input-error':'signup-input'} />
                            </span>
                            <span className="w-full flex flex-col items-start jusitify-start gap-2">
                                <h4 className="text-sm  text-slate-200 ">Phone</h4>
                                <input onChange={handleChange} value={auth.phone_number} name='phone_number' type="text" className={inputError.emailError ? 'signup-input-error':'signup-input'} />
                            </span>
                            
                            <span className="w-full flex flex-col items-start justify-start gap-2">
                                <h4 className="text-sm text-slate-200 ">Password</h4>
                                <span className="w-full relative  ">
                                    <input  type={showPassword ? "text" : "password"} name='password' className={inputError.passwordError ? 'password-input-error':'password-input'} value={auth.password} onChange={handleChange} />
                                    <span className='absolute w-[40px] flex items-center justify-center top-[30%] right-0 text-teal-600' onClick={handlePassword} >
                                        {showPassword ? <IoEye size={20} className='cursor-pointer' />: <IoMdEyeOff size={20} className='cursor-pointer' /> }
                                    </span>
                                </span>
                            </span>

                            <p className="text-sm font-normal text-teal-500 cursor-pointer hover:underline mt-[5px] text-center " onClick={()=> {router.push('/auth/login')}} >Already have an account login</p>


                            <div className="w-full max-md:flex-wrap flex sm:items-center sm:justify-between mt-[10px] gap-[20px] ">
                                <button type="button" className="w-full md:w-[200px] h-[50px] bg-amber-600 hover:bg-amber-700 rounded-[3px] text-white text-sm " onClick={()=>setCurrent_stage('role')}>
                                    Change Role
                                </button>
                            
                                <button className="w-full md:w-[200px] h-[50px] text-white bg-teal-600 rounded-[3px] hover:bg-teal-700 flex items-center justify-center text-sm " onClick={create_business_account} disabled={loading}>
                                    {loading ? (
                                    <svg className="w-[25px] h-[25px] animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    ) : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>}

            {current_stage == 'update_business' && 
            <div className="w-full flex flex-row items-center justify-between h-full gap-[20px] bg-black rounded-[10px] ">
                <div className=" relative max-sm:hidden w-[50%] h-full rounded-[20px] flex items-center justify-center bg-black ">
                    
                    <div className="mx-auto relative w-[400px] h-[400px] rounded-[10px] overflow-hidden auth-bg">
                        <Image
                            src="/logo.jpg"
                            alt="Authentication"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    
                </div>

                <div className="max-sm:w-full w-[50%] h-full flex items-start justify-start overflow-y-auto " >
                    <div className="w-full min-h-full flex flex-col items-start justify-center max-sm:justify-start sm:rounded-[20px] gap-10 max-sm:gap-[15px] my-auto bg-black  max-sm:p-[20px] max-md:px-[20px] sm:py-[20px]">

                        <div className="hidden mx-auto max-sm:block relative w-[250px] h-[125px] rounded-[10px] overflow-hidden auth-bg">
                            <Image
                                src="/logo.jpg"
                                alt="Authentication"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>

                        <span className="mx-auto w-auto flex flex-col items-center justify-start gap-2">
                            <h2 className="text-xl md:text-2xl font-semibold text-center text-slate-200">Create Business </h2>
                        </span>
                        <form action="" className='w-full md:w-[90%] xl:w-[80%] mx-auto flex flex-col gap-[15px] sm:gap-[30px]'>
                            <span className="w-full flex flex-col items-start jusitify-start gap-2">
                                <h4 className="text-sm  text-slate-200 ">Business Name</h4>
                                <input onChange={handleChange} value={auth.first_name} name='first_name' type="text" className={inputError.first_nameError ? 'signup-input-error':'signup-input'} />
                            </span>
                            <span className="w-full flex flex-col items-start jusitify-start gap-2">
                                <h4 className="text-sm  text-slate-200 ">Address</h4>
                                <input onChange={handleChange} value={auth.last_name} name='last_name' type="text" className={inputError.last_nameError ? 'signup-input-error':'signup-input'} />
                            </span>
                            <span className="w-full flex flex-col items-start jusitify-start gap-2">
                                <h4 className="text-sm  text-slate-200 ">Email</h4>
                                <input onChange={handleChange} value={auth.email} name='email' disabled type="text" className={'signup-input bg-slate-100'} />
                            </span>
                            

                            <p className="text-sm font-normal text-teal-500 cursor-pointer hover:underline mt-[5px] text-center " onClick={()=> {router.push('/auth/login')}} >Already have an account login</p>


                            <div className="w-full max-md:flex-wrap flex sm:items-center sm:justify-between mt-[10px] gap-[20px] ">
                                
                                <button className="w-full  h-[50px] text-white bg-teal-600 rounded-[3px] hover:bg-teal-700 flex items-center justify-center text-sm " onClick={update_business_account} disabled={loading}>
                                    {loading ? (
                                    <svg className="w-[25px] h-[25px] animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    ) : 'Create Business'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default Signup