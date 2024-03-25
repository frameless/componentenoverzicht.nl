import express from 'express'
import { dirname } from 'path';
import { dataModel } from './models/dataModel.js';
import { fileURLToPath } from 'url';
import path from 'path';
import favicon from 'serve-favicon';

const app = express();
const port = 3000;

app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), 'public')));
app.use(favicon(path.join(dirname(fileURLToPath(import.meta.url)), 'public', 'images', 'favicon.ico')));

app.use((req, res, next) => {
    if (req.path.endsWith('/') && req.path.length > 1) {
        const query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
    } else {
        next();
    }
});

const viewsPath = path.join(dirname(fileURLToPath(import.meta.url)), 'views');

app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.get('/verkenner', (req, res) => {
    req.dataModel = dataModel;
    res.render('verkenner/index', {
        lang: 'nl',
        description: '',
        queryParams: req.query
    });
});

app.get('/component-ehbo', (req, res) => {
    req.dataModel = dataModel;
    res.render('component-ehbo/index', {
        lang: 'nl',
        description: '',
        queryParams: req.query
    });
});


app.listen(port, () => {
    console.log(`Server started on https://localhost:${port}`)
})