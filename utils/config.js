const  requestColumns = ["created_by",
    "assigned_to",
    "kpi_id",
    "title",
    "description",
    "rpn",
    "severity",
    "occurrence",
    "detection", "request_status"]


const requestQueryColumns=[
    "request.id",
    "request.title",
    "request.description",
    "request.rpn",
    "request.request_status",
    "kpi.title as kpi_title",
    "request.created_at",
    "u1.username as created_by",
    "u2.username as assigned_to",
  ];
  


function isValidEmail(Email) {
    const validFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validFormat.test(Email);
  }



function hasValue(value) {
    return value !== undefined
        && value !== null
        && (typeof value !== "string" || value.trim() !== "");
}

function isValidLimits(lower,upper,target){
    const hasLower = hasValue(lower);
    const hasUpper = hasValue(upper);
    const hasTarget = hasValue(target);
    const numericLower = Number(lower);
    const numericUpper = Number(upper);
    const numericTarget = Number(target);

    if (hasTarget && !Number.isFinite(numericTarget)){
        return false
}
    if (hasLower && !Number.isFinite(numericLower)){
        return false;
}   
    if (hasUpper &&  !Number.isFinite(numericUpper)){
        return false;
    }
    if(hasTarget && hasUpper && hasLower){
    if ( numericLower >= numericUpper || numericTarget >= numericUpper || numericTarget <= numericLower){
        return false;
    }
    }
    return true;
}




module.exports = {
    isValidEmail,
    isValidLimits,
    requestColumns,
    requestQueryColumns
}
