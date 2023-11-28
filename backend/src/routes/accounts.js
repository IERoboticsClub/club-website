module.exports.accounts = [
    {
        path: '/members',
        method: 'GET',
        scope: 'public',
        handler: async (request, res) => {
            // TODO Maybe we can add optinal requests to only get certain fields
            // Load the mongo connection
            let mongo = req.dependencies.mongo;
            try {
                await mongo.connect(); // also not ideal
            } catch (err) {
                console.error('Failed to connect to MongoDB:', err);
                return res.status(500).json({ error: 'Database connection failed' });
            }

            try {
                let db = mongo.db('AARC');
                let collection = db.collection('members');
                let members = await collection.find({}).toArray();

                // TODO - do something with the members and then return a response


            } catch (err) {
                console.error('Failed to query the database:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }
        }
    }
];
