import { request } from './http-client'

const paymentService = {
  savedCards: (params: { branch_id: string }) =>
    request.get('/v1/payment/saved-cards', { params }),
}

export default paymentService
