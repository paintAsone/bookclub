const pickData = (body, fields) => {
    const data = {}
    for (const field of fields) {
        if (body[field] !== undefined) {
            data[field] = body[field] === '' ? null : body[field]
        }
    }
    return data
}

export {
    pickData
}