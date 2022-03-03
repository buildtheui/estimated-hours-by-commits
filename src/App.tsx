import "./App.css";
import commits from "../the-silence-commits.json";

interface TimeDiff {
  display: string;
  milliseconds: number;
}

type Commit = typeof commits[0] & {
  time?: string;
  fullDate?: string;
  timeDiffCommits?: TimeDiff;
  isEstimated?: boolean;
};

function millisecondsToTime(ms: number): TimeDiff {
  let minutes: string | number = Math.floor((ms / (1000 * 60)) % 60);
  let hours: string | number = Math.floor((ms / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return {
    display: `${hours}:${minutes}`,
    milliseconds: ms,
  };
}

function totalTime(ms: number) {
  let minutes: string | number = Math.floor((ms / (1000 * 60)) % 60);
  let hours: string | number = Math.floor(ms / (1000 * 60 * 60));

  const normalizedMinutes = minutes / 60;

  return {
    display: `${hours}:${minutes}`,
    milliseconds: ms,
    normalized: hours + normalizedMinutes,
  };
}

const estimatedOnlyOneCommit: Record<string, { milliseconds: number }> = {
  "20/1/2022": { milliseconds: 180000 },
  "11/1/2022": { milliseconds: 180000 },
  "18/12/2021": { milliseconds: 5400000 },
  "13/12/2021": { milliseconds: 900000 },
  "6/12/2021": { milliseconds: 900000 },
};

function App() {
  const timeDiff: Record<string, TimeDiff> = {};
  const groupByDate = commits.reduce((group, commit) => {
    const { date, ...rest } = commit;
    const convertedDate = new Date(date);
    const parseDate = new Intl.DateTimeFormat("es-CO").format(convertedDate);
    group[parseDate] = group[parseDate] ?? [];
    group[parseDate].push({
      ...rest,
      date: parseDate,
      time: `${convertedDate.getHours()}:${convertedDate.getMinutes()}`,
      fullDate: date,
    });
    return group;
  }, {} as Record<string, Commit[]>);

  for (const key in groupByDate) {
    if (groupByDate.hasOwnProperty(key) && groupByDate[key].length > 1) {
      const item = groupByDate[key];
      const diff =
        // @ts-expect-error
        new Date(item[0].fullDate) - new Date(item[item.length - 1].fullDate);
      timeDiff[key] = millisecondsToTime(diff);
    }
  }

  console.log(timeDiff);

  const totalMsBetweenCommits = Object.values(timeDiff).reduce(
    (acc, item) => acc + item.milliseconds,
    0
  );

  const totalOneCommitEstimatedTime = Object.values(
    estimatedOnlyOneCommit
  ).reduce((acc, item) => acc + item.milliseconds, 0);

  const totalTimeBetweenCommits = totalTime(
    totalMsBetweenCommits + totalOneCommitEstimatedTime
  );

  return (
    <div className="app">
      <ul className="timeline">
        {Object.entries(groupByDate).map(([key, value]) => {
          return (
            <div className="commit-block" key={key}>
              <p className="commit-date">
                {key} - (
                <span className="total-time">
                  total hours worked:{" "}
                  {timeDiff[key]
                    ? timeDiff[key].display
                    : millisecondsToTime(
                        estimatedOnlyOneCommit[key].milliseconds
                      ).display}
                </span>
                ){" "}
                {estimatedOnlyOneCommit[key] && (
                  <span className="aprox">(this is an aproximation)</span>
                )}
              </p>
              <ul>
                {value.map((item, idx) => {
                  return (
                    <li key={idx}>
                      {`${item.title}`}{" "}
                      <span className="commit-time">{`- commited at: ${item.time}`}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </ul>
      <div className="results">
        <div className="total-hours">
          <strong>Total hours worked:</strong> {totalTimeBetweenCommits.display}
        </div>
        <div className="total-payment">
          <p>calculated by $30/hr</p>
          <p>
            <strong>Total ($):</strong>{" "}
            {totalTimeBetweenCommits.normalized * 30}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
