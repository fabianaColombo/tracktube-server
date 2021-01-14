"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "channels",
      [
        {
          youtubeId: "UCMpWpGXG8tlWA6Xban2m6oA",
          name: "Diva Depressão",
          created: null,
          url: "https://www.youtube.com/channel/UCMpWpGXG8tlWA6Xban2m6oA",
          description: "O veneno chega a escorrer",
          country: "BR",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          youtubeId: "UCMNurW2brJo41PgUgI7Wwtg",
          name: "Virou Festa",
          created: null,
          url: "https://www.youtube.com/channel/UCMNurW2brJo41PgUgI7Wwtg",
          description:
            "Sua primeira vez aqui no canal #VirouFesta? Oi! Somos o Tiago Fabri e o Alexandre Duarte, e aqui com a gente você vai se atualizar dos babados que estão dominando os sites de fofocas dos famosos, vamos ampliar seu foco sobre as noticias da TV, te deixar por dentro de quem está viralizando e ficando conhecido na web brasileira por se tornar memes engraçados, debochar de quem se faz de diva nas redes sociais, mas que na real tá afundada na depressão, e também matar saudades de momentos épicos da TV nos anos 80, 90 e 2000. Pegue sua xícara de café, aperte os cintos, pois, nós sempre temos um bom abacaxi pra descascar pra você.",
          country: "BR",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          youtubeId: "UCF8MQYobXcHejWAaet4nSxA",
          name: "Blogueirinha",
          created: null,
          url: "https://www.youtube.com/channel/UCF8MQYobXcHejWAaet4nSxA",
          description:
            "Oi meninas e meninos também, tutupom? Bem-vindos ao canal da Blogueirinha. Blogueira, youtuber, mãe, vegana, modelo de passarela, modelo fotográfica, estudante de medicina na USP de LA e tutupom! Contato: blogueirinha@diaestudio.com",
          country: "BR",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          youtubeId: "UCJ12sWRTfduf-iBDHPNxbww",
          name: "brunomotta",
          created: null,
          url: "https://www.youtube.com/channel/UCJ12sWRTfduf-iBDHPNxbww",
          description:
            "Stand Up, Humor e +! Toda semana tem DIÁRIO SEMANAL - as notícias com humor de verdade. E além disso, diversos vídeos de comédia stand up e participações na TV. Se inscreva no canal! CONTATO, PARCERIAS, PERMUTAS E COISINHAS: contratebrunomotta@gmail.com",
          country: "BR",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          youtubeId: "UCEWHPFNilsT0IfQfutVzsag",
          name: "Porta dos Fundos",
          created: null,
          url: "https://www.youtube.com/channel/UCEWHPFNilsT0IfQfutVzsag",
          description:
            'É um dos maiores canais do YouTube Brasil, ultrapassando 5 bilhões de visualizações e 16 milhões de inscritos. Em abril de 2019, chegou também ao México com o canal "Backdoor - Humor por donde no lo esperas", já com mais de 3 milhões de inscritos. O Porta dos Fundos se tornou uma referência em entretenimento multiplataforma, atuando em séries, filmes, branded content, entre outras produções, estabelecendo parcerias com empresas, canais de TV e plataformas de streaming. Inscrevam-se e assistam :-) CONTATO: contato@portadosfundos.com.br',
          country: "BR",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          youtubeId: "UCMOB6uDg7e-h8OuCw8dK2_Q",
          name: "Alter",
          created: null,
          url: "https://www.youtube.com/channel/UCMOB6uDg7e-h8OuCw8dK2_Q",
          description:
            "The most provocative minds in horror bring you three new short films every week exploring the human condition through warped and uncanny perspectives. Be ready to leave the world you know behind and subscribe. Once you watch, you are forever ALTERed. Filmmakers should visit https://watchalter.com/contact/ to submit your horror shorts. (Only completed horror shorts will be considered. Unsolicited scripts or pitches will be immediately deleted without review.)",
          country: "US",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          youtubeId: "UC7jAvyBBdhKuhkg_vS44McQ",
          name: "Jason Roa",
          created: "2007-08-23",
          url: "https://www.youtube.com/channel/UC7jAvyBBdhKuhkg_vS44McQ",
          description: null,
          country: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("channels", null, {});
  },
};
