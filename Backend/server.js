const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors")
const Navigations = require("./Models/navigationModel");
const webCategories = require("./Models/webCategoriesModel");
const app = express();
const port = 3000;

app.use(cors())

mongoose
  .connect(
    "mongodb+srv://lohtester:MLjU7nEYl3Ek50NH@cluster0.knkingd.mongodb.net/tester"
  )
  .then((value) => {
    console.info("Connected to MongoDB");
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/navigations", async (req, res) => {
  try {
    const navi = await Navigations.find({});
    res.status(200).json(navi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/navfilter", async (req, res) => {
  try {
    const navi = await Navigations.aggregate([
      {
        $lookup: {
          from: "navigations",
          let: { field1Value: "$id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$field1Value", "$navigation_id"] }, // Join documents with matching field1 and field2 values
              },
            },
            {
              $lookup: {
                from: "navigations",
                let: { field2Value: "$id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$field2Value", "$navigation_id"] },
                    },
                  },
                  {
                    $project: {
                      id: "$key",
                      title: "$comment",
                      translate: "$name",
                      children: "$children",
                      icon: "$icon",
                      type: "$type",
                      _id: 0,
                    },
                  },
                ],
                as: "children",
              },
            },

            {
              $project: {
                id: "$key",
                title: "$comment",
                translate: "$name",
                children: "$children",
                icon: "$icon",
                type: "$type",
                _id: 0,
              },
            },
          ],
          as: "children",
        },
      },
      {
        $sort: {
          id: 1,
        },
      },
      {
        $project: {
          id: "$key",
          title: "$comment",
          children: "$children",
          translate: "$name",
          icon: "$icon",
          type: "$type",
          _id: 0,
        },
      },
    ]);
    res.status(200).json(navi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const navi = await webCategories.find({}).sort({ id: 1 });
    res.status(200).json(navi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/catfilter", async (req, res) => {
  try {
    const navi = await webCategories.aggregate([
      {
        $lookup: {
          from: "web_categories",
          let: { field1Value: "$id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$field1Value", "$parent_id"] }, // Join documents with matching field1 and field2 values
              },
            },
            {
              $lookup: {
                from: "web_categories",
                let: { field1Value: "$id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$field1Value", "$parent_id"] }, // Join documents with matching field1 and field2 values
                    },
                  },
                  {
                    $lookup: {
                      from: "web_categories",
                      let: { field1Value: "$id" },
                      pipeline: [
                        {
                          $match: {
                            $expr: { $eq: ["$$field1Value", "$parent_id"] }, // Join documents with matching field1 and field2 values
                          },
                        },
                        {
                          $lookup: {
                            from: "web_categories",
                            let: { field1Value: "$id" },
                            pipeline: [
                              {
                                $match: {
                                  $expr: {
                                    $eq: ["$$field1Value", "$parent_id"],
                                  }, // Join documents with matching field1 and field2 values
                                },
                              },
                              {
                                $project: {
                                  id: "$id",
                                  title: "$title_th",
                                  url: "$link",
                                  child: "$children",
                                  _id: 0,
                                },
                              },
                              {
                                $sort: {
                                  id: 1,
                                },
                              },
                            ],
                            as: "children",
                          },
                        },
                        {
                          $project: {
                            id: "$id",
                            title: "$title_th",
                            url: "$link",
                            child: "$children",
                            _id: 0,
                          },
                        },
                        {
                          $sort: {
                            id: 1,
                          },
                        },
                      ],
                      as: "children",
                    },
                  },
                  {
                    $project: {
                      id: "$id",
                      title: "$title_th",
                      url: "$link",
                      child: "$children",
                      _id: 0,
                    },
                  },
                  {
                    $sort: {
                      id: 1,
                    },
                  },
                ],
                as: "children",
              },
            },
            {
              $project: {
                id: "$id",
                title: "$title_th",
                url: "$link",
                child: "$children",
                _id: 0,
              },
            },
            {
              $sort: {
                id: 1,
              },
            },
          ],
          as: "children",
        },
      },
      {
        $sort: {
          id: 1,
        },
      },
      {
        $project: {
          title: "$title_th",
          id: "$id",
          child: "$children",
          _id: 0,
        },
      },
    ]);
    res.status(200).json(navi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
