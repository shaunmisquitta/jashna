const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function Calendar({ date }: { date: string }) {
  // Use the calendar date as written (venue local time), not the viewer's timezone.
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); // Sunday = 0
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <div className="calendar">
      <p className="cal-kicker">The big day</p>
      <p className="cal-month">
        {MONTHS[m - 1]} {y}
      </p>
      <div className="cal-grid">
        {WEEKDAYS.map((w) => (
          <span key={w} className="cal-wd">
            {w}
          </span>
        ))}
        {cells.map((n, i) =>
          n === d ? (
            <span key={i} className="cal-day is-day">
              <svg viewBox="0 0 40 36" className="cal-heart" aria-hidden>
                <path pathLength={1} d="M20 33 C 8 25 2 18 3 11 C 4 4 13 1 20 9 C 27 1 36 4 37 11 C 38 18 32 25 20 33 Z" />
              </svg>
              <span>{n}</span>
            </span>
          ) : (
            <span key={i} className="cal-day" style={{ animationDelay: `${i * 18}ms` }}>
              {n ?? ""}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
