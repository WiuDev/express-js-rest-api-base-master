class UserController {
    async index(req, res) {
    }
    async create(req, res) {
        let { name, email } = req.body;
        if (email == undefined) {
            return res.status(400).json({ error: 'Email is invalid!' });
        }
        const [id] = await knex('users').insert({ name, email });
        return res.status(201).json({ id, name, email });
    }
}

module.exports = new UserController();