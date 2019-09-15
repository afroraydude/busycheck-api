export default class WSHandler {
  constructor() {
  }

  processMessage(socket, message) {
    /**
     * examples:
     * {"type":"auth", "message": "jsonwebtoken"}
     * {"type":"sendData", "message":"NumberOfThigns"}
     */
    let json = JSON.parse(message)

    switch (json.type) {
      case 'auth':
        
        break;
    
      default:
        break;
    }
  }

  handleAuthorization(socket, token) {
    // if token works, do nothing
    // else ws.terminate()
  }
}