import { Router } from 'express'
import { sanitizeTicketInput, findAll, findAllByUser, findOne, add, update, remove, changeTicketState } from './ticket.controller.js'

export const ticketRouter = Router()

ticketRouter.get('/', findAll)
ticketRouter.get('/:number', findOne)
ticketRouter.get('/user/:token_id', findAllByUser)
ticketRouter.post('/', sanitizeTicketInput, add)
ticketRouter.put('/:number', sanitizeTicketInput, update)
ticketRouter.patch('/:number', sanitizeTicketInput, update)
ticketRouter.delete('/:number', remove)
ticketRouter.patch('/ticketState/:number', sanitizeTicketInput, changeTicketState)