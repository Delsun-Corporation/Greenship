import { toast } from "react-toastify"

export const statusResponse = (status, customErrorResp, customSuccessResp) => {
    if (status === 200) {
        if (customSuccessResp) {
            return toast.success(customSuccessResp)
        } else {
            return toast.success("Process success")
        }
    } else if (status > 200 && status <= 500) {
        if (customErrorResp) {
            return toast.error(customErrorResp)
        } else {
            return toast.error("Process error")
        }
    } else {
        return toast.error("Internal Server Error")
    }
}