import type { CSSProperties } from "react";
import Image from "next/image";
import { wedding as w } from "./wedding.config";
import { Anthurium, ArchPainting, JashnaLettering, EnvelopePocket, Icon, SmallEnvelope, SvgDefs, WaxSeal } from "./components/decor";
import { Reveal } from "./components/Reveal";
import { Intro } from "./components/Intro";
import { MusicPlayer } from "./components/MusicPlayer";
import { Countdown } from "./components/Countdown";
import { Calendar } from "./components/Calendar";
import { FlowerShower } from "./components/FlowerShower";

export default function Home() {
  const baseUrl = import.meta.env.BASE_URL;
  const cardBackgrounds = {
    "--card-bg-top": `url("${baseUrl}wedding-bg-top.webp")`,
    "--card-bg-mid": `url("${baseUrl}wedding-bg-mid.webp")`,
    "--card-bg-bottom": `url("${baseUrl}wedding-bg-bottom.webp")`,
  } as CSSProperties;

  return (
    <>
      <SvgDefs />
      <Intro bride={w.bride} groom={w.groom} monogram={w.monogram} />
      <FlowerShower />

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
              <MusicPlayer src={`${baseUrl}${w.songUrl}`} />
            </div>
            <Anthurium className="fl fl-player" />
          </Reveal>

          {/* ---------- Parents / invitation ---------- */}
          <section className="block parents-wrap">
            <div className="couple-papers">
              <Reveal variant="right" className="paper person-paper groom-paper">
                <Image className="person-caricature" src={`${baseUrl}groom.webp`} alt="Caricature of Jason" width={113} height={330} unoptimized />
                <h2 className="person-name">Jason Thomas George</h2>
                <p className="person-family">
                  S/O Mrs. Mary Thomas
                  <span>and Shri Thomas George</span>
                </p>
                <p className="person-place">Cheppad, Aleppy, Kerala</p>
              </Reveal>
              <Reveal variant="left" delay={180} className="paper person-paper bride-paper">
                <Image className="person-caricature" src={`${baseUrl}bride.webp`} alt="Caricature of Ashwini" width={176} height={331} unoptimized />
                <h2 className="person-name">Ashwini Vichare</h2>
                <p className="person-family">
                  D/o of Mrs. Anagha Vichare
                  <span>and Mr. Charudatta Krishna Vichare</span>
                </p>
                <p className="person-place">Varavde, Sangameshwar, Ratnagiri</p>
              </Reveal>
            </div>
          </section>

          {/* ---------- Countdown ---------- */}
          <section className="block cd-wrap">
            <Reveal variant="zoom" className="paper cd-paper">
              <h2 className="cd-title">Countdown</h2>
              <Countdown date={w.date} />
            </Reveal>
            <Anthurium className="fl fl-cd" />
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

          {/* ---------- Closing ---------- */}
          <section className="block closing-wrap">
            <Reveal variant="up" className="paper closing">
              <p className="caps tiny">{w.closing.line}</p>
              <p className="script thanks">{w.closing.thanks}</p>
              <p className="sibling-message">{w.closing.siblingMessage}</p>
              <p className="script sibling-names">{w.closing.siblings}</p>
              <p className="caps sibling-role">{w.closing.siblingRole}</p>
            </Reveal>
            <Anthurium className="fl fl-close" />
            <Anthurium className="fl fl-close2" />
          </section>

       
          </div>
        </article>
      </main>
    </>
  );
}
