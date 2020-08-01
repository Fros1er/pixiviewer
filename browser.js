// ==UserScript==
// @name         pixiviewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include     http*://www.pixiv.net*
// @match       http://www.pixiv.net/
// @grant        none
// ==/UserScript==

"use strict";

const interval = 100;

var path = window.location.pathname.split("/")[1];
if (path == "bookmark_add.php") {
    setInterval(() => {
        let id = window.location.href.match(/(?<=illust_id=)\d+/g)[0];
        let input = document.getElementsByClassName("remove")[0];
        input.parentNode.classList.remove("js-submit-confirm");
        input.onclick = () => {
            console.log(id);
            send(id, "remove", () => {
                input.onclick = () => true;
                input.click();
            });
            return false;
        };
    }, interval);
} else if (path != "users" && path != "tags" && path != "artworks") {
    setInterval(() => {
        for (let i of $("div[data-id]")) {
            if (i.getAttribute("class").indexOf(" on ") != -1) {
                continue;
            }
            i.onclick = () => {
                console.log(i.getAttribute("data-id"));
                send(i.getAttribute("data-id"), "add");
            };
        }
    }, interval);
    if (path == "bookmark.php") {
        
        let myspan = document.createElement('a')
        myspan.innerText = "下载全部"
        myspan.onclick = () => {
            $('#illust-recommend').remove()
            for (let i of $("div[data-id]")) {
                console.log(i.getAttribute("data-id"));
                send(i.getAttribute("data-id"), "add");
            }
        }
        $('.column-label')[0].appendChild(myspan)
    }
} else {
    setInterval(() => {
        let svgs = document.getElementsByTagName("svg");
        for (let i of svgs) {
            if (i.parentNode.nodeName == "BUTTON") {
                let tmp = i.parentNode.parentNode.parentNode.previousSibling;
                if (tmp && tmp.nodeName == "A") {
                    let id = tmp.href.split("/").pop();
                    i.onclick = () => {
                        console.log(id);
                        send(id, "add");
                    };
                }
                if (i.parentNode.nodeName == "BUTTON") {
                    for (let j of i.children) {
                        if (j && j.nodeName == "g") {
                            let id = window.location.pathname.split("/").pop();
                            i.onclick = () => {
                                console.log(id);
                                send(id, "add");
                            };
                        }
                    }
                }
            }
        }
    }, interval);
}

console.log("pixiviewer loaded.");


function send(id, action, callback = false) {
    fetch("http://127.0.0.1:9876?action=" + action + "&id=" + id, {
        method: "GET",
        mode: "cors"
    })
        .then(function(res) {
            console.log(res);
            return res.text();
            /*if (response.status >= 200 && response.status < 300) {
                return response;
            }
            const error = new Error(response.statusText);
            error.response = response;
            throw error;*/
        })
        .then(data => {
            if (data != "succeed") {
                const error = new Error(data);
                throw error;
            }
            if (callback) {
                callback();
            }
        })
        .catch(err => {
            console.log(err);
            if (confirm(err + "\n" + "Retry?")) {
                send(id, action, callback);
            }
        });
}
