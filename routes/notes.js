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
    body("description", "description must be atleast of 5 letter").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
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
//route 3 : Updating Note using  using Put:Get"/api/notes/updatenote login required.

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //create a newnote object
    const newnote = {};
    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }

    //find note to update and upadted
    // const note =Notes.findByIdAndUpdate();
    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(404).send("Not Found :( ");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed ! (►__◄) ");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newnote },
      { new: true }
    );

    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//route 4 : Deleting Note using  using delete:Get"/api/notes/deletenote login required.

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find note to delete and deleted
    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(404).send("Not Found :( ");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed ! (►__◄) ");
    }

    note = await Notes.findByIdAndDelete(req.params.id);

    res.json({ Success: "note has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
