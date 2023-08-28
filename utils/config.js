const  requestColumns = ["created_by",
    "assigned_to",
    "kpi_id",
    "title",
    "description",
    "rpn",
    "severity",
    "occurrence",
    "detection", "request_status"]


function isValidEmail(Email) {
    const validFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validFormat.test(Email);
  }



function isValidLimits(lower,upper,target){
    if (target && !Number.isFinite(target)){
        return false
}
    if (lower && !Number.isFinite(lower)){
        return false;
}   
    if (upper &&  !Number.isFinite(upper)){
        return false;
    }
    if(target && upper && lower){
    if ( lower >= upper || target > upper || target < lower){
        return false;
    }
    }
    return true;
}




module.exports = {
    isValidEmail,
    isValidLimits,
    requestColumns
}
