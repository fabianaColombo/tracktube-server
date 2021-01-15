const Axios = require("axios");
const { KEY, CHANNEL_API } = require("../secrets/apiKey");

const { Router } = require("express");
const authMiddleware = require("../auth/middleware");

const Channel = require("../models/").channel;
const Subscriber = require("../models/").subscriberCountPerDay;

const router = new Router();

const today = new Date().toISOString().split("T")[0];

router.get("/explore", async (req, res) => {
  try {
    const { id1, id2, id3 } = req.body;

    const getChannel = await Axios.get(
      `${CHANNEL_API}?part=snippet%2Cstatistics&id=${id1}&id=${id2}&id=${id3}&key=${KEY}`
    );
    const data = getChannel.data.items.map((item) => [
      item.snippet.title,
      item.statistics.subscriberCount,
      today,
    ]);

    console.log(data);
  } catch (e) {
    console.log(e.message);
  }
});

router.post("/saveChannelToFavorite", async (req, res) => {
  try {
    const { id } = req.body;

    //console.log("id", id);

    let channel = await Channel.findOne({ where: { youtubeId: id } });
    //console.log("channel", channel);

    if (!channel) {
      const getChannel = await Axios.get(
        `${CHANNEL_API}?part=snippet%2Cstatistics&id=${id}&key=${KEY}`
      );

      console.log("api response", getChannel.data.items[0].snippet.publishedAt);

      const { items } = getChannel.data;

      channel = await Channel.create({
        youtubeId: items[0].id,
        name: items[0].snippet.title,
        created: items[0].snippet.publishedAt.split("T")[0],
        url: items[0].snippet.customUrl,
        description: items[0].snippet.description,
        country: items[0].snippet.country,
      });

      subscriberToday = await Subscriber.create({
        channelId: idC,
        count: items[0].statistics.subscriberCount,
        day: today,
      });

      // const subscriberCountNow = items[0].statistics.subscriberCount;
      // console.log("subscriber count now", subscriberCountNow);

      //add error message for invalid youtube id
      return res.status(200).send({ message: "ok" });
    }

    let idC = channel.id;
    console.log("idC", idC);

    let subscriberToday = await Subscriber.findOne({
      where: { day: today, channelId: idC },
    });

    console.log("subscriber", subscriberToday);

    if (!subscriberToday) {
      const getSubscriberCount = await Axios.get(
        `${CHANNEL_API}?part=snippet%2Cstatistics&id=${id}&key=${KEY}`
      );
      console.log(
        "api response for subscriber",
        getSubscriberCount.data.items[0].statistics.subscriberCount
      );

      subscriberToday = await Subscriber.create({
        channelId: idC,
        count: getSubscriberCount.data.items[0].statistics.subscriberCount,
        day: today,
      });
      return res.status(200).send({ message: "ok" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
});

router.get("/favoriteChannels");
//check if there are favorites
//return favorite channels (name) unclude subscriberPerDay table with count and day
//make sure they are returned in the right format ["name", "count", "day"]
//no favorite? return message

module.exports = router;
