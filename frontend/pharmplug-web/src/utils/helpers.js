export const getDifferenceInHours = (timeString1, timeString2) =>{
    // Convert the time strings to Date objects
    let stringdate1 = `${new Date().toISOString().split("T")[0]} ${timeString1}`;
    let stringdate2 = `${new Date().toISOString().split("T")[0]} ${timeString2}`;
    let date1 = new Date(stringdate1);
    let date2 = new Date(stringdate2);


    // Get the difference in milliseconds
    let differenceInMilliseconds = date2 - date1;

    // Convert milliseconds to hours
    let differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

    return differenceInHours;
}

export const addHoursToTime = (timeString, hours) => {

    // Parse the input time string to create a Date object (assuming the string is in "YYYY-MM-DD HH:MM:SS" format)
    let stringdate = `${new Date().toISOString().split("T")[0]} ${timeString}`;
    
    let date = new Date(stringdate)
    date.setHours(date.getHours() + Number(hours));

    // Return the new time as a string in the same format
    return date.toISOString().slice(0, 19).replace("T", " ").split(" ")[1];
}

export const isLink = (str) =>{
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return regex.test(str);
}