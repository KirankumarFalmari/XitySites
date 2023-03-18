class BaseController {
  sendResponse(result, message) {
    var response = {
      success: true,
      data: result,
      message: message,
    };
    return response;
  }

  sendError(error, code = 404) {
    var response = {
      success: false,
      message: error,
    };
    return response;
  }
}

const data = new BaseController();

module.exports = data;
