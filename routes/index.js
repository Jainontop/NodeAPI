var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express123' });
  const word = req.query.s;
  const result = db.ads.aggregate([
    {
      "$lookup": {
        from: "companies",
        localField: "_id",
        foreignField: "companyId",
        as: "company"
      }
    },
    {"$unwind": "$company"},
    {
      "$replaceRoot": {
          "newRoot": {
              "$mergeObjects": ["$$ROOT", "$company" ]
          }
      }
    },
    {
      "$match": {
        "$or": [{
          primaryText: { "$regex": `*.${word}.*`, options: 'i'}
        }, {
          headline: { "$regex": `*.${word}.*`, options: 'i'}
        }, {
          description: { "$regex": `*.${word}.*`, options: 'i'}
        }, {
          name: { "$regex": `*.${word}.*`, options: 'i'}
        }]
      }
    },
    {
      "$project": {
        headline: 1,
        description: 1,
        url: 1,
        imageUrl: 1
      }
    }
]);

  res.json(result.map(v => ({
    _id: v._id,
    title: v.headline,
    image: v.imageUrl,
    desc: v.description,
    link: v.url
  })));
});

module.exports = router;
