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

function addTags(db, event_id, theme){
    var query = "INSERT INTO tbl_event_tags (event_id, tag) VALUES ?";
    var values = [theme.split(",").map(tag=>[event_id, "#" + tag.trim().replaceAll("#", '')])];
    db.query(query, values, (err) => console.log(err));
}

function addEventService(db, data, user_id){
    return new Promise(function(resolve, reject){
        const query = `
            INSERT INTO tbl_events(
                name, description, start_time, end_time, theme, image, capacity, is_online, link, user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
        db.query(query, [data.name, data.description, data.start_time, data.end_time, data.theme, 
            data.image, data.capacity, data.is_online === 'on', data.link, user_id], function(err, result){
                !err && addTags(db, result.insertId, data.theme || "");
            err ? reject(err) : resolve(result);
        })
    })
}

function getEvents(db, tag = ""){
    return new Promise(function(resolve, reject){
        const query = `
            SELECT
                e.event_id, e.name, e.description, e.start_time, e.end_time,
                e.created_at, e.image, e.capacity, e.link,
                COALESCE(u.name, 'UNDEFINED') as user_name,
                COALESCE(u.surname, '') as user_surname
            FROM tbl_events e 
                LEFT JOIN tbl_users u ON u.user_id=e.user_id
                LEFT JOIN tbl_event_tags t ON t.event_id=e.event_id
            WHERE t.tag=? OR ?='';
        `
        db.query(query, [tag, tag], function(err, result){
            err ? reject(err) : resolve(result);
        })
    })
}

function getTags(db){
    return new Promise(function(resolve, reject){
        const query = "SELECT DISTINCT t.tag FROM tbl_event_tags t"
        db.query(query, function(err, result){
            err ? reject(err) : resolve(result);
        })
    })
}


function addProject(db, project){
    return new Promise(function(resolve, reject){
        const query = `
            INSERT INTO tbl_projects(title, description, image, user_id, created_at)
                VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP)
            `
        db.query(query, [project.title, project.description, project.image, project.user_id], 
            function(err, result){
            err ? reject(err) : resolve(result);
        })
    })
}

module.exports = {
    modifyUserProfile,
    addEventService,
    getUsername,
    getBanners,
    getEvents,
    getUsers,
    getUser,
    getTags,
    addProject,
}