async function generateAccount () {
    const genButton = document.getElementById("genButton")
    const usernameInput = document.getElementById("username")
    const passwordInput = document.getElementById("password")
    genButton.className = "ui teal loading button"
    const [username, password] = await (await fetch("https://prodigyaccountgenerator.hostedposted.repl.co/gen/")).json()
    const tokenReq = await tokenify(username, password)
    if (tokenReq === false || tokenReq === "BadRequest") {
        await Swal.fire(
            "Account Error",
            "There's an error with account generation right now! Please try again later.",
            "error"
        )
    }
    const defaultDataFetch = await (await fetch("https://prodigy-dashboard.hostedposted.com/create/defaultData.json")).json()
    await fetch(
        "https://prodigy-api.hostedposted.com/player/",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${tokenReq.token}`,
                "content-type": "application/json",
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9"
            },
            body: JSON.stringify(defaultDataFetch)
        }
    )
    usernameInput.value = username
    passwordInput.value = password
    genButton.className = "ui teal button"
}

async function tokenify (username, password) {
    const response = await fetch(
        "https://prodigy-api.hostedposted.com/token/",
        {
            headers: {
                authorization: btoa(`${username}:${password}`),
                "content-type": "application/json",
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua":
                    "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            }
        }
    )
    const data = await response.text()
    if (data.startsWith("Internal")) return false
    if (!response.ok) return "BadRequest"
    return JSON.parse(data)
}
