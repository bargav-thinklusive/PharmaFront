import  { useState } from 'react'
import axiosInstance from '../services/shared/AxiosService'

const useGet = () => {
    const [data,setData]=useState(null)
    const [error,setError]=useState(undefined)
    const [loading,setLoading]=useState(false)

    const getData=async(url:string)=>{
        try{
            setLoading(true)
            const response=await axiosInstance.get(url)
            setData(response.data)
            return response.data
        }catch(error:any){
            console.error(error)
            setError(error)
            throw error 
        }finally{
            setLoading(false)
        }
    }


  return {getData,data,error,loading}
}

export default useGet