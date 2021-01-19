const Axios = require("axios");
const KEY = process.env.KEY;
const { CHANNEL_API } = require("../config/constants");

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

    const now = new Date();
    const day = Date.parse(now);

    const data = getChannel.data.items.map((item) => ({
      name: item.snippet.title,
      data: [{ x: day, y: parseInt(item.statistics.subscriberCount) }],
      id: item.id,
    }));
    res.status(200).send(data);
    console.log(data);
  } catch (e) {
    next(e);
    console.log(e.message);
  }
});

router.post(
  "/saveChannelToFavorite",
  authMiddleware,
  async (req, res, next) => {
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

        return res.status(200).send({ message: "ok", newFavorite });
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
        return res.status(200).send({
          message: "new channel added to favorite",
          data: newFavorite,
        });
      } else {
        return res.status(200).send({
          message: "channel was already favorited",
          data: favoriteCheckDB,
        });
      }
    } catch (e) {
      next(e);
      console.log(e.message);
      res.status(500).send(e);
    }
  }
);

router.get("/favoriteCheckAndUpdate", authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      limit: 3,
      where: { userId: { [Op.eq]: req.user.id } },
      order: [["createdAt", "DESC"]],
      include: [{ model: Channel }],
    });

    // if (!favorites) {
    //   console.log("favorite found in favorite check?", favorites);
    //   return res
    //     .status(400)
    //     .send({ message: "This user has no favorites yet" });
    // }

    const favoriteChannelIds = favorites.map((f) => f.channel.id);

    const channelsWithSubscribersToday = await Subscriber.findAll({
      where: { day: today },
      channelId: favoriteChannelIds,
    });

    const channelIdsWithSubscribersToday = channelsWithSubscribersToday.map(
      (ch) => ch.channelId
    );

    for (let i = 0; i <= favorites.length - 1; i++) {
      const favorite = favorites[i];
      if (!channelIdsWithSubscribersToday.includes(favorite.channel.id)) {
        const getSubscriberCount0 = await Axios.get(
          `${CHANNEL_API}?part=snippet%2Cstatistics&id=${favorite.channel.youtubeId}&key=${KEY}`
        );
        console.log(getSubscriberCount0);
        await Subscriber.create({
          channelId: favorite.channel.id,
          count: getSubscriberCount0.data.items[0].statistics.subscriberCount,
          day: today,
        });
      }
    }

    const favoriteChannelsWithSubscribers = await Channel.findAll({
      where: { id: favoriteChannelIds },
      include: [Subscriber],
    });
    console.log(
      "all channels and subscribers",
      favoriteChannelsWithSubscribers
    );

    const susbcriberCountArray = favoriteChannelsWithSubscribers.map((ch) =>
      ch.subscriberCountPerDays.map((sub) => (sub.day, sub.count))
    );
    console.log(susbcriberCountArray);

    const favoriteWithSubscriber = favoriteChannelsWithSubscribers.map(
      (ch) => ({
        id: ch.id,
        name: ch.name,
        data: ch.subscriberCountPerDays.map((sub) => ({
          x: Date.parse(sub.day),
          y: sub.count,
        })),
      })
    );
    res.status(200).send({ message: "ok", favoriteWithSubscriber });
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }
});

router.get("/favoriteChannels", authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      limit: 3,
      where: { userId: { [Op.eq]: req.user.id } },
      order: [["createdAt", "DESC"]],
      include: [{ model: Channel }],
    });
    //console.log("favorite found in favorite check?", favorites);

    const favoriteChannelIds = favorites.map((f) => f.channel.id);

    //console.log("fav channel ids", favoriteChannelIds);

    const favoriteChannelsWithSubscribers = await Channel.findAll({
      where: { id: favoriteChannelIds },
      include: [Subscriber],
    });
    console.log(
      "all channels and subscribers",
      favoriteChannelsWithSubscribers
    );

    const susbcriberCountArray = favoriteChannelsWithSubscribers.map((ch) =>
      ch.subscriberCountPerDays.map((sub) => (sub.day, sub.count))
    );
    console.log(susbcriberCountArray);

    const favoriteWithSubscriber = favoriteChannelsWithSubscribers.map(
      (ch) => ({
        id: ch.id,
        name: ch.name,
        data: ch.subscriberCountPerDays.map((sub) => ({
          x: Date.parse(sub.day),
          y: sub.count,
        })),
      })
    );

    //console.log("favorite channels with subscribers", favoriteWithSubscriber);

    res.status(200).send({ message: "ok", favoriteWithSubscriber });
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }

  // const favoriteChannels = favorites.map((fav) => ({
  //   favoriteId: fav.id,
  //   id: fav.channel.id,
  //   channelName: fav.channel.name,
  //   created: fav.channel.created,
  //   country: fav.channel.country,
  //   youtubeId: fav.channel.youtubeId,
  // }));
});

router.get("/channelAndSubscribers/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
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

    let subscribers = await Subscriber.findAll({
      where: { userId: { [Op.eq]: req.user.id } },
      order: [["createdAt", "DESC"]],
      include: [Channel],
    });

    res.status(200).send(favoriteChannels);
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }
});

// const data = getChannel.data.items.map((item) => ({
//   name: item.snippet.title,
//   data: [{ x: day, y: parseInt(item.statistics.subscriberCount) }],
//   id: item.id,
// }));

// const favChannel = favorites.map((fav) => fav.channel.id);

// let channels = await Channel.findAll({
//   where: { id: favChannel },
//   include: Subscriber,
// });

// let subscribers = await Subscriber.findAll({
//   where: { id: favChannel },
//   include: Channel,
// });

//check if there are favorites
//return favorite channels (name) unclude subscriberPerDay table with count and day
//make sure they are returned in the right format ["name", "count", "day"]
//no favorite? return message

module.exports = router;
