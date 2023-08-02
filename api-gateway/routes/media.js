var express = require("express");
var router = express.Router();
const mediaHandler = require("./handler/media");

// /* POST */
router.post("/", mediaHandler.create);
/* GET users listing. */
router.get("/", mediaHandler.getAll);

router.delete("/:id", mediaHandler.destroy);

module.exports = router;
