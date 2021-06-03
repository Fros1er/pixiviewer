var mysql = require("mysql");
//const download = require("./download");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "198101602",
    database: "pixiv",
    charset: "utf8mb4"
});

connection.connect();

function query(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function checkfav(id, page) {
    return query(
        "SELECT * FROM favourites WHERE favourites.illustId = ? AND favourites.pageCount = ?",
        [id, page]
    );
}

function checktag(id, tag) {
    return query("SELECT * FROM tag WHERE tag.illustId = ? AND tag.tags = ?", [
        id,
        tag
    ]);
}

function addillust(
    illustId,
    page,
    illustTitle,
    illustComment,
    userName,
    userId,
    url
) {
    return checkfav(illustId, page).then(result => {
        if (result.length == 0) {
            return query(
                "INSERT INTO `pixiv`.`favourites`(`illustId`, `pageCount`, `illustTitle`, `illustComment`, `userName`, `userId`, `downloadUrl`, `path`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    illustId,
                    page,
                    illustTitle,
                    illustComment,
                    userName,
                    userId,
                    url,
                    url.split("/").pop()
                ]
            );
        }
    });
}

function addtag(tag, illustId) {
    return checktag(illustId, tag).then(result => {
        if (result.length == 0) {
            return query(
                "INSERT INTO `pixiv`.`tag`(`tags`, `illustId`) VALUES (?, ?)",
                [tag, illustId]
            );
        }
    });
}

function startdownload(url) {
    return query("SELECT * FROM `download_list` WHERE `url` = ?", [url]).then(
        result => {
            if (!result[0]) {
                return query(
                    "INSERT INTO `pixiv`.`download_list`(`url`) VALUES (?)",
                    [url]
                );
            }
        }
    );
}

function stopdownload(url) {
    query("DELETE FROM `pixiv`.`download_list` WHERE `url` = ?", [url]);
}

function getdownloadlist() {
    return query("SELECT * FROM `download_list`");
}

function remove(id) {
    // remove pic
}

function get(start, num) {
    return query("SELECT * FROM `favourites` LIMIT " + start + ", " + num)
}

function gettag(tag) {
    return query("SELECT favourites.* FROM tag INNER JOIN favourites ON favourites.illustId = tag.illustId WHERE tag.tags = ?", [tag])
}

function getexact(num) {
    //return query("SELECT * FROM `favourites` LIMIT " + num + ", " + "1")
    return query('SELECT favourites.* FROM tag INNER JOIN favourites ON favourites.illustId = tag.illustId WHERE tag.tags = "おっぱい" LIMIT ' + num + ", 1")
}

function getnum() {
    //return query("SELECT COUNT(*) FROM `favourites`")
    return query('SELECT COUNT(*) FROM tag INNER JOIN favourites ON favourites.illustId = tag.illustId WHERE tag.tags = "おっぱい"')
}

module.exports = {
    query,
    addillust,
    addtag,
    startdownload,
    stopdownload,
    getdownloadlist,
    remove,
    get,
    getnum,
    getexact,
    gettag
};
