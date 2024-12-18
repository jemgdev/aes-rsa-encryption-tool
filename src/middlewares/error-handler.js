const errorHandler = (error, request, response, next) => {
  response.status(500).json({
    code: error.code || 'UNCONTROLLER_ERROR',
    message: error.message || 'An unexpected error has occurred. 😥'
  }) 
}

module.exports = {
  errorHandler
}