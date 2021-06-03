const http = require("http");
const url = require("url");
const download = require("./download");
const sql = require("./sql");
const request = require("request");
const querystring = require("querystring");

function add(
    illustId,
    illustTitle,
    userName,
    userId,
    pageCount,
    illustComment,
    urls,
    tags
) {
    let promises = [];
    for (let i = 0; i < pageCount; i++) {
        console.log("start adding: " + illustId + " page: " + i);
        download.download(urls[i], illustId, false);
        promises.push(
            sql.addillust(
                illustId,
                i,
                illustTitle,
                illustComment,
                userName,
                userId,
                urls[i]
            )
        );
    }
    for (let i of tags) {
        promises.push(sql.addtag(i, illustId));
    }
    return Promise.all(promises);
}

download.startqueue();
var count = 0;

var server = http
    .createServer(function (req, res) {
        res.writeHead(200, {
            "content-type": "text/plain",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
            "Access-Control-Allow-Headers":
                "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
        });

        var method = req.method;

        switch (method) {
            case "GET":
                var pathname = url.parse(req.url).pathname;

                if (pathname == "/favicon.ico") {
                    res.write("");
                    res.end();
                    break;
                }

                var params = url.parse(req.url, true).query;

                switch (params.action) {
                    case "get":
                        sql.get(params.start, params.num).then((result) => {
                            res.write(JSON.stringify(result));
                            res.end();
                        });
                        break;

                    case "getnum":
                        sql.getnum().then((result) => {
                            res.write(JSON.stringify(result));
                            res.end();
                        });
                        break;
                    case "gettag":
                        sql.gettag(params.tag).then((result) => {
                            res.write(JSON.stringify(result));
                            res.end();
                        });
                        break;
                    default:
                        var urls = [],
                            tags = [],
                            illustId = params.id,
                            illustTitle,
                            userName,
                            userId,
                            pageCount,
                            illustComment;
                        console.log(
                            "https://www.pixiv.net/ajax/illust/" + params.id
                        );
                        request(
                            {
                                url:
                                    "https://www.pixiv.net/ajax/illust/" +
                                    params.id,
                                method: "get",
                                strictSSL: false,
                                rejectUnauthorized: false,
                                headers: {
                                    Referer:
                                        "https://www.pixiv.net/member_illust.php?mode=medium&illust_id=" +
                                        params.id,
                                },
                            },
                            (error, response, body) => {
                                if (!error && response.statusCode == 200) {
                                    try {
                                        data = JSON.parse(body).body;
                                        console.log(data);
                                        pageCount = data.pageCount;
                                        for (let i = 0; i < pageCount; i++) {
                                            urls.push(
                                                data.urls.original.replace(
                                                    /(?<=_p)\d/g,
                                                    i
                                                )
                                            );
                                        }
                                        for (let i of data.tags.tags) {
                                            tags.push(i.tag);
                                        }
                                        illustTitle = data.illustTitle;
                                        userName = data.userName;
                                        userId = data.userId;
                                        illustComment = data.illustComment;
                                        if (params.action == "add") {
                                            console.log(
                                                "start adding: " + illustId
                                            );
                                            add(
                                                illustId,
                                                illustTitle,
                                                userName,
                                                userId,
                                                pageCount,
                                                illustComment,
                                                urls,
                                                tags
                                            ).then((results) => {
                                                console.log(results);
                                                count += 1;
                                                console.log(count);
                                                res.write("succeed");
                                                res.end();
                                            });
                                        } else {
                                            res.write("Invalid action.");
                                            res.end();
                                            return;
                                        }
                                    } catch (SyntaxError) {
                                        res.write("req to pixiv failed.");
                                        res.end();
                                    }
                                } else {
                                    res.write("req to pixiv failed.");
                                    res.end();
                                    console.log("Error" + error);
                                    console.log(response.statusCode);
                                }
                            }
                        );
                }

                break;
            case "POST":
                path = req.url;
                var result = "";
                req.on("data", (chunk) => {
                    result += chunk.toString();
                });

                req.on("end", () => {
                    arr = JSON.parse(result).id;
                    let promises = [];
                    for (let i of arr) {
                        promises.push(sql.getexact(i));
                    }
                    Promise.all(promises)
                        .then((result) => {
                            let ans = [];
                            for (let i of result) {
                                ans.push(i[0]);
                            }
                            res.write(JSON.stringify(ans));
                            res.end();
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                });
                break;
            case "OPTIONS":
                res.end();
                break;
        }
    })
    .listen(9876)
    .on("error", function (err) {
        console.log(err);
    });

console.log("Server running at http://127.0.0.1:9876/");
