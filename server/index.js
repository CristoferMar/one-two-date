require('dotenv/config');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.use(staticMiddleware);

app.post('/api/lists', (req, res, next) => {
  const { listName } = req.body;
  if (!listName) {
    throw new ClientError(400, 'A valid listName is required');
  }
  const validName = listName.split(' ').join('');
  if (!validName) {
    throw new ClientError(400, 'A valid listName is required');
  }

  const sql = `
    insert into "lists" ("listTitle", "userId")
    values ($1, 1)
    returning "listTitle", "listId"
  `;
  const params = [listName];

  db.query(sql, params)
    .then(result => {
      const message = result.rows[0];
      res.status(201).json(message);
    })
    .catch(err => next(err));

});

app.post('/api/dates', (req, res, next) => {
  const listId = parseInt(req.body.listId);
  const { dateIdea, costAmount } = req.body;
  if (!Number.isInteger(listId) || listId < 0) {
    throw new ClientError(400, 'The listId must be a positive integer');
  }
  if ((!dateIdea) || (!costAmount)) {
    throw new ClientError(400, 'The dateIdea and costAmount fields are required');
  }

  const sql = `
    with "userList" as (
      select "listId"
        from "lists"
       where "userId" = 1
         and "listId" = $1
    )
    insert into "dates" ("listId", "dateIdea", "costAmount")
    select $1, $2, $3
     where exists (select * from "userList")
    returning "listId", "dateId", "dateIdea", "costAmount";
  `;
  const params = [listId, dateIdea, costAmount];

  db.query(sql, params)
    .then(result => {
      // console.log(result.rows);
      if (result.rows.length === 0) {
        throw new ClientError(404, `Could not find a list with listId ${listId}`);
      }
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/lists', (req, res, next) => {
  const sql = `
    select "listId", "listTitle", "isPublic"
    from "lists"
    where "userId" = 1
    order by "listId" desc;
  `;
  const params = [];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
