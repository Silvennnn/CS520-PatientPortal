export function parse_time(datetime){
    const date_obj = new Date(datetime);
    let hours = date_obj.getHours();
    let minutes = date_obj.getMinutes();
    let year = date_obj.getFullYear();
    let month = date_obj.getMonth()+1;
    let day = date_obj.getDate();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let minute =  minutes < 10 ? '0'+minutes : minutes;
    let final_time = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hours < 10 ? '0'+hours : hours}:${minute}${ampm}`;

    return final_time
}

export function sortAppointmentByTime(app_lst) {
    function compareDates(a, b) {
        const dateA = new Date(a.datetime);
        const dateB = new Date(b.datetime);

        // @ts-ignore
        return dateA - dateB;
    }

    return app_lst.sort(compareDates)
}

export function sortRecordsByTime(records_lst) {
    function compareDates(a, b) {
        const dateA = new Date(a.date_of_visit);
        const dateB = new Date(b.date_of_visit);

        // @ts-ignore
        return dateA - dateB;
    }

    return records_lst.sort(compareDates)
}
