const months = [
    'Jan', 'Feb', 'Mar', "Apr", "May", "Jun", "Jul", 'Aug', "Sep", "Oct", "Nov", "Dec"
]

const weekDay = [
    'Sun','Mon', 'Tue', "Wed", "Thu", 'Fri', 'Sat'
]

const getDate = (date)=>{
    if(!date)return
    let d_string = `${weekDay[date.getUTCDay()]} ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}`
    return d_string
}
const errorEnums = {
    SERVER: 'internal server error. try again later',
    FIELDS: 'you must provid all the fields',
    PROFILE: "login in to access this resource"

}
export {
    getDate,
    errorEnums
}