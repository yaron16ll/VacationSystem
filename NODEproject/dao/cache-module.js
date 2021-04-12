let dataMap = new Map();

function get(key) {
    return dataMap.get(key);
}

function set(key, value) {
    dataMap.set(key, value);
}

function deleteByKey(key) {
    dataMap.delete(key);
}

function printAll() {
    console.log("all items in map")
    for (let [key, value] of dataMap.entries()) {
        console.log(" start " + key + ' = ' + JSON.stringify(value))
        console.log(" ")
    }
}

module.exports = {
    set,
    get,
    printAll,
    deleteByKey
}