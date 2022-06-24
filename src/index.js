const express = require('express')
const { v4 } = require('uuid')

const app = express()

app.use(express.json())

const customers = []

// Middleware
function verifyIfExistsAccountCpf(req, res, next) {
    const { cpf } = req.headers

    const customer = customers.find((c) => c.cpf === cpf)

    if (!customer) {
        return res.status(400).json({ error: 'Customer not found' })
    }

    req.customer = customer

    return next()
}

app.post('/account', (req, res) => {
    const { cpf, name } = req.body

    const customerAlreadyExists = customers.find(
        (customer) => customer.cpf === cpf
    )

    if (customerAlreadyExists) {
        return res.status(400).json({
            error: 'Customer already exists',
        })
    }

    customers.push({
        id: v4(),
        cpf,
        name,
        statement: [],
    })

    res.status(201).send()
    console.log(customers)
})

// app.use(verifyIfExistsAccountCpf)

app.get('/statement', verifyIfExistsAccountCpf, (req, res) => {
    const { customer } = req

    return res.json(customer.statement)
})

app.post('/deposit', verifyIfExistsAccountCpf, (req, res) => {
    const { description, amount } = req.body

    const { customer } = req

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: 'credit',
    }

    customer.statement.push(statementOperation)

    return res.status(201).json(statementOperation)
})

app.listen(3333, () => {
    console.log('Server is running on port 3333')
})
