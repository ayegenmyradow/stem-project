function getUsername(db, user_id){
    return new Promise(function(resolve, reject){
        const query = 'SELECT name, surname FROM tbl_users where user_id=?';
        db.query(query, user_id, function(err, result){
            if (err){
                reject(err)
            } else {
                result = result[0]
                resolve(result.name + " " + result.surname)
            }
        })
    })
}

function getUsers(db){
    return new Promise(function(resolve, reject){
        const query = `
            SELECT user_id, name, surname, phone, created_at FROM tbl_users 
                ORDER BY user_id DESC
        `;
        db.query(query, function(err, result){
            if (err){
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

function getUser(db, user_id){
    return new Promise(function(resolve, reject){
        const query = `
            SELECT user_id, name, surname, phone, created_at FROM tbl_users WHERE user_id=?
        `;
        db.query(query, [user_id], function(err, result){
            if (err){
                reject(err);
            } else {
                resolve(result[0]);
            }
        })
    })
}


function getBanners(db){
    return new Promise(function(resolve, reject){
        const query = "SELECT b.banner_id, b.name, b.image, b.target FROM tbl_banners b";
        db.query(query, function(err, result){
            err ? reject(err) : resolve(result);
        })
    })
}


function modifyUserProfile(db, data){
    return new Promise(function(resolve, reject){
        if (data.password){
            const query = "UPDATE tbl_users SET name=?, surname=?, phone=?, password=? WHERE user_id=?;";
            db.query(query, [data.name, data.surname, data.phone, data.password, data.user_id], function(err, result){
                err ? reject(err) : resolve(result);
            })
        } else {
            const query = "UPDATE tbl_users SET name=?, surname=?, phone=? WHERE user_id=?;";
            db.query(query, [data.name, data.surname, data.phone, data.user_id], function(err, result){
                err ? reject(err) : resolve(result);
            })
        }
    })
}

module.exports = {
    modifyUserProfile,
    getUsername,
    getBanners,
    getUsers,
    getUser,
}