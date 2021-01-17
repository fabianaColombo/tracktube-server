const Axios = require("axios");
const { KEY, CHANNEL_API } = require("../secrets/apiKey");

const { Router } = require("express");
const authMiddleware = require("../auth/middleware");

const Channel = require("../models/").channel;
const Subscriber = require("../models/").subscriberCountPerDay;
const User = require("../models/").user;
const Favorite = require("../models/").favoriteChannel;
const { Op } = require("sequelize");

const router = new Router();

const today = new Date().toISOString().split("T")[0];

router.get("/explore/:id1/:id2/:id3", async (req, res, next) => {
  try {
    const { id1, id2, id3 } = req.params;
    //console.log("this is id one", req.params);

    const getChannel = await Axios.get(
      `${CHANNEL_API}?part=snippet%2Cstatistics&id=${id1}&id=${id2}&id=${id3}&key=${KEY}`
    );
    console.log("what is get channel", getChannel);
    const data = getChannel.data.items.map((item) => ({
      name: item.snippet.title,
      data: [item.statistics.subscriberCount],
      day: today,
    }));
    res.status(200).send(data);
    console.log(data);
  } catch (e) {
    next(e);
    console.log(e.message);
  }
});

router.post("/saveChannelToFavorite", authMiddleware, async (req, res) => {
  try {
    const { id } = req.body;

    //console.log("id", id);

    let channel = await Channel.findOne({ where: { youtubeId: id } });
    //console.log("channel", channel);

    if (!channel) {
      const getChannel = await Axios.get(
        `${CHANNEL_API}?part=snippet%2Cstatistics&id=${id}&key=${KEY}`
      );
      //add error message for invalid youtube id
      console.log(
        "api response for channel",
        getChannel.data.items[0].snippet.publishedAt
      );

      const { items } = getChannel.data;

      channel = await Channel.create({
        youtubeId: items[0].id,
        name: items[0].snippet.title,
        created: items[0].snippet.publishedAt.split("T")[0],
        url: items[0].snippet.customUrl,
        description: items[0].snippet.description,
        country: items[0].snippet.country,
      });
      console.log("channel parsisted in DB", channel);

      const newChannelSubscriber = await Subscriber.create({
        channelId: channel.id,
        count: items[0].statistics.subscriberCount,
        day: today,
      });
      console.log("new channel subscriber", newChannelSubscriber);

      const newFavorite = await Favorite.create({
        userId: req.user.id,
        channelId: channel.id,
      });
      console.log("favorite persisted to DB", newFavorite);

      return res.status(200).send({ message: "ok" });
    }

    let idC = channel.id;
    console.log("idC", idC);
    console.log("userID", req.user.id);

    let subscriberToday = await Subscriber.findOne({
      where: { day: today, channelId: idC },
    });

    console.log("subscriber today already in DB", subscriberToday);

    if (!subscriberToday) {
      const getSubscriberCount = await Axios.get(
        `${CHANNEL_API}?part=snippet%2Cstatistics&id=${id}&key=${KEY}`
      );
      console.log(
        "api response for subscriber today",
        getSubscriberCount.data.items[0].statistics.subscriberCount
      );

      subscriberToday = await Subscriber.create({
        channelId: idC,
        count: getSubscriberCount.data.items[0].statistics.subscriberCount,
        day: today,
      });
    }

    let favoriteCheckDB = await Favorite.findOne({
      where: { userId: { [Op.eq]: req.user.id }, channelId: idC },
    });
    console.log("channel was favorited before?", favoriteCheckDB);

    if (!favoriteCheckDB) {
      const newFavorite = await Favorite.create({
        userId: req.user.id,
        channelId: idC,
      });
      console.log("new favorite added", newFavorite);
      return res.status(200).send({ message: "new channel added to favorite" });
    } else {
      return res.status(200).send({ message: "channel was already favorited" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
});

router.get("/favoriteChannels", authMiddleware, async (req, res) => {
  try {
    let favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      include: [Channel],
    });
    // const favoriteChannelsRes = favorites.map((fav) => ({
    //   favoriteId: fav.id,
    //   channelName: fav.channel.name,
    //   id: fav.channel.id,
    //   youtubeId: fav.channel.youtubeId,
    // }));
    // res.status(200).send(favoriteChannelsRes);

    const favChannel = favorites.map((fav) => fav.channel.id);

    let channels = await Channel.findAll({
      where: { id: favChannel },
      include: Subscriber,
    });

    let subscribers = await Subscriber.findAll({
      where: { id: favChannel },
      include: Channel,
    });
    //res.status(200).send(subscribers);
    //console.log("subscribers", subscribers);

    const channelWithSub = subscribers.count;
    console.log(channelWithSub);
    res.status(200).send(channelWithSub);
    //console.log("this is channels", channels);
    //console.log("this is subscribers", Subscriber.flat());

    // const subCount = channels.forEach(channel => { channel}) =subscriberCountPerDay.;
    // console.log("subcount", subCount);

    // const favChannelWithSubscribers = channels.map((channel) => ({
    //   channelId: channel.id,
    //   count: channel.subscriberCountPerDay.forEach((x) => x),

    //   //day: channel.subscriberCountPerDay.day,
    // }));
    //res.status(200).send(favChannelWithSubscribers);
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
});

//check if there are favorites
//return favorite channels (name) unclude subscriberPerDay table with count and day
//make sure they are returned in the right format ["name", "count", "day"]
//no favorite? return message

module.exports = router;

//.then({ include: [Subscriber], where: { channelId: channel.id } })
