const uuid = require('uuid/v4');

exports.getUniqueID = (length) => {

    let uid = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;

    for (let i = 0; i < length; ++i) {
        uid += chars[getRandomInteger(0, charsLength - 1)];
    }

    return uid;
};

exports.generateUUID = () => uuid();

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.sanitizeObject = (oldObject, newObject) =>{
    
    let oldObjectProperties = Object.getOwnPropertyNames(oldObject);

    Object.keys(newObject).forEach(key=>{
        if(!(key in oldObjectProperties)){
            delete newObject[key]
        }
    })

    return newObject;

}

exports.isEmpty = (object)=> Object.keys(object).length < 1