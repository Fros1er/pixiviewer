import mysql.connector
import pprint

db = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="198101602",
    database="pixiv",
    auth_plugin="mysql_native_password"
)

cursor = db.cursor()

cursor.execute("SELECT `tags` FROM `tag`")

result = cursor.fetchall()

ans = {}

for i in result:
    t = i[0]
    if t not in ans:
        ans[t] = 1
    else:
        ans[t] += 1

pprint.pprint(sorted(ans.items(), key = lambda kv:(kv[1], kv[0])))