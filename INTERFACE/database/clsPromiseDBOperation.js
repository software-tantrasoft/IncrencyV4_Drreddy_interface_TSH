const dbCon = require('../../INTERFACE/global/dbCon');
class Transaction {
    /**
     * 
     * @param {*} queryies - Array of objects 
     * @description 
     * * `If data save perfectly then function resolves commited`
     * * `If any error occures while saving then queries execution stops and return error`
     * * `If first query success and second fails then first query will rollback`
     * 
     */
    queryTransaction(queryies) {
        return new Promise((resolve, reject) => {
            dbCon.getConnection()
                .then(promiseConnection => {
                    var conn = promiseConnection.connection;
                    conn.beginTransaction((err) => {
                        queryies.forEach((element, key, arr) => {
                            // console.log(element);
                            conn.query(element.query, element.value, (err) => {
                                if (err) {
                                    reject(err)
                                    conn.rollback(() => conn.release())
                                }
                                if (Object.is(arr.length - 1, key) && !err) {
                                    conn.commit(() => conn.release())
                                    resolve('commited')
                                }

                            })
                        });
                    });
                })
        })
    }
}
module.exports = Transaction;