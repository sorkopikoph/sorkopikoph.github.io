async function login (event) {
    const submitButton = document.getElementById("submit")
    event.preventDefault()
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    if (!username || !password) {
        return popup(
            "Login Error",
            "Please enter a username and password!",
            "error"
        )
    }
    submitButton.className = "fluid ui primary loading button"
    setCookie("username", username, 7)
    setCookie("password", password, 7)
    const data = await tokenify(username, password)
    if (data === false) {
        eraseCookie("username")
        eraseCookie("password")
        submitButton.className = "fluid ui primary button"
        return popup("Login Error", "Invalid username or password!", "error")
    }
    if (data === "BadRequest") {
        eraseCookie("username")
        eraseCookie("password")
        submitButton.className = "fluid ui primary button"
        return popup("Login Error", "An unexpected error occurred!", "error")
    }
    window.location.href = "/"
}

function popup (title, desc, status) {
    Swal.fire(title, desc, status)
}

function setCookie (name, value, days) {
    let expires = ""
    if (days) {
        const date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/"
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

function eraseCookie (name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
}
