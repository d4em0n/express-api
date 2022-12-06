/* eslint-disable consistent-return */
const express = require("express");
const schema = require("../db/schema");
const db = require("../db/connection");
const path = require("path");
const fs = require("fs");

const employees = db.get("employees");

const router = express.Router();

/* Get all employees */
router.get("/", async (req, res, next) => {
  try {
    const allEmployees = await employees.find({});
    res.json(allEmployees);
  } catch (error) {
    next(error);
  }
});

/* Get a specific employee */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await employees.findOne({
      _id: id,
    });

    if (!employee) {
      const error = new Error("Employee does not exist");
      return next(error);
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
});

/* Create a new employee */
router.post("/", async (req, res, next) => {
  try {
    if (req.files === null || req.files === undefined)
      return res.status(400).json({ msg: "No File Uploaded" });
    const { name, posisi, tanggalMasuk, email } = req.body;
    await schema.validateAsync({ name, posisi, tanggalMasuk, email });

    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    const employee = await employees.findOne({
      email,
    });

    // Employee already exists
    if (employee) {
      const error = new Error("Employee already exists");
      res.status(409); // conflict error
      return next(error);
    }

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        const newuser = await employees.insert({
          name,
          posisi,
          tanggalMasuk,
          email,
          photo: url,
        });

        res.status(201).json(newuser);
      } catch (error) {
        console.log(error.message);
      }
    });
  } catch (error) {
    next(error);
  }
});

/* Delete a specific employee */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await employees.findOne({
      _id: id,
    });

    // Employee does not exist
    if (!employee) {
      return next();
    }
    await employees.remove({
      _id: id,
    });

    res.json({
      message: "Employee has been deleted",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
