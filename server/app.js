var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

const Convertor = require('./convertor/convertorEngine');
const convertor = new Convertor();

var indexRouter = require('./routes/index');
const vocabRouter = require('./routes/vocab');
const authRouter = require('./routes/auth');
const verifyRouter = require('./routes/verify')
const languagesRouter = require('./routes/languages')
const batchesRouter = require('./routes/batches')
const bountyRouter = require('./routes/bounty')
const setBountyRouter = require('./routes/setBounty')

const mongoose = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use('/', indexRouter);
app.use('/vocab', vocabRouter);
app.use('/auth', authRouter);
app.use('/verify', verifyRouter);
app.use('/languages', languagesRouter);
app.use('/batches', batchesRouter);
app.use('/bounty', bountyRouter);
app.use('/setbounty', setBountyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/langvocab', {
    useNewUrlParser: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});

convertor.parseAllEntries().then(log => {
  console.log('finished')
  convertor.updateLanguages();
  convertor.updateBatches();
});

module.exports = app;
