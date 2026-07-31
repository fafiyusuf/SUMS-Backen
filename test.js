const { Client } = require("pg");

const client = new Client({
    connectionString: "YOUR_DATABASE_URL",
});

client.connect()
    .then(() => {
        console.log("✅ Connected");
        return client.end();
    })
    .catch(console.error);