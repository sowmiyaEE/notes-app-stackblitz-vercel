import { neon } from '@neondatabase/serverless';
const sql = neon(
  'postgres://neondb_owner:IoyDU4WLl5qz@ep-winter-art-a41lk0cb-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'
);

console.log(
  sql('select count(*) from notes;').then((d) => {
    console.log('connected', ' total:', d[0].count);
    //totalRecords = d[0].count;
  })
);

const create_o = (noteDetail) =>
  `INSERT INTO notes (  heading,  tagline, detail,  ispinned,  date) VALUES ('${noteDetail.heading}' ,'${noteDetail.tagline}', '${noteDetail.detail}', ${noteDetail.ispinned},'${noteDetail.date}');`;

const read_o = (limit = 6, offset = 0) =>
  `select * from notes  order by date desc limit ${limit} offset ${offset};`;

const update_o = (noteDetail) =>
  `UPDATE notes SET heading = '${noteDetail.heading}', tagline = '${noteDetail.tagline}', detail = '${noteDetail.detail}', ispinned = ${noteDetail.ispinned}, date = '${noteDetail.date}' where id = ${noteDetail.id} returning  *;`;

const Delete_o = (id) => `DELETE FROM notes where id = ${id};`;

let batched = [],
  updateQueries = [];

const clear = () => {
  if (batched.length) {
    let promiseA = updateQueries.map((u) => sql(u));
    Promise.all(promiseA)
      .then((d) => {
        console.log("resolved promises", d);
      })
      .catch((E) => console.log('upadteion', E));
    batched = [];
    updateQueries = [];
    return promiseA;
  }
  return true;
};
const queries = {
  create: () => {
    let noteDetail = {
      heading: null,
      tagline: null,
      ispinned: false,
      detail: null,
      date: null,
    };
    clear();
    return sql(
      `INSERT INTO notes (  heading,  tagline, detail,  ispinned,  date) VALUES (${noteDetail.heading} ,${noteDetail.tagline}, ${noteDetail.detail}, ${noteDetail.ispinned}, ${noteDetail.date}) RETURNING  *;`
    );
  },
  read: (limit, offset = 0) => {
    const query = read_o(limit, offset);
    const res = sql(query);
    clear();
    return res;
  },
  Delete: (id) => {
    clear();
    return sql(Delete_o(id));
  },
  update: (args) => {
    batched.find((a) => a.id == args.id)
      ? (batched = batched.map((a) => (a.id == args.id ? args : a)))
      : batched.push(args);
    updateQueries = batched.map((b) => update_o(b));
  },
  getTotalRecords: () => {
    return sql('select count(*) from notes;');
  },
  totalPages: () => {
    return sql('select count(*) from notes;');
      //totalRecords = d[0].count;
    }
  
  }


export default queries;
