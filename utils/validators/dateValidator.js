export const dateValidator = (date) => {
    
    const inputDate = new Date(date)
    const currentDate = new Date()
    
    currentDate.setHours(0, 0, 0, 0)
    inputDate.setHours(0, 0, 0, 0)

    return inputDate <= currentDate
}