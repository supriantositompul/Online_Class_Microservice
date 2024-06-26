const express = require("express");
const router = express.Router();
var isBase64 = require("is-base64");
var base64Img = require("base64-img");
const fs = require("fs");
// Aktifkan middleware untuk memproses body dari request
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

var { Media } = require("../models");

router.get("/", async(req, res) => {
    const media = await Media.findAll({
        attributes: ["id", "image"],
    });
    //findAll berfungsi untuk mengambil semua row yang ada pada tabel media

    //Mengubah image menjadi URL yang bisa dipakai
    const mappedMedia = media.map((m) => {
        m.image = `${req.get("host")}/${m.image}`;
        return m;
    });
    return res.json({
        status: "success",
        data: mappedMedia,
    });
});

router.post("/", (req, res) => {
    const image = req.body.image;

    if (!isBase64(image, { mimeRequired: true })) {
        return res.status(400).json({ status: "error", message: "invalid base64" });
    }
    base64Img.img(image, "./public/images", Date.now(), async(err, filepath) => {
        if (err) {
            return res.status(400).json({ status: "error", message: err.message });
        }

        const filename = filepath.split("\\").pop().split("/").pop();
        const media = await Media.create({ image: `images/${filename}` });
        return res.json({
            status: "succes",
            data: {
                id: media.id,
                image: `${req.get("host")}/images/${filename}`,
            },
        });
    });
});

//API Delete
router.delete("/:id", async(req, res) => {
    const id = req.params.id;

    const media = await Media.findByPk(id);

    if (!media) {
        return res
            .status(404)
            .json({ status: "error", message: "media not found" });
    }

    fs.unlink(`./public/${media.image}`, async(err) => {
        if (err) {
            return res.status(400).json({ status: "error", message: err.message });
        }

        await media.destroy();

        return res.json({
            status: "success",
            message: "image deleted",
        });
    });
});
module.exports = router;