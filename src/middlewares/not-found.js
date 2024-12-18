const notFound = (request, response) => {
  response.status(404).json({
    code: 'NOT_FOUND',
    message: 'Reource not found'
  })
}

module.exports = {
  notFound
}