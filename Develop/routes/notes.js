const fs = require('fs');
const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');

notes.get('/', (req, res) => {
    fs.readFile('./db/db.json', { encoding: 'utf8' }, (err, db) => {
        if (!err) {
            res.status(200).json(JSON.parse(db));
        } else {
            res.status(500).json(err);
        }
    });
});

notes.post('/', (req, res) => {
    const new_id = uuidv4();
    fs.readFile('./db/db.json', { encoding: 'utf8' }, (err, db) => {
        if (!err) {
            const db_json = JSON.parse(db);
            const { title, text } = req.body;
            const new_note = {
                id: new_id,
                title: title,
                text: text
            }
            db_json.push(new_note);
            fs.writeFile('./db/db.json', JSON.stringify(db_json), (err) => {
                err ? console.error(err) : console.info('successfully saved');
            });
            const response = {
                status: 'success',
                body: new_note
            };
            console.log(response);
            res.status(201).json(response);
        } else {
            res.status(500).json('Could not save, please try again');
        }
    });
});

//https://www.tabnine.com/code/javascript/functions/express/Express/delete and https://expressjs.com/en/4x/api.html#app to learn how to add the delete function below tied in with coding above

notes.delete('/:id', (req, res) => {
    const note_id = req.params.id;
    fs.readFile('./db/db.json', { encoding: 'utf8' }, (err, db) => {
        if (!err) {
            const db_json = JSON.parse(db);
            const new_db = db_json.filter(e => e.id !== note_id);
            fs.writeFile('./db/db.json', JSON.stringify(new_db), (err) => {
                err ? console.error(err) : console.info('sucessfully deleted');
            });
            const response = {
                status: 'success',
                body: new_db
            };
            res.status(204).json(response);
        } else {
            res.status(500).json('Could not delete, please try again');
        }
    });
});

module.exports = notes;