export default class WSHandler {
  constructor() {
  }

  processMessage(socket, message) {
    /**
     * example of message
     * {"token":"jsonwebtoken", count: 1}
     */
    let json = JSON.parse(message)

    this.handleAuthorization(json.token).then((res) => {
      if (res) {
        let data = json.count
        let area = res.area
      } // else do nothing
      socket.terminate()
    })
  }

  async handleAuthorization(token) {
    // if token works, output parsed jsonwebtoken data
    // else return false
  }
}