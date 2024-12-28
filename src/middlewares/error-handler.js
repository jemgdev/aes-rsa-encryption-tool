const errorHandler = (error, request, response, next) => {
  if (error.message === 'Invalid RSAES-OAEP padding.') {
    return response.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Invalid RSAES-OAEP padding. 😥'
    })
  }

  response.status(500).json({
    code: error.code || 'UNCONTROLLER_ERROR',
    message: error.message || 'An unexpected error has occurred. 😥'
  }) 
}

module.exports = {
  errorHandler
}