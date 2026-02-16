import {Router} from "express"
import { nlpSearch } from "../controllers/NlpController/nlpSearch.Controller.js";
const nlpRouter = Router ();
nlpRouter.route('/nlpSearch').get(nlpSearch)

export {nlpRouter}