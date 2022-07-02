import { response, request } from "express";

export class UserController {
  constructor() { }

  get = (req = request, res = response) => {
    const { query, params } = req
    res.json({
      body: { query, params },
      msg: 'get API - Controller'
    })
  }

  list = (req = request, res = response) => {
    res.json({
      msg: 'get list API - Controller'
    })
  }

  post = (req = request, res = response) => {
    const body = req.body
    res.json({
      msg: 'post API - Controller',
      body
    })
  }

  put = (req = request, res = response) => {
    // Id esta definido en la ruta  this.router.put('/:id', this.user.put)
    const { id } = req.params
    res.json({
      body: id,
      msg: 'put API - Controller'
    })
  }

  patch = (req = request, res = response) => {
    res.json({
      msg: 'patch API - Controller'
    })
  }

  delete = (req, res = response) => {
    res.json({
      msg: 'delete API - Controller'
    })
  }


}