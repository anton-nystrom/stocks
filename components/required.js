
function required(query, parameters) {
    let missing = [];
    parameters.forEach(parameter => {
        if(!Object.keys(query).includes(parameter)) {
            missing.push(parameter);
        }
    })
    if(missing.length !== 0) {
        return missing;
    }
    return true;
}

export default required;
