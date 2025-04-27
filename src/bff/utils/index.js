const months = [
    'Jan', 'Feb', 'Mar', "Apr", "May", "Jun", "Jul", 'Aug', "Sep", "Oct", "Nov", "Dec"
]

const weekDay = [
    'Sun','Mon', 'Tue', "Wed", "Thu", 'Fri', 'Sat'
]

const getDate = (date)=>{
    let d_string = `${weekDay[date.getUTCDay()]} ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}`
    return d_string
}

export {
    getDate
}