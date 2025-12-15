import { useState } from "react";
import axiosInstance from "../services/shared/AxiosService";

const usePostFormData = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const postFormData = async (url: string, formData: FormData) => {
        try {
            setLoading(true);

            // Set headers for multipart/form-data
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await axiosInstance.post(url, formData, config);
            setData(response.data);
            return response.data;
        } catch (error: any) {
            console.error(error.message);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { postFormData, data, error, loading };
};

export default usePostFormData;
