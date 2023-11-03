const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");

//route 1 : get all notes using :Get"/api/notes/fetchallnotes.
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//route 2 : Add New Note using  using Post:Get"/api/notes/addnote login required.
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter the valid Title").isLength({ min: 3 }),
    body("description", "description must be atleast of 5 letter").isLength({ min: 5,}),
  ],async (req, res) => {

    try {
      const { title, description, tag } = req.body;
      //if there is error return bad request and error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savednote = await notes.save();

      res.json(savednote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = router;
