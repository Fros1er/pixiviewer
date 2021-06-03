const Aria2 = require("aria2");
const sql = require("./sql");
require('events').EventEmitter.defaultMaxListeners = 999
const aria2 = new Aria2();

aria2.open();

arr = {};

function startqueue() {
    sql.getdownloadlist().then(result => {
        for (let i = 0; i < result.length; i++) {
            download(result[i].url, result[i].illustId, true);
        }
    });
}

function callaria2(url, illustId) {
    aria2
        .call("addUri", [url], {
            header: [
                "User-Agent:Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.94 Safari/537.36",
                "Referer:https://www.pixiv.net/member_illust.php?mode=medium&illust_id=" +
                    illustId
            ],
            dir: 'D:/资源保存/pixiviewer/release/static'
        })
        .then(gid => (arr[gid] = url));
    aria2.on("onDownloadComplete", params => {
        // console.log(arr)
        gid = params[0].gid;
        sql.stopdownload(arr[gid]);
    });
}

function download(url, illustId, isqueue) {
    for (let i in arr) {
        if (arr[i] == url) return;
    }
    if (isqueue) {
        callaria2(url, illustId);
    } else {
        sql.startdownload(url).then(() => callaria2(url, illustId));
    }
}

//download('https://i.pximg.net/c/250x250_80_a2/img-master/img/2019/12/13/13/48/54/78271401_p0_square1200.jpg', '78271401', false);

module.exports = { download, startqueue };
