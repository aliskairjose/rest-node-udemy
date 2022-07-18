
import { Router } from "express";
import { check } from "express-validator";
import { SearchController } from "../controllers/search.controller.js";

export class SearchRoute {
  constructor() {
    this.router = Router()
    this.searchCtrl = new SearchController

    /**
     *  /api/search
     */
    this.router.get('/:collection/:termino', this.searchCtrl.search)
  }
}