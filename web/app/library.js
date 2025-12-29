const URI = "http://127.0.0.1:80";

const logout = () => {
    fetch(`${URI}/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    }).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response;
    }).then(data => {
        console.log("Success:", data);
        loadUserInfo();
    }).catch((error) => {
        console.error("Error:", error);
    });
    return false;
}

const login = () => {
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
        credentials: "include",
        body: JSON.stringify(payload)
    }).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response;
    }).then(data => {
        console.log("Success:", data);
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
        credentials: "include",
        body: JSON.stringify(payload)
    }).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    }).then(data => {
        console.log("Success:", data);
        loadUserInfo();
    }).catch((error) => {
        console.error("Error:", error);
    });
    return false;
};

const loadUserInfo = () => {
    console.log("Getting user info");
    fetch(`${URI}/account/whoami`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    }).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    }).then(data => {
        console.log("Success:", data);
        document.getElementById("user-name").innerText = `Name: ${data.name}`;
        document.getElementById("user-email").innerText = `Email: ${data.email}`;
    }).catch((error) => {
        document.getElementById("user-name").innerText = ``;
        document.getElementById("user-email").innerText = ``;
        console.error("Error:", error);
    });
    return false;
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
        credentials: "include",
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
        },
        credentials: "include"
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
        },
        credentials: "include"
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