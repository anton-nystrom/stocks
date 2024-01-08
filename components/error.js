
function error(res, code, array) {
    let message = "";
    switch (code) {
        //No query
        case 401:
            message = "You must perform a query"
            break;
        //Missing parameters
        case 402:
            message = `You are missing the following parameters: ${array}`
            break;
    
        default:
            break;
    }
    return res.status(code).json(message);
}

export default error;
