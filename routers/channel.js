const Axios = require("axios");
const { KEY, CHANNEL_API } = require("../secrets/apiKey");

const { Router } = require("express");
const authMiddleware = require("../auth/middleware");

const Channel = require("../models/").channel;

const router = new Router();

router.get("/explore", async (req, res) => {
  try {
    const { id1, id2, id3 } = req.body;

    const getChannel = await Axios.get(
      `${CHANNEL_API}?part=snippet%2Cstatistics&id=${id1}&id=${id2}&id=${id3}&key=${KEY}`
    );
    const data = getChannel.data.items.map((item) => [
      item.snippet.title,
      item.statistics.subscriberCount,
      new Date().toISOString().split("T")[0],
    ]);

    console.log(data);
  } catch (e) {
    console.log(e.message);
  }
});

router.get("/subscriberCount", async (req, res) => {
  try {
    const { id } = req.body;

    console.log("id", id);

    let channel = await Channel.findOne({ where: { youtubeId: id } });
    console.log("channel", Channel);
    if (!channel) {
      const getChannel = await Axios.get(
        `${CHANNEL_API}?part=snippet%2Cstatistics&id=${id}&key=${KEY}`
      );

      channel = await Channel.create({
        youtubeId: getChannel.items.id,
        name: getChannel.items.snippet.title,
        created: getChannel.items.id,
        url: getChannel.items.snippet.customUrl,
        description: getChannel.items.snippet.description,
        country: getChannel.items.country,
      });
    }
    res.status(200).send({ message: "ok" });
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
