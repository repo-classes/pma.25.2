const URI = "http://127.0.0.1:80";

const logout = () => {
    localStorage.removeItem("token");
    loadUserInfo();
    return false;
}

const login = () => {
    logout();
    var payload = {
        email: document.getElementById("accountEmail").value,
        password: document.getElementById("accountPassword").value
    };
    console.log("Sending payload:", payload);
    fetch(`${URI}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    }).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    }).then(data => {
        console.log("Success:", data);
        const token = data.jwt;
        localStorage.setItem("token", token);
        const decoded = decodeJwt(token);
        console.log("Decoded JWT:", decoded);
        loadUserInfo();
    }).catch((error) => {
        console.error("Error:", error);
    });
    return false;
}

const register = () => {
    var payload = {
            name: document.getElementById("accountName").value,
            email: document.getElementById("accountEmail").value,
            password: document.getElementById("accountPassword").value
    };
    console.log("Sending payload:", payload);
    fetch(`${URI}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    }).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    }).then(data => {
        console.log("Success:", data);
        const token = data.jwt;
        localStorage.setItem("token", token);
        const decoded = decodeJwt(token);
        console.log("Decoded JWT:", decoded);
        loadUserInfo();
    }).catch((error) => {
        console.error("Error:", error);
    });
    return false;
};

function decodeJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window
            .atob(base64)
            .split("")
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Invalid JWT token", error);
        return null;
    }
}

const loadUserInfo = () => {
    const token = localStorage.getItem("token");
    if (token) {
        const decoded = decodeJwt(token);
        if (decoded) {
            document.getElementById("user-name").innerText = `Name: ${decoded.sub}`;
            document.getElementById("user-email").innerText = `Email: ${decoded.email}`;
        } else {
            document.getElementById("user-name").innerText = "Invalid token";
            document.getElementById("user-email").innerText = "";
        }
    } else {
        document.getElementById("user-name").innerText = "No token found";
        document.getElementById("user-email").innerText = "";
    }
};

const saveAccount = () => {
    var payload = {
            name: document.getElementById("accountName").value,
            email: document.getElementById("accountEmail").value,
            password: document.getElementById("accountPassword").value
    };
    console.log("Sending payload:", payload);
    fetch(`${URI}/account`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ... (localStorage.getItem("token") && { "Authorization": `Bearer ${localStorage.getItem("token")}` })
        },
        body: JSON.stringify(payload)
    });
    return false;
};

const getAccounts = () => {
    fetch(`${URI}/account`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ... (localStorage.getItem("token") && { "Authorization": `Bearer ${localStorage.getItem("token")}` })
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    }).then(data => {
        console.log("Success:", data);
        const accountList = document.getElementById("account-list");
        accountList.innerHTML = "";
        data.forEach(account => {
            const div = document.createElement("div");
            div.innerText = `Name: ${account.name}, Email: ${account.email}`;
            accountList.appendChild(div);
        });
    }).catch((error) => {
        console.error("Error:", error);
    });
};

const getSettings = () => {
    fetch(`${URI}/account/whoami`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ... (localStorage.getItem("token") && { "Authorization": `Bearer ${localStorage.getItem("token")}` })
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    }).then(data => {
        console.log("Success:", data);
        document.getElementById("accountId").value = data.id;
        document.getElementById("accountName").value = data.name;
        document.getElementById("accountEmail").value = data.email;
    }).catch((error) => {
        console.error("Error:", error);
    });
};