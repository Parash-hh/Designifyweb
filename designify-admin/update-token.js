const { Client } = require('pg');
const client = new Client({
  host: 'ep-plain-hall-a1wr2s8w-pooler.ap-southeast-1.aws.neon.tech',
  port: 5432,
  database: 'designify',
  user: 'neondb_owner',
  password: 'npg_GVL9hqF8cPRy',
  ssl: { rejectUnauthorized: false }
});

client.connect().then(() => {
  return client.query('SELECT id, name, type FROM strapi_api_tokens');
}).then(res => {
  console.log('Tokens:', res.rows);
  return client.query("UPDATE strapi_api_tokens SET type = 'full-access'");
}).then(() => {
  console.log('Updated tokens to full-access.');
  return client.end();
}).catch(err => console.error('Postgres error:', err));
