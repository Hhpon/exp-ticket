const express = require("express");
const bodyParder = require("body-parser");
const cors = require("cors");
const options = require("./util/options");
const Ticket = require("./model/ticket");
const User = require("./model/user");
const Order = require("./model/order");
const getDateAfter_n = require("./util/day");

const app = express();

app.use(bodyParder.json());
app.use(cors(options));

app.get("/", function(req, res) {
  res.cookie("userName", "admin");
  res.send("Hello World!");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  let userName = req.body.userName;
  let passWord = req.body.passWord;
  if (userName === "admin" && passWord === "admin") {
    res.cookie("userName", "admin");
    res.send({ code: 200 });
  } else {
    res.send({ code: 0 });
  }
});

app.post("/addtic", async (req, res) => {
  let oldTicMes = req.body.ticMes;
  let newTicMes = {
    ticId: oldTicMes.ticId,
    outTime: oldTicMes.date[0],
    outDate: oldTicMes.date[0].substring(0, 10),
    overTime: oldTicMes.date[1],
    price: oldTicMes.price,
    disCount: oldTicMes.disCount,
    totalVote: oldTicMes.totalVote,
    resVote: oldTicMes.totalVote,
    outCity: `${oldTicMes.outCity.province}-${oldTicMes.outCity.city}-${
      oldTicMes.outCity.area
    }`,
    overCity: `${oldTicMes.overCity.province}-${oldTicMes.overCity.city}-${
      oldTicMes.overCity.area
    }`
  };

  for (let i = 0; i < 15; i++) {
    newTicMes.outDate = getDateAfter_n(newTicMes.outDate, i);
    newTicMes.outTime = getDateAfter_n(newTicMes.outTime, i);
    newTicMes.overTime = getDateAfter_n(newTicMes.overTime, i);
    await Ticket.create(newTicMes, (err, doc) => {
      if (err) {
        res.send({ code: 0, index: i });
        return;
      }
    });
  }
  res.send({ code: 200 });
});

app.get("/getic", (req, res) => {
  Ticket.find((err, doc) => {
    if (err) {
      res.send({ code: 0 });
      return;
    }
    res.json(doc);
  });
});

app.post("/editic", (req, res) => {
  let editMes = req.body.editMes;
  for (let prop in editMes) {
    if (prop === "id") {
      continue;
    }
    Ticket.updateOne(
      { _id: editMes.id },
      { $set: { [prop]: editMes[prop] } },
      (err, doc) => {
        if (err) {
          res.send({ code: 0 });
          return;
        }
      }
    );
  }
  res.send({ code: 200 });
});

app.post("/deltic", (req, res) => {
  let _id = req.body._id;
  Ticket.deleteOne({ _id: _id }, (err, doc) => {
    if (err) {
      res.send({ code: 0 });
      return;
    }
  });
  res.send({ code: 200 });
});

app.post("/signup", (req, res) => {
  let userInfo = req.body.userInfo;
  console.log(userInfo);
  User.findOne({ userName: userInfo.userName }, (err, doc) => {
    if (doc) {
      res.send({ code: 201, message: "用户名已经被注册" });
      return;
    }
    User.create(userInfo, (err, doc) => {
      if (err) {
        res.send({ code: 202, message: "注册失败" });
        return;
      }
      res.send({ code: 200 });
    });
  });
});

app.post("/signin", (req, res) => {
  let userInfo = req.body.userInfo;
  console.log(userInfo);
  User.findOne(
    { userName: userInfo.userName, passWord: userInfo.passWord },
    (err, doc) => {
      if (doc) {
        res.send({ code: 200 });
        return;
      }
      res.send({ code: 203 });
    }
  );
});

app.post("/inquire", (req, res) => {
  let inquireInfo = req.body.inquireInfo;
  console.log(inquireInfo);
  Ticket.find(
    {
      outDate: inquireInfo.dateSel,
      outCity: inquireInfo.outCity,
      overCity: inquireInfo.overCity
    },
    (err, doc) => {
      console.log(doc);
      if (err) {
        res.send({ code: 202 });
        return;
      }
      if (doc.length) {
        res.send({ code: 200, ticInfo: doc });
        return;
      }
      res.send({ code: 201 });
    }
  );
});

app.post("/sale", (req, res) => {
  let saleInfo = req.body.saleInfo;
  Order.create(saleInfo, (err, doc) => {
    if (err) {
      res.send({ code: 201, message: "订单提交失败" });
      return;
    }
    Ticket.update(
      { _id: saleInfo._id },
      { $inc: { resVote: -1 } },
      (err, doc) => {
        console.log(err);
        console.log(doc);
      }
    );
    res.send({ code: 200 });
  });
});

app.post("/order", (req, res) => {
  console.log(req.body);
  let userName = req.body.userName;
  Order.find({ userName: userName }, (err, doc) => {
    if (!doc.length) {
      res.send({ code: 202, orderInfo: [] });
      return;
    }
    res.send({ code: 200, orderInfo: doc });
  });
});

app.post("/refund", (req, res) => {
  console.log(req.body);
  let _id = req.body._id;
  Order.deleteOne({ _id: _id }, (err, doc) => {
    console.log(doc);
  });
  Ticket.update({ _id: _id }, { $inc: { resVote: 1 } }, (err, doc) => {
    console.log(err);
    console.log(doc);
  });
  res.send({ code: 200 });
});

app.get("/getuser", (req, res) => {
  User.find((err, doc) => {
    res.send({ code: 200, userInfo: doc });
  });
});

app.post("/edituser", (req, res) => {
  let editMes = req.body.editMes;
  console.log(editMes.id);
  for (let prop in editMes) {
    if (prop === "id") {
      continue;
    }
    User.updateOne(
      { _id: editMes.id },
      { $set: { [prop]: editMes[prop] } },
      (err, doc) => {
        if (err) {
          res.send({ code: 0 });
          return;
        }
      }
    );
  }
  res.send({ code: 200 });
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
