const express = require('express')
const { v4 } = require('uuid')

const app = express()

app.use(express.json())

const customers = []

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

app.get('/statement/:cpf', (req, res) => {
    const { cpf } = req.params

    const customer = customers.find((customer) => customer.cpf === cpf)

    return res.json(customer.statement)
})

app.listen(3333, () => {
    console.log('Server is running on port 3333')
})
