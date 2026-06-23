function formatDate(date, res) {
    let result = ''
    try {
        result = new Date(date).toISOString().split('T')[0];
    } catch(err) {
        res.status(500).json({
            code: '50010',
            message: 'Error Passing Data'})
    }
    return result
}


module.exports = {formatDate}