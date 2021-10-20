export const statusResponse = (status, customErrorResp, customSuccessResp) => {
    if (status === 200) {
        if (customSuccessResp) {
            return customSuccessResp
        } else {
            return "Process success"
        }
    } else if (status > 200 && status <= 500) {
        if (customErrorResp) {
            return customErrorResp
        } else {
            return "Process error"
        }
    } else {
        return "Internal Server Error"
    }
}