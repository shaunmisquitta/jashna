"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";

function Dialog({
  trigger,
  triggerClass,
  children,
  onClose,
}: {
  trigger: ReactNode;
  triggerClass: string;
  children: ReactNode;
  onClose?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className={triggerClass} onClick={() => ref.current?.showModal()}>
        {trigger}
      </button>
      <dialog
        ref={ref}
        className="modal"
        onClose={onClose}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        <div className="modal-body">
          <form method="dialog">
            <button className="modal-x" aria-label="Close">
              ×
            </button>
          </form>
          {children}
        </div>
      </dialog>
    </>
  );
}

export function RsvpModal({ deadline, whatsapp, couple }: { deadline: string; whatsapp: string; couple: string }) {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const attending = data.get("attending") === "yes";
    if (whatsapp) {
      const msg = attending
        ? `Hi ${couple}! I’m happy to confirm I’ll attend your wedding. Name: ${data.get("name")}. Guests: ${data.get("guests")}. ${data.get("message") || ""}`
        : `Hi ${couple}! Unfortunately I won’t be able to attend your wedding. Name: ${data.get("name")}. ${data.get("message") || ""}`;
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg.trim())}`, "_blank", "noopener");
    }
    setSent(true);
  };

  return (
    <Dialog trigger="RSVP here" triggerClass="btn btn-dark" onClose={() => setSent(false)}>
      {sent ? (
          <div className="rsvp-thanks">
            <svg viewBox="0 0 52 52" className="check" aria-hidden>
              <circle cx="26" cy="26" r="24" />
              <path d="M15 27l7 7 15-16" />
            </svg>
            <h3 className="modal-title">Thank you!</h3>
            <p className="modal-text">We’ve received your reply.</p>
            <form method="dialog">
              <button className="btn btn-dark">Close</button>
            </form>
          </div>
        ) : (
          <form className="rsvp-form" onSubmit={submit}>
            <p className="modal-kicker">By {deadline}</p>
            <h3 className="modal-title">RSVP</h3>
            <label>
              Full name
              <input name="name" required autoComplete="name" />
            </label>
            <fieldset>
              <label className="radio">
                <input type="radio" name="attending" value="yes" defaultChecked /> Joyfully accepts
              </label>
              <label className="radio">
                <input type="radio" name="attending" value="no" /> Regretfully declines
              </label>
            </fieldset>
            <label>
              Number of guests
              <select name="guests" defaultValue="1">
                {[1, 2, 3, 4].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label>
              Message for the couple (optional)
              <textarea name="message" rows={2} />
            </label>
            <button type="submit" className="btn btn-dark">
              Send
            </button>
          </form>
        )}
    </Dialog>
  );
}
