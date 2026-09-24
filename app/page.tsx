import type { CSSProperties } from "react";
import { wedding as w } from "./wedding.config";
import { Anthurium, ArchPainting, JashnaLettering, EnvelopePocket, Icon, OldLetter, SmallEnvelope, SvgDefs, Tag, WaxSeal } from "./components/decor";
import { Reveal } from "./components/Reveal";
import { Intro } from "./components/Intro";
import { MusicPlayer } from "./components/MusicPlayer";
import { Countdown } from "./components/Countdown";
import { Calendar } from "./components/Calendar";
import { RsvpModal } from "./components/Modal";
import { assetPath } from "./asset-path";

const reception = w.events.find((e) => e.name === "Reception");
const gcalDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
const calendarUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(`${w.bride} & ${w.groom}’s Wedding`)}` +
  `&dates=${gcalDate(w.date)}/${gcalDate(w.endDate)}` +
  `&location=${encodeURIComponent(reception ? `${reception.venue}, ${reception.address.join(", ")}` : "")}`;

export default function Home() {
  const couple = `${w.bride} & ${w.groom}`;
  const cardBackgrounds = {
    "--bg-top-sm": `url("${assetPath("/bg-top.webp")}")`,
    "--bg-mid-sm": `url("${assetPath("/bg-mid.jpg")}")`,
    "--bg-bottom-sm": `url("${assetPath("/bg-bottom.webp")}")`,
    "--bg-top-lg": `url("${assetPath("/bg-top-lg.webp")}")`,
    "--bg-mid-lg": `url("${assetPath("/bg-mid-lg.jpg")}")`,
    "--bg-bottom-lg": `url("${assetPath("/bg-bottom-lg.webp")}")`,
  } as CSSProperties;

  return (
    <>
      <SvgDefs />
      <Intro bride={w.bride} groom={w.groom} monogram={w.monogram} />

      <main className="stage">
        <article className="card" style={cardBackgrounds}>
          {/* Title sits outside the scaled column so it can be placed against the full-width artwork */}
          <header className="title">
            <h1>
              <JashnaLettering className="title-word" />
            </h1>
          </header>
          <div className="column">
          {/* ---------- Hero envelope ---------- */}

          <section className="hero" aria-label="Invitation">
            <div className="hero-back" />
            <ArchPainting className="hero-arch" />
            <EnvelopePocket className="hero-pocket" />
            <WaxSeal monogram={w.monogram} className="hero-seal" />
          </section>

          {/* ---------- Music ---------- */}
          <Reveal className="block player-wrap" variant="up">
            <div className="paper">
              <MusicPlayer src={assetPath(w.songUrl as `/${string}`)} />
            </div>
            <Anthurium className="fl fl-player" />
          </Reveal>

          {/* ---------- Parents / invitation ---------- */}
          <section className="block parents-wrap">
            <Reveal variant="right" delay={250} className="letter-slot letter-parents">
              <OldLetter />
            </Reveal>
            <Reveal variant="up" className="paper parents">
              <p className="verse">“{w.verse.text}”</p>
              <p className="verse-ref">{w.verse.ref}</p>
              <p className="caps small">{w.blessing}</p>
              <div className="parents-cols">
                {[w.parents.groom, w.parents.bride].map((p) => (
                  <div key={p.label}>
                    <p className="caps tiny">{p.label}</p>
                    {p.names.map((n) => (
                      <p key={n} className="parent-name">
                        {n}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
              <p className="script-names" aria-label={couple}>
                <span className="sn sn-1">{w.bride}</span>
                <span className="sn sn-amp">&amp;</span>
                <span className="sn sn-2">{w.groom}</span>
              </p>
              <p className="invite-line">{w.inviteLine}</p>
            </Reveal>
            <Reveal variant="drop" delay={500} className="tag-slot tag-calendar">
              <a href={calendarUrl} target="_blank" rel="noopener" className="tag-link">
                <Tag>
                  Add
                  <br />to your
                  <br />
                  calendar
                </Tag>
              </a>
            </Reveal>
          </section>

          {/* ---------- Calendar ---------- */}
          <section className="block cal-wrap">
            <Reveal variant="up" className="paper cal-paper">
              <p className="quote">{w.storyQuote}</p>
              <Calendar date={w.date} />
            </Reveal>
            <Anthurium className="fl fl-cal" />
            <Anthurium className="fl fl-cal2" />
          </section>

          {/* ---------- Events ---------- */}
          <section className="block events-wrap">
            <Reveal variant="drop" className="env-slot">
              <SmallEnvelope monogram={w.monogram} />
            </Reveal>
            <div className="events">
              {w.events.map((e, i) => (
                <Reveal
                  key={e.name}
                  variant={i % 2 ? "right" : "left"}
                  delay={150 + i * 200}
                  className={`paper event event-${e.icon}`}
                >
                  <Icon name={e.icon} className="event-icon" />
                  <h2 className="event-name">{e.name}</h2>
                  <p className="event-date">{e.date}</p>
                  <p className="event-time">{e.time}</p>
                  <span className="event-rule" />
                  <p className="event-venue">{e.venue}</p>
                  {e.address.map((a) => (
                    <p key={a} className="event-address">
                      {a}
                    </p>
                  ))}
                  <a className="btn btn-outline" href={e.mapsUrl} target="_blank" rel="noopener">
                    View location
                  </a>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---------- Itinerary ---------- */}
          <section className="block itin-wrap">
            <Reveal variant="left" delay={200} className="letter-slot letter-itin">
              <OldLetter />
            </Reveal>
            <Reveal variant="up" className="itinerary">
              <h2 className="itin-title">Itinerary</h2>
              <ol className="timeline">
                {w.itinerary.map((item, i) => (
                  <li key={item.time} className={i % 2 ? "is-flip" : ""} style={{ "--i": i } as CSSProperties}>
                    <span className="tl-icon">
                      <Icon name={item.icon} />
                    </span>
                    <span className="tl-dot" />
                    <span className="tl-text">
                      <span className="tl-time">{item.time}</span>
                      <span className="tl-label">{item.label}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <WaxSeal monogram={w.monogram} className="float-seal seal-itin" />
          </section>

          {/* ---------- Countdown ---------- */}
          <section className="block cd-wrap">
            <Reveal variant="zoom" className="paper cd-paper">
              <h2 className="cd-title">Countdown</h2>
              <Countdown date={w.date} />
            </Reveal>
            <Anthurium className="fl fl-cd" />
          </section>

          {/* ---------- RSVP ---------- */}
          <Reveal as="section" variant="fade" className="block rsvp">
            <div className="rsvp-back" />
            <ArchPainting className="rsvp-arch" />
            <div className="rsvp-card">
              <h2 className="section-title">RSVP</h2>
              <p>Kindly confirm your attendance by {w.rsvp.deadline}.</p>
              <RsvpModal deadline={w.rsvp.deadline} whatsapp={w.rsvp.whatsapp} couple={couple} />
            </div>
            <EnvelopePocket className="rsvp-pocket" />
            <WaxSeal monogram={w.monogram} className="rsvp-seal" />
          </Reveal>

          {/* ---------- Closing ---------- */}
          <section className="block closing-wrap">
            <Reveal variant="up" className="paper closing">
              <p className="caps tiny">{w.closing.line}</p>
              <p className="script thanks">{w.closing.thanks}</p>
            </Reveal>
            <Anthurium className="fl fl-close" />
            <Anthurium className="fl fl-close2" />
          </section>

          <footer className="foot">
            <p className="credit">
              Developed by <span>@shaunmisquitta</span>
            </p>
          </footer>
          </div>
        </article>
      </main>
    </>
  );
}
