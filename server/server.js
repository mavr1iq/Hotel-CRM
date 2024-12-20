const express = require('express')
const cors = require("cors");
const session = require('express-session');
const dotenv =  require('dotenv')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();

dotenv.config({ path: '../.env' })

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:8081',
    credentials: true
}));

// Middleware для сесій
app.use(session({
    secret: 'gojosatoru',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.get('/api/user', async (req, res)  => {
    try {
        if (req.session.user) {
            const email = req.session.user['email']
            const user = await prisma.users.findUnique({
                where: { email }
            })
            res.status(200).json(user)
        } else {
            res.status(401).json({ error: 'Not logged in' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error while getting user ' + error.toString() })
    }

});

app.get('/api/admins', async (req, res) => {
    try {
        const admins = await prisma.users.findMany({
            where: {
                role: true
            }
        })
        res.status(200).json(admins)
    } catch (error) {
        res.status(500).json({ error: 'Error while getting admins ' + error.toString() })
    }
})

app.get('/api/logoff', async (req, res) => {
    try {
        if (req.session.user) {
            req.session.user = null
        }
        res.status(200).json({ message: 'Logged off' });
    } catch (error) {
        res.status(500).json({ error: 'Error while logging off ' + error.toString() })
    }
})

app.get('/api/rooms', async (req, res) => {
    try {
        let rooms = await prisma.rooms.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                Locations: {
                    select: {
                        address: true
                    }
                },
            },
            orderBy: {
                id: "asc",
            }
        })
        rooms = rooms.map((room) => ({
            id: room.id,
            name: room.name,
            description: room.description,
            address: room.Locations.address
        }))

        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Error while selecting rooms ' + error.toString() })
    }
})

app.get('/api/rooms/:id', async (req, res) => {
    let { id } = req.params
    try {
        let room = await prisma.rooms.findUnique({
            select: {
                id: true,
                name: true,
                description: true,
                Locations: {
                    select: {
                        address: true
                    }
                },
            },
            where: {
                id: parseInt(id)
            }
        })

        room.address = room.Locations.address
        res.status(200).json(room)
    } catch (error) {
        res.status(500).json({ error: 'Error while getting room by id ' + error.toString() })
    }
})

app.get('/api/locations/:id', async (req, res) => {
    let { id } = req.params
    try {
        const response = await prisma.locations.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if (!response) {
            res.status(400).json({ error: 'Unable to find location' })
            return
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error while getting location ' + error.toString() })
    }
})

app.get('/api/locations', async (req, res) => {
    try {
        const locations = await prisma.locations.findMany()

        if (!locations) {
            res.status(400).json({ error: 'Unable to find locations' })
            return
        }
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Error while getting locations ' + error.toString() })
    }
})

app.get('/api/cart', async (req, res) => {
    try {
        if (req.session.user) {
            const email = req.session.user['email']
            let response = await prisma.users.findUnique({
                where: {
                    email: email
                }
            })

            const user_id = response.id

            response = await prisma.reservations.findMany({
                where: {
                    user_id: user_id
                }
            })
            res.status(200).json(response)
        } else {
            res.status(400).json({ error: 'User is not logged in ' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error while getting items from cart ' + error.toString() })
    }
})

app.post('/api/locations/:address', async (req, res) => {
    const { address } = req.params
    try {
        const response = await prisma.locations.findUnique({
            where: {
                address: address
            }
        })

        if (!response) {
            res.status(400).json({ error: 'Unable to find location' })
            return
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error while getting location ' + error.toString() })
    }
})

app.post("/api/register", async (req, res) => {
    const { name, email, pass }= req.body

    try {
        const isExists = await prisma.users.findUnique({
            where: { email }
        })

        if (isExists) {
            res.status(400).json({ error: "Email already in use" });
            return
        }

        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                pass
            }
        })

        req.session.user = { email }
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Error creating User " + error.toString()});
    }
})

app.post('/api/login', async (req, res) => {
    const { email, pass } = req.body

    try {
        const user = await prisma.users.findUnique({
            where: { email }
        })

        if (!user) {
            res.status(400).json( { error: 'User doesn`t exists'})
            return
        }

        if (user.pass !== pass) {
            res.status(401).json( { error: 'Incorrect password'})
            return
        }

        req.session.user = { email }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json( { error: 'Error while logging in ' + error.toString() } )
    }
})

app.post('/api/rooms', async (req, res) => {
    const { name, description, location_id } = req.body

    try {
        const response = await prisma.rooms.create({
            data: {
                name: name,
                description: description,
                location_id: location_id
            }
        })

        if (!response) {
            res.status(400).json({ error: 'Unable to create room' })
            return
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error while creating room ' + error.toString() })
    }
})

app.post('/api/locations', async (req, res) => {
    const { address } = req.body

    try {
        const response = await prisma.locations.create({
            data: {
                address: address
            }
        })

        if (!response) {
            res.status(400).json({ error: 'Unable to create location' })
            return
        }
        res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: 'Error while creating location ' + error.toString() })
    }
})

app.post('/api/cart/:id', async (req, res) => {
    const { id } = req.params
    try {
        if (req.session.user) {
            const email = req.session.user['email']
                let response = await prisma.users.findUnique({
                where: {
                    email: email
                }
            })

            const user_id = response.id

            response = await prisma.reservations.create({
                data: {
                    user_id: parseInt(user_id),
                    room_id: parseInt(id),
                }
            })
            res.status(200).json(response);
        } else {
            res.status(400).json({ error: 'User is not logged in' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error while adding item to cart ' + error.toString() })
    }
})

app.post('/api/billing', async (req, res) => {
    const { amount } = req.body

    try {
        if (req.session.user) {
            const email = req.session.user['email']
            let response = await prisma.users.findUnique({
                where: {
                    email: email
                }
            })

            const user_id = response.id

            const billing = await prisma.billingInfo.create({
                data: {
                    user_id: user_id,
                    amount: amount
                }
            })

            if (billing) {
                res.status(200).json(billing);
            } else {
                res.status(400).json({ error: 'Unable to create billing info' })
            }
        }


    } catch (error) {
        res.status(500).json({ error: 'Error while creating billing info ' + error.toString() })
    }
})

app.put('/api/rooms/:id', async (req, res) => {
    const { name, description, location_id } = req.body
    const { id } = req.params
    try {
        const response = await prisma.rooms.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: name,
                description: description,
                location_id: location_id
            }
        })

        if (!response) {
            res.status(400).json({ error: 'Unable to update room' })
            return
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error while updating room ' + error.toString() })
    }
})

app.put('/api/locations/:id', async (req, res) => {
    const { address } = req.body
    const { id } = req.params

    try {
        const response = await prisma.locations.update({
            where: {
                id: parseInt(id)
            },
            data: {
                address: address
            }
        })
        if (!response) {
            res.status(400).json({ error: 'Unable to update location' })
            return
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error while updating location ' + error.toString() })
    }
})

app.delete('/api/rooms/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await prisma.rooms.delete({
            where: {
                id: parseInt(id)
            }
        })

        if (!response) {
            res.status(400).json({ error: 'Unable to delete room, room is not found' })
            return
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting room ' + error.toString() })
    }
})

app.delete('/api/cart/:id', async (req,res) => {
    const { id } = req.params;

    try {
        if (req.session.user) {
            const email = req.session.user['email']
            let response = await prisma.users.findUnique({
                where: {
                    email: email
                }
            })

            const user_id = response.id

            response = await prisma.reservations.deleteMany({
                where: {
                    AND: [
                        {user_id: user_id},
                        {room_id: parseInt(id)}
                    ]
                }
            })
            res.status(200).json(response);
        } else {
            res.status(400).json({ error: 'User is not logged in' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting from cart ' + error.toString() })
    }
})

app.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
});