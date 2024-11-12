// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: {_csrf_token: csrfToken}
})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

let socket = new Socket("/socket")  // No token here
socket.connect()

// Join the "room:1" channel
let channel = socket.channel("room:1", {})

channel
  .join()  // Make sure to join the channel before sending a message
  .receive("ok", (response) => {
    console.log("Joined successfully", response)
  })
  .receive("error", (response) => {
    console.log("Unable to join", response)
  })

channel.on("new_message", payload => {
  let messageElement = document.createElement("div")
  messageElement.innerText = payload.body.user + " :: " + payload.body.message
  document.getElementById("messages").appendChild(messageElement)
})

document.getElementById("send-button").addEventListener("click", function() {
  let input = document.getElementById("message-input")
  let name = document.getElementById("name")
  let message = input.value
  let user = name.value
  // Make sure we're only pushing after successfully joining
  channel.push("new_message", { body:{ message, user} })
  input.value = ""
})