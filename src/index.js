const micro = require('micro');
const fetch = require('node-fetch');

function getMinutes(value) {
  if ([11, 12, 13, 14].includes(value)) return "минут";
  else if ([2, 3, 4].includes(value % 10)) return "минуты";
  else if ([0, 5, 6, 7, 8, 9].includes(value % 10)) return "минут";
  else return "минуту"
}

const server = micro(async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const url = `https://api.rasp.yandex.net/v3.0/search/?apikey=dc4a8ebe-c490-4b70-af4f-b0e4754b30f4&format=json&from=s9601767&to=s2000001&lang=ru_RU&page=1&limit=150&date=${year}-${month}-${day}`;

  const awaiting1 = fetch(url, {method: "Get"})
    .then(res => res.json())
    .then(
      ({segments}) => {
        const departure = segments.filter(({departure}) => new Date(departure) > now)[0].departure;
        const depDate = new Date(departure);
        const depHours = depDate.getHours();
        const depMinutes = depDate.getMinutes();
        const nowHours = now.getHours();
        const nowMinutes = now.getMinutes();
        return (depHours - nowHours) * 60 + (depMinutes - nowMinutes)
      }
    );

  const awaiting2 = fetch(url, {method: "Get"})
    .then(res => res.json())
    .then(
      ({segments}) => {
        const departure = segments.filter(({departure}) => new Date(departure) > now)[1].departure;
        const depDate = new Date(departure);
        const depHours = depDate.getHours();
        const depMinutes = depDate.getMinutes();
        const nowHours = now.getHours();
        const nowMinutes = now.getMinutes();
        return (depHours - nowHours) * 60 + (depMinutes - nowMinutes)
      }
    );

  return {
    response: {
      text: `Ближайшая электричка до Москвы через ${await awaiting1} ${getMinutes(await awaiting1)}, а следующая - через ${await awaiting2} ${getMinutes(await awaiting2)}`,
      end_session: true
    },
    version: '1.0'
  };
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}, tunnel: http://localhost:4040`));
