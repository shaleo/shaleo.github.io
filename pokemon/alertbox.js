if (document.getElementById) {
    window.alert = function (alert_message) {
        custom_alert(alert_message);
    }
}

function custom_alert(inParam) {
    const inData = inParam.split("|")
    let inStyle = ""
    let inTitle = ""
    let inMessages = []
    for (let i = 0; i < inData.length; i++) {
        if (i == 0) {
            inStyle = inData[0]
        }
        if (i == 1) {
            inTitle = inData[1]
        }
        if (i > 1) {
            inMessages.push(inData[i])
        }
    }

    let is_alert_container_exist = document.getElementById("alert_container");
    if (is_alert_container_exist) {
        return;
    }
    let get_body_element = document.querySelector("body");

    let div_for_alert_container = document.createElement("div");

    let alert_container = get_body_element.appendChild(div_for_alert_container);
    alert_container.id = "alert-container";
    alert_container.className = "alert-container"

    let div_for_alert_box = document.createElement("div")

    let alert_box = alert_container.appendChild(div_for_alert_box);
    alert_box.className = "alert-box";
    alert_box.style.top = document.documentElement.scrollTop + "px";
    alert_box.style.left = (document.documentElement.scrollWidth - alert_box.offsetWidth) / 2 + "px";

    let alert_title_box = document.createElement("div")
    alert_title_box.className = "alert-title-box";
    alert_title_box.style.backgroundColor = inStyle;

    let alert_title = document.createElement("div")
    alert_title.innerText = inTitle;
    alert_title.className = "alert-title"
    alert_title_box.appendChild(alert_title)
    alert_box.appendChild(alert_title_box)

    const alertMessageBox = document.createElement("div")
    alertMessageBox.className = "alert-message-box";
    for (let i = 0; i < inMessages.length; i++) {
        const thisMessage = inMessages[i].split(":", 2)
        if (thisMessage[1] != undefined) {

            const alertMessageRow = document.createElement("div")
            alertMessageRow.className = "alert-message-row";
            const alertLead = document.createElement("strong")
            alertLead.className = "alert-message";
            alertLead.style.color = inStyle;
            alertLead.innerText = thisMessage[0] + ": ";
            alertMessageRow.appendChild(alertLead)

            let alertMessage = document.createElement("div")
            alertMessage.className = "alert-message";
            alertMessage.style.color = inStyle;
            if (thisMessage[1].includes("¤")) {
                alertMessage = document.createElement("a")
                alertMessage.setAttribute('href', alertMessage.innerText = thisMessage[1].replaceAll("¤", ":"))
                alertMessage.setAttribute('target', "_blank")
            } else {
                alertMessage.innerText = thisMessage[1].replaceAll("¤", ":");
            }
            alertMessageRow.appendChild(alertMessage)
            alertMessageBox.appendChild(alertMessageRow)
            alert_box.append(alertMessageBox)
        }
    }

    let ok_button = document.createElement("button");
    ok_button.className = "alert-close_btn";
    ok_button.textContent = "Return"
    ok_button.style.backgroundColor = inStyle;
    ok_button.addEventListener("click", function () {
        remove_custom_alert();
    }, false);
    alert_box.appendChild(ok_button)
}

function remove_custom_alert() {
    let HTML_body = document.querySelector("body");
    let alert_container = document.getElementById("alert-container");
    HTML_body.removeChild(alert_container);
}