const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { log } = require('console');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        res.render('index', {files:files});
    });
});

app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('_')}.txt`, req.body.details, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error creating task');
        }
        res.redirect('/');
    });
});


app.get('/files/:fileName', (req, res) => {
    fs.readFile(`./files/${req.params.fileName}`, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(404).send('File not found');
        }
        res.render('showfile', { fileName: req.params.fileName, content: data });
    });
});

app.get('/edit/:fileName', (req, res) => {
    res.render('edit', { fileName: req.params.fileName });
});      

app.post('/edit', (req, res) => {
   fs.rename(`./files/${req.body.fileName}`, `./files/${req.body.newFileName}`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error renaming file');
        }
        res.redirect('/');
    });
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});