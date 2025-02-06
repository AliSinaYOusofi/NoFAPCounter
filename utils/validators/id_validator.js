export const idValidator = (id) => {
    const reg = new RegExp("^[a-zA-Z0-9]{1,12}$"); 
    return reg.test(id);
};
